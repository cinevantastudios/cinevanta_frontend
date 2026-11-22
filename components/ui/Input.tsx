import { forwardRef, type InputHTMLAttributes } from "react";
import { controlBaseClasses } from "@/components/ui/controlStyles";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

/** Accessible 52px single-line input styled with the studio's 2px ink border. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={hasError || undefined}
      className={cn(controlBaseClasses, "h-[3.25rem] px-4", className)}
      {...props}
    />
  );
});
