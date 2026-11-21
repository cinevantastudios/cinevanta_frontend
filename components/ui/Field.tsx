import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id: string;
  label: string;
  optionalText?: string;
  helperText?: string;
  error?: string;
  counter?: string;
  surface?: "light" | "ink";
  className?: string;
  children: ReactNode;
}

export function getFieldDescribedBy(
  id: string,
  options: { hasHelper?: boolean; hasError?: boolean },
): string | undefined {
  const ids: string[] = [];
  if (options.hasHelper) ids.push(`${id}-helper`);
  if (options.hasError) ids.push(`${id}-error`);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function Field({
  id,
  label,
  optionalText,
  helperText,
  error,
  counter,
  surface = "light",
  className,
  children,
}: FieldProps) {
  const isInk = surface === "ink";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className={cn(
            "text-[14px] font-semibold leading-snug",
            isInk ? "text-cream" : "text-ink",
          )}
        >
          {label}
          {optionalText ? (
            <span
              className={cn(
                "ml-2 font-normal",
                isInk ? "text-muted-on-ink" : "text-muted",
              )}
            >
              ({optionalText})
            </span>
          ) : null}
        </label>
        {counter ? (
          <span
            className={cn(
              "font-meta shrink-0",
              isInk ? "text-muted-on-ink" : "text-muted",
            )}
          >
            {counter}
          </span>
        ) : null}
      </div>

      <div className={cn("relative", error && "pl-2")}>
        {error ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-0 w-1 rounded-pill bg-yellow"
          />
        ) : null}
        {children}
      </div>

      {helperText && !error ? (
        <p
          id={`${id}-helper`}
          className={cn(
            "text-[14px] leading-snug",
            isInk ? "text-muted-on-ink" : "text-muted",
          )}
        >
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className={cn(
            "flex items-start gap-2 text-[14px] font-medium leading-snug",
            isInk ? "text-yellow" : "text-ink",
          )}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

