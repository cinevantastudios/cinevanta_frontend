import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={hasError || undefined}
      className={cn(
        "h-[52px] w-full rounded-input border-2 border-ink bg-white px-4 text-[16px] text-ink",
        "placeholder:text-muted",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:bg-sand/60 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});

