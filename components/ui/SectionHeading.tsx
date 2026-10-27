import { clsx } from "clsx";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Render the title as h1 on pages where it is the main heading. */
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={clsx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{description}</p>
      )}
    </Reveal>
  );
}
