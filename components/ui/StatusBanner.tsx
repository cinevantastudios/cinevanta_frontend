import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusBannerProps {
  variant: "error" | "success";
  surface?: "light" | "ink";
  title?: string;
  message: ReactNode;
  action?: ReactNode;
  id?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Shared accessible alert/status banner used across forms and interactive grids for
 * error notifications and confirmation cards.
 */
export function StatusBanner({
  variant,
  surface = "light",
  title,
  message,
  action,
  id,
  compact = false,
  className,
}: StatusBannerProps) {
  const isError = variant === "error";
  const isInk = surface === "ink";
  const Icon = isError ? AlertCircle : CheckCircle2;

  if (compact) {
    return (
      <p
        id={id}
        role={isError ? "alert" : "status"}
        aria-live="polite"
        className={cn(
          "flex items-start gap-2 text-[0.875rem] font-medium",
          isInk ? "text-yellow" : "text-ink",
          className,
        )}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </p>
    );
  }

  return (
    <div
      id={id}
      role={isError ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-2",
        isError ? "rounded-input p-4" : "rounded-card p-5",
        isError
          ? isInk
            ? "border-yellow bg-ink text-yellow"
            : "border-ink bg-sand text-ink"
          : isInk
            ? "border-yellow bg-ink text-cream"
            : "border-ink bg-yellow text-ink",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          {title ? <h2 className="font-display-expanded text-[1.5rem]">{title}</h2> : null}
          <div className={cn("text-[0.9375rem]", isError ? "font-medium" : "font-semibold")}>
            {message}
          </div>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
