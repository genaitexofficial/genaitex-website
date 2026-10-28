/**
 * Which currency prices are shown in. Prices exist in the page twice (rupees and dollars) and CSS shows the
 * one matching <html data-currency>, which an inline script sets before first paint: the visitor's saved
 * choice, else rupees for visitors in India (by time zone or language) and dollars for everyone else.
 */
export type Currency = "inr" | "usd";

export const CURRENCY_KEY = "genaitex-currency";
const EVENT = "genaitex:currency";

function saved(): Currency | null {
  try {
    const v = localStorage.getItem(CURRENCY_KEY);
    return v === "inr" || v === "usd" ? v : null;
  } catch {
    return null;
  }
}

function detect(): Currency {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/^Asia\/(Kolkata|Calcutta)$/.test(zone) || /-IN$/i.test(navigator.language || "")) return "inr";
  } catch {
    // fall through to dollars
  }
  return "usd";
}

export const getSnapshot = (): Currency => saved() ?? detect();
export const getServerSnapshot = (): Currency => "inr";

export function setCurrency(next: Currency) {
  try {
    localStorage.setItem(CURRENCY_KEY, next);
  } catch {
    // storage blocked: the choice lasts for this page view
  }
  document.documentElement.dataset.currency = next;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/** Source of the inline script in app/layout.tsx that sets data-currency before first paint. */
export const currencyScript = `(function(){try{var d=document.documentElement,c=localStorage.getItem("${CURRENCY_KEY}");if(c!=="inr"&&c!=="usd"){var z=Intl.DateTimeFormat().resolvedOptions().timeZone||"",l=navigator.language||"";c=/^Asia\\/(Kolkata|Calcutta)$/.test(z)||/-IN$/i.test(l)?"inr":"usd"}d.dataset.currency=c}catch(e){}})();`;
