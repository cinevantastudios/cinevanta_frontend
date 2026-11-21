"use client";

import { content } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { WorkCategory } from "@/types/api";

export type WorkFilterValue = WorkCategory | "all";

export interface WorkFiltersProps {
  activeCategory: WorkFilterValue;
  onSelect: (category: WorkFilterValue) => void;
}

export function WorkFilters({ activeCategory, onSelect }: WorkFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
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
              "inline-flex min-h-[44px] items-center rounded-pill border-2 border-ink px-5 text-[14px] font-semibold transition-colors duration-200",
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

