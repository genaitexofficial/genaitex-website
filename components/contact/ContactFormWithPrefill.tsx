"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { typeFromSlug } from "@/lib/validation";

/**
 * Preselects the project type from `/contact?type=static|shopify|custom|ai`, which is where the
 * option picker and the stage's buttons send visitors. Rendered inside <Suspense> by the page, so the
 * rest of the page stays statically prerendered.
 */
export function ContactFormWithPrefill() {
  const type = typeFromSlug(useSearchParams().get("type"));
  // keyed so following another option link resets the form to that option
  return <ContactForm key={type ?? "none"} initialType={type} />;
}
