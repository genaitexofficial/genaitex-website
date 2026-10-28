import { Bot, Code, Globe, Store } from "lucide-react";
import { clsx } from "clsx";
import type { ServiceIcon as IconName } from "@/lib/services";

const icons = { globe: Globe, store: Store, code: Code, bot: Bot } as const;

export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = icons[name];
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-flex h-12 w-12 items-center justify-center rounded-2xl icon-tile",
        className,
      )}
    >
      <Icon className="h-6 w-6 text-cyan" />
    </span>
  );
}
