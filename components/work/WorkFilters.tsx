"use client";

import { content } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { WorkCategory } from "@/types/api";

export type WorkFilterValue = WorkCategory | "all";

export interface WorkFiltersProps {
  activeCategory: WorkFilterValue;
  onSelect: (category: WorkFilterValue) => void;
}

/** Category filter pills for the portfolio grid, derived dynamically from content.work.categories. */
export function WorkFilters({ activeCategory, onSelect }: WorkFiltersProps) {
  return (
    <div
      role="group"
      aria-label={content.work.filterAriaLabel}
      className="flex flex-wrap gap-2.5"
    >
      {content.work.categories.map((chip) => {
        const active = activeCategory === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(chip.value)}
            className={cn(
              "inline-flex min-h-[2.75rem] items-center rounded-pill border-2 border-ink px-5 text-[0.875rem] font-semibold transition-colors duration-200",
              active ? "bg-yellow text-ink" : "bg-white text-ink hover:bg-sand",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
