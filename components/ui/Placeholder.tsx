import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PlaceholderTone = "yellow" | "sand" | "white" | "ink";
export type PlaceholderRatio = "16/9" | "4/5" | "4/3" | "1/1" | "3/4" | "8/1" | "5/2" | "auto";

export interface PlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  tone?: PlaceholderTone;
  ratio?: PlaceholderRatio;
  children?: ReactNode;
}

const toneClasses: Record<PlaceholderTone, { container: string; frame: string; text: string }> = {
  yellow: {
    container: "bg-yellow text-ink",
    frame: "border-ink/35",
    text: "text-ink",
  },
  sand: {
    container: "bg-sand text-ink",
    frame: "border-ink/30",
    text: "text-ink",
  },
  white: {
    container: "bg-white text-ink",
    frame: "border-ink/25",
    text: "text-ink",
  },
  ink: {
    container: "bg-ink text-cream",
    frame: "border-yellow/40",
    text: "text-cream",
  },
};

const ratioClasses: Record<PlaceholderRatio, string> = {
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "8/1": "aspect-[8/1]",
  "5/2": "aspect-[5/2]",
  auto: "",
};

export function Placeholder({
  label,
  tone = "sand",
  ratio = "4/5",
  className,
  children,
  ...props
}: PlaceholderProps) {
  const styles = toneClasses[tone];

  return (
    <div
      data-surface={tone === "ink" ? "ink" : undefined}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden p-4",
        styles.container,
        ratioClasses[ratio],
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-3 rounded-[16px] border border-dashed",
          styles.frame,
        )}
      />
      <span
        className={cn(
          "font-meta relative z-[1] max-w-[90%] text-center tracking-[0.08em]",
          styles.text,
        )}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

