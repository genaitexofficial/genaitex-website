"use client";

import { useId, useState } from "react";
import * as z from "zod/mini";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import {
  budgets,
  contactSchema,
  projectTypes,
  timelines,
  type ContactField,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<ContactField, string>>;

const fieldBase =
  "w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3.5 text-fg placeholder:text-subtle transition-colors hover:border-line-strong focus:border-violet focus:bg-white/[0.05] focus:outline-none aria-[invalid=true]:border-rose-400/70";

export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [projectType, setProjectType] = useState<string>("");

  const id = (name: string) => `${uid}-${name}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = contactSchema.safeParse({ ...data, projectType });

    if (!parsed.success) {
      const flat = z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>;
      const next: FieldErrors = {};
      for (const [key, msgs] of Object.entries(flat)) {
        if (msgs?.[0]) next[key as ContactField] = msgs[0];
      }
      setErrors(next);
      setStatus("idle");
      // Move focus to the first invalid field so keyboard and screen-reader users land on it.
      const first = Object.keys(next)[0];
      if (first === "projectType") document.getElementById(id("projectType"))?.focus();
      else form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setServerError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (res.ok && body.ok) {
        setStatus("success");
        form.reset();
        setProjectType("");
        return;
      }
      if (body.fieldErrors) setErrors(body.fieldErrors);
      setServerError(body.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="glass flex flex-col items-center rounded-3xl px-8 py-16 text-center"
      >
        <CheckCircle2 className="h-14 w-14 text-emerald-400" aria-hidden />
        <h2 className="mt-6 text-3xl font-semibold tracking-tight">Message sent</h2>
        <p className="mt-3 max-w-sm text-pretty text-muted">
          Thanks for reaching out. We&apos;ll read your message and reply with next steps, usually
          within one business day.
        </p>
        <Button variant="secondary" className="mt-8" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const err = (name: ContactField) =>
    errors[name] ? (
      <p id={id(`${name}-err`)} className="mt-2 text-sm text-rose-300">
        {errors[name]}
      </p>
    ) : null;
  const aria = (name: ContactField) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? id(`${name}-err`) : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="glass space-y-6 rounded-3xl p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className="mb-2 block text-sm font-medium">
            Your name
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className={fieldBase}
            {...aria("name")}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("email")} className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldBase}
            {...aria("email")}
          />
          {err("email")}
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 block text-sm font-medium">What do you need?</legend>
        <div
          role="radiogroup"
          id={id("projectType")}
          tabIndex={-1}
          aria-describedby={errors.projectType ? id("projectType-err") : undefined}
          className="flex flex-wrap gap-2 outline-none"
        >
          {projectTypes.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="projectType"
                value={t}
                checked={projectType === t}
                onChange={() => setProjectType(t)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "inline-block rounded-full border px-4 py-2.5 text-sm transition-colors",
                  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan",
                  projectType === t
                    ? "border-transparent bg-fg text-ink"
                    : "border-line text-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {t}
              </span>
            </label>
          ))}
        </div>
        {err("projectType")}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("budget")} className="mb-2 block text-sm font-medium">
            Budget
          </label>
          <select
            id={id("budget")}
            name="budget"
            defaultValue=""
            className={fieldBase}
            {...aria("budget")}
          >
            <option value="" disabled>
              Select a range
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {err("budget")}
        </div>
        <div>
          <label htmlFor={id("timeline")} className="mb-2 block text-sm font-medium">
            Timeline
          </label>
          <select
            id={id("timeline")}
            name="timeline"
            defaultValue=""
            className={fieldBase}
            {...aria("timeline")}
          >
            <option value="" disabled>
              When do you need it?
            </option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {err("timeline")}
        </div>
      </div>

      <div>
        <label htmlFor={id("message")} className="mb-2 block text-sm font-medium">
          Tell us about your project
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={6}
          placeholder="What are you building, who is it for, and what does success look like?"
          className={clsx(fieldBase, "resize-y")}
          {...aria("message")}
        />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {serverError}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="h-4 w-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
