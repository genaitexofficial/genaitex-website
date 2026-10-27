"use client";

import Link from "next/link";
import { useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Subtly pulls the button toward the cursor. Fine pointers only. */
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
}

type LinkProps = CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | "href"
  >;
type NativeProps = CommonProps & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps
  >;

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[box-shadow,background-color,border-color,color] duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(110deg,#8b5cf6,#22d3ee)] text-[#05060a] font-semibold shadow-[0_0_40px_-10px_rgba(139,92,246,0.8)] hover:shadow-[0_0_60px_-8px_rgba(34,211,238,0.7)]",
  secondary:
    "glass text-fg hover:border-line-strong hover:bg-white/[0.07]",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  magnetic = true,
  className,
  children,
  ...rest
}: LinkProps | NativeProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const classes = clsx(base, variants[variant], sizes[size], className);

  function onMove(e: React.PointerEvent<HTMLElement>) {
    if (!magnetic || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  let inner: React.ReactNode;
  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as Omit<LinkProps, keyof CommonProps>;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    inner = external ? (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...anchorProps}
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  } else {
    inner = (
      <button className={classes} {...(rest as Omit<NativeProps, keyof CommonProps>)}>
        {children}
      </button>
    );
  }

  return (
    <m.span
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {inner}
    </m.span>
  );
}
