import * as z from "zod/mini";

export const projectTypes = [
  "Static website",
  "Shopify storefront",
  "Custom development",
  "AI & automation",
  "Not sure yet",
] as const;

export type ProjectType = (typeof projectTypes)[number];

/** `/contact?type=…` values, used by the option picker and the stage's call-to-action buttons. */
export const typeSlugs: Record<string, ProjectType> = {
  static: "Static website",
  shopify: "Shopify storefront",
  custom: "Custom development",
  ai: "AI & automation",
};

export const typeFromSlug = (slug: string | null | undefined): ProjectType | undefined =>
  slug ? typeSlugs[slug] : undefined;

export const budgets = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $8,000",
  "$8,000 – $20,000",
  "$20,000+",
  "Not sure yet",
] as const;

export const timelines = [
  "As soon as possible",
  "Within 1–2 months",
  "Within 3–6 months",
  "Just exploring",
] as const;

/**
 * Shared by the client form and the API route so both validate identically.
 * Uses zod/mini (tree-shakable) to keep the contact page's JavaScript small.
 */
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "Please enter your name."), z.maxLength(80)),
  email: z.email("Please enter a valid email address."),
  projectType: z.enum(projectTypes, "Choose a project type."),
  budget: z.enum(budgets, "Choose a budget range."),
  timeline: z.enum(timelines, "Choose a timeline."),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(20, "Tell us a little more (at least 20 characters)."),
      z.maxLength(4000, "Please keep it under 4,000 characters."),
    ),
  /** Honeypot: real users never see or fill this. The API route drops submissions where it is set. */
  website: z.optional(z.string().check(z.maxLength(200))),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
