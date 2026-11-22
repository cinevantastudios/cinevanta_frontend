import { forwardRef, type TextareaHTMLAttributes } from "react";
import { controlBaseClasses } from "@/components/ui/controlStyles";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

/** Accessible vertically resizable textarea styled with the studio's 2px ink border. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { hasError = false, className, rows = 5, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={hasError || undefined}
      className={cn(controlBaseClasses, "min-h-[8.75rem] resize-y p-4 leading-relaxed", className)}
      {...props}
    />
  );
});
