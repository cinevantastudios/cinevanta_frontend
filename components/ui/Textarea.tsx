import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { hasError = false, className, rows = 5, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={hasError || undefined}
      className={cn(
        "min-h-[140px] w-full resize-y rounded-input border-2 border-ink bg-white p-4 text-[16px] leading-relaxed text-ink",
        "placeholder:text-muted",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:bg-sand/60 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});

