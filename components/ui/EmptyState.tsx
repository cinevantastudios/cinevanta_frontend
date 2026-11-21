import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  message: string;
  action?: ReactNode;
  surface?: "light" | "ink";
  className?: string;
}

export function EmptyState({
  message,
  action,
  surface = "light",
  className,
}: EmptyStateProps) {
  const isInk = surface === "ink";

  return (
    <div
      data-surface={isInk ? "ink" : undefined}
      className={cn(
        "flex flex-col items-start gap-5 rounded-card border-2 border-dashed p-7 md:p-9",
        isInk
          ? "border-cream/50 bg-ink text-cream"
          : "border-ink bg-cream text-ink",
        className,
      )}
    >
      <p
        className={cn(
          "max-w-[56ch] text-[16px] md:text-[18px]",
          isInk ? "text-cream" : "text-ink",
        )}
      >
        {message}
      </p>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}

