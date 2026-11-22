"use client";

import Link from "next/link";
import { useState } from "react";
import { Container, EmptyState, Section, SectionHeading } from "@/components/ui";
import { WorkDialog } from "@/components/work/WorkDialog";
import { WorkFrame } from "@/components/work/WorkFrame";
import { content } from "@/lib/content";
import { displayLimits, routes } from "@/lib/site";
import type { WorkItem } from "@/types/api";

export interface WorkPreviewProps {
  items: WorkItem[];
}

export function WorkPreview({ items }: WorkPreviewProps) {
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const visibleItems = items.slice(0, displayLimits.homeWorkPreviewCount);
  const hasItems = visibleItems.length > 0;

  return (
    <Section tone="sand" bordered aria-labelledby="work-heading">
      <Container className="space-y-10 md:space-y-12">
        <SectionHeading
          id="work-heading"
          title={content.work.heading}
          sticker={content.work.sticker}
          action={
            <Link
              href={routes.work}
              className="inline-flex min-h-[2.75rem] items-center text-[0.9375rem] font-semibold text-ink underline decoration-2 underline-offset-[6px] transition-opacity duration-150 hover:opacity-75"
            >
              {content.work.seeAll}
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((slotIndex) => {
            const item = visibleItems[slotIndex];
            const fallback = content.work.homePlaceholders[slotIndex];
            return (
              <WorkFrame
                key={item ? item.id : `placeholder-${slotIndex}`}
                item={item}
                index={slotIndex}
                placeholderLabel={fallback?.label}
                placeholderTone={fallback?.tone}
                onSelect={setSelected}
              />
            );
          })}
        </div>

        {!hasItems ? <EmptyState message={content.work.empty} /> : null}
      </Container>

      <WorkDialog item={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

