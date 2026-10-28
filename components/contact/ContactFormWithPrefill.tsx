"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { websitePricing } from "@/lib/services";
import { typeFromSlug } from "@/lib/validation";

/**
 * Preselects the project type from `/contact?type=web|ai|design|crm|ads|marketing` (older links such as
 * `?type=static` still work), which is where the option picker and the stage's buttons send visitors. A
 * `plan=static|ecom-5|ecom-10` also starts the message with the chosen package. Rendered inside <Suspense> by
 * the page, so the rest of the page stays statically prerendered.
 */
export function ContactFormWithPrefill() {
  const params = useSearchParams();
  const type = typeFromSlug(params.get("type"));
  const tier = websitePricing.find((t) => t.id === params.get("plan") && t.inr !== undefined);
  const message = tier ? `Package: ${tier.label}${tier.detail ? `, ${tier.detail}` : ""}.\n\nAbout my project: ` : "";
  // keyed so following another option link resets the form to that option
  return <ContactForm key={`${type ?? "none"}-${tier?.id ?? ""}`} initialType={type} initialMessage={message} />;
}
