import { Bot, Globe, Megaphone, Palette, Sparkles, Users } from "lucide-react";
import { clsx } from "clsx";
import type { ServiceIcon as IconName } from "@/lib/services";

const icons = { globe: Globe, bot: Bot, palette: Palette, users: Users, sparkles: Sparkles, megaphone: Megaphone } as const;

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
