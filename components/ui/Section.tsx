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
        "py-14 md:py-[72px] lg:py-[104px]",
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

