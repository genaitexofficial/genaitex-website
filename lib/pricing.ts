/**
 * Prices are written once, in rupees (the amounts quoted by the studio), and shown in rupees or dollars.
 * Dollar figures are a fixed, rounded conversion (see INR_PER_USD) and are always marked approximate; replace
 * `usd()` with exact amounts if you would rather quote dollars precisely.
 */
export const INR_PER_USD = 85;

/** Approximate dollars for a rupee amount, rounded to the nearest $5. */
export const usd = (inr: number) => Math.max(5, Math.round(inr / INR_PER_USD / 5) * 5);

/** ₹1,00,000 style grouping (last three digits, then pairs). */
export function formatInr(amount: number) {
  const digits = String(Math.round(amount));
  const head = digits.slice(0, -3);
  const tail = digits.slice(-3);
  return "₹" + (head ? head.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "") + tail;
}

export const formatUsd = (amount: number) => "$" + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** One line of a service's price list. No `inr` means the price depends on scope ("Custom quote"). */
export interface PriceTier {
  id: string;
  label: string;
  detail?: string;
  inr?: number;
}
