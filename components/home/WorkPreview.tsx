import Link from "next/link";
import {
  Container,
  EmptyState,
  Placeholder,
  SafeImage,
  Section,
  SectionHeading,
} from "@/components/ui";
import { content } from "@/lib/content";
import { displayLimits, mediaConfig, routes } from "@/lib/site";
import { isExternalHref, isSafeHref } from "@/lib/utils";
import type { WorkItem } from "@/types/api";

export interface WorkPreviewProps {
  items: WorkItem[];
}

/**
 * Basic fast-track Work section (#work) on the single-page scroll website.
 * Renders featured projects with thumbnails, descriptions, and direct YouTube/project links.
 */
export function WorkPreview({ items }: WorkPreviewProps) {
  const visibleItems = items.slice(0, displayLimits.homeWorkPreviewCount);
  const hasItems = visibleItems.length > 0;

  return (
    <Section
      id="work"
      tone="sand"
      bordered
      className="scroll-mt-20"
      aria-labelledby="work-heading"
    >
      <Container className="space-y-10">
        <SectionHeading
          id="work-heading"
          title={content.work.heading}
          sticker={content.work.sticker}
        />

        {hasItems ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => {
              const categoryLabel = content.work.categoryLabels[item.category];
              const targetHref =
                item.videoUrl && isSafeHref(item.videoUrl) ? item.videoUrl : routes.contact;
              const external = isExternalHref(targetHref);

              return (
                <Link
                  key={item.id}
                  href={targetHref}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col justify-between overflow-hidden rounded-card border-2 border-ink bg-white p-3 transition-colors duration-150 hover:bg-cream"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-[14px] border-2 border-ink bg-ink">
                      <SafeImage
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes={mediaConfig.gridCardSizes}
                        className="object-cover"
                        fallbackLabel={content.work.placeholderStillLabel}
                      />
                    </div>
                    <div className="space-y-1.5 px-1 pt-3 pb-2">
                      <p className="font-meta text-muted">
                        {categoryLabel} • {item.year}
                      </p>
                      <h3 className="font-display-expanded text-h3 text-ink">{item.title}</h3>
                      {item.description ? (
                        <p className="text-[0.875rem] leading-relaxed text-muted">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {external ? (
                    <div className="border-t border-ink/15 px-1 pt-3 pb-1 text-[0.8125rem] font-semibold text-ink">
                      Watch on YouTube ↗
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[0, 1, 2].map((slotIndex) => {
                const fallback = content.work.homePlaceholders[slotIndex];
                return (
                  <div
                    key={`placeholder-${slotIndex}`}
                    className="overflow-hidden rounded-card border-2 border-ink bg-white p-3"
                  >
                    <div className="overflow-hidden rounded-[14px] border-2 border-ink">
                      <Placeholder
                        tone={fallback?.tone ?? "yellow"}
                        ratio="4/5"
                        label={fallback?.label ?? content.work.placeholderStillLabel}
                      />
                    </div>
                    <div className="space-y-1 px-1 pt-3 pb-1">
                      <p className="font-meta text-muted">{content.work.placeholderMetaLabel}</p>
                      <h3 className="font-display-expanded text-h3 text-ink">
                        {content.work.placeholderTitleLabel}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <EmptyState message={content.work.empty} />
          </>
        )}
      </Container>
    </Section>
  );
}
