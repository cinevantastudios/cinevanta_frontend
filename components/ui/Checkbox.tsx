import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
  surface?: "light" | "ink";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, error, surface = "light", className, ...props },
  ref,
) {
  const isInk = surface === "ink";
  const errorId = id && error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className={cn("relative", error && "pl-2")}>
        {error ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-0 w-1 rounded-pill bg-yellow"
          />
        ) : null}
        <label
          htmlFor={id}
          className={cn(
            "inline-flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-[14px] leading-snug select-none",
            isInk ? "text-cream" : "text-ink",
          )}
        >
          <span className="relative mt-0.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={errorId}
              className="peer sr-only"
              {...props}
            />
            <span
              aria-hidden="true"
              className={cn(
                "flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border-2 border-ink bg-white transition-colors duration-150",
                "peer-checked:bg-yellow",
                "peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2",
                isInk
                  ? "peer-focus-visible:outline-yellow"
                  : "peer-focus-visible:outline-ink",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
              )}
            />
            <Check
              aria-hidden="true"
              strokeWidth={3}
              className="pointer-events-none absolute h-3.5 w-3.5 text-ink opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
            />
          </span>
          <span>{label}</span>
        </label>
      </div>

      {error ? (
        <p
          id={errorId}
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
});

