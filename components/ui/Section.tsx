import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "cream" | "sand" | "ink" | "yellow";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  bordered?: boolean;
  children: ReactNode;
}

const toneClasses: Record<SectionTone, string> = {
  cream: "bg-cream text-ink",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-cream",
  yellow: "bg-yellow text-ink",
};

/** Full-bleed vertical band applying surface background, data-surface attribute, and optional 2px borders. */
export function Section({
  tone = "cream",
  bordered = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-surface={tone === "ink" ? "ink" : undefined}
      className={cn(
        "py-14 md:py-[4.5rem] lg:py-[6.5rem]",
        toneClasses[tone],
        bordered && "border-y-2 border-ink",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

