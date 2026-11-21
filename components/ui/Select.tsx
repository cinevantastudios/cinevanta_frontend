import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, hasError = false, className, children, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          "h-[52px] w-full appearance-none rounded-input border-2 border-ink bg-white pr-11 pl-4 text-[16px] text-ink",
          "transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:bg-sand/60 disabled:opacity-70",
          className,
        )}
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

