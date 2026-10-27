import { Resend } from "resend";
import * as z from "zod/mini";
import { contactSchema } from "@/lib/validation";
import { site } from "@/lib/site";

const MAX_BODY_BYTES = 20_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort, per-instance rate limit. On serverless this resets when an instance recycles,
// which is fine for stopping casual abuse; use a shared store (e.g. Upstash) if you need strict limits.
const hits = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, " ").trim();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Message is too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: firstErrors(parsed.error) },
      { status: 400 },
    );
  }

  const { website, name, email, projectType, budget, timeline, message } = parsed.data;

  // Honeypot filled: pretend it worked so the bot learns nothing, but send nothing.
  if (website) return Response.json({ ok: true });

  const subject = oneLine(`New inquiry: ${projectType} from ${name}`);
  const text = [
    `Name: ${oneLine(name)}`,
    `Email: ${email}`,
    `Project type: ${projectType}`,
    `Budget: ${budget}`,
    `Timeline: ${timeline}`,
    "",
    message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`;

  if (!apiKey) {
    // Local development convenience only. In production a missing key must fail loudly,
    // otherwise real leads would be silently dropped.
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[contact] RESEND_API_KEY not set; logging instead of sending.\nTo: ${to}\n${subject}\n\n${text}\n`);
      return Response.json({ ok: true });
    }
    console.error("[contact] RESEND_API_KEY is not configured");
    return Response.json(
      { ok: false, error: `We couldn't send your message. Please email ${site.email} directly.` },
      { status: 500 },
    );
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });
    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err instanceof Error ? err.message : err);
    return Response.json(
      { ok: false, error: `We couldn't send your message. Please email ${site.email} directly.` },
      { status: 502 },
    );
  }
}

function firstErrors(error: Parameters<typeof z.flattenError>[0]) {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(
    Object.entries(flat).flatMap(([k, v]) => (v?.[0] ? [[k, v[0]]] : [])),
  );
}
