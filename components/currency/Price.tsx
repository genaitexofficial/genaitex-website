import { clsx } from "clsx";
import { formatInr, formatUsd, usd } from "@/lib/pricing";

/**
 * A price in both currencies at once; CSS shows the one for <html data-currency> (so the page prerenders
 * statically, with no flash and no hydration mismatch). Without an amount it reads "Custom quote".
 */
export function Price({
  inr,
  prefix = "From",
  className,
}: {
  inr?: number;
  prefix?: string;
  className?: string;
}) {
  if (inr === undefined) return <span className={className}>Custom quote</span>;
  return (
    <span className={clsx("whitespace-nowrap", className)}>
      {prefix && <>{prefix} </>}
      <span data-cur="inr">{formatInr(inr)}</span>
      <span data-cur="usd" title={`About ${formatUsd(usd(inr))}, converted from ${formatInr(inr)}`}>
        ~{formatUsd(usd(inr))}
      </span>
    </span>
  );
}
