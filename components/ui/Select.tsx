import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { controlBaseClasses } from "@/components/ui/controlStyles";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
}

/** Accessible native select dropdown with a custom Chevron indicator. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, hasError = false, className, children, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(controlBaseClasses, "h-[3.25rem] appearance-none pr-11 pl-4", className)}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options
          ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
          : children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-ink"
      />
    </div>
  );
});
