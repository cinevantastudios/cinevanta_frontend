import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardTone = "white" | "cream" | "yellow" | "sand" | "ink";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  children: ReactNode;
}

const toneClasses: Record<CardTone, string> = {
  white: "bg-white text-ink",
  cream: "bg-cream text-ink",
  yellow: "bg-yellow text-ink",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-cream",
};

export function Card({ tone = "white", className, children, ...props }: CardProps) {
  return (
    <div
      data-surface={tone === "ink" ? "ink" : undefined}
      className={cn(
        "flex min-h-[270px] flex-col justify-between rounded-card border-2 border-ink p-[26px]",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

