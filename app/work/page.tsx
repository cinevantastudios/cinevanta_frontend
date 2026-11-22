import type { Metadata } from "next";
import { Container, EmptyState, SafeImage, Section } from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { getWork } from "@/lib/api-client";
import { content } from "@/lib/content";
import { displayLimits, mediaConfig, routes } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";
import { workCategorySchema, type WorkCategory } from "@/types/api";

export const metadata: Metadata = createPageMetadata({
  title: content.work.pageTitle,
  description: content.work.pageLead,
  path: routes.work,
});

interface WorkPageProps {
  searchParams?: Promise<{ category?: string | string[] }>;
}

/** Validates optional ?category= query parameter on the server. */
function parseCategory(raw: string | string[] | undefined): WorkCategory | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = workCategorySchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

/**
 * Basic fast-track Work portfolio page.
 * Renders a clean static 3-column grid of studio projects.
 */
export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = searchParams ? await searchParams : {};
  const category = parseCategory(params.category);
  const work = await getWork(category, 1, displayLimits.workPageSize);

  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.work.pageTitle}
            </h1>
            <p className="text-[1.125rem] leading-[1.6] text-muted">{content.work.pageLead}</p>
          </div>

          {work.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {work.items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between overflow-hidden rounded-card border-2 border-ink bg-white p-3"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[14px] border-2 border-ink">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes={mediaConfig.gridCardSizes}
                      className="object-cover"
                      fallbackLabel={content.work.placeholderStillLabel}
                    />
                  </div>
                  <div className="space-y-1.5 px-1 pt-4 pb-2">
                    <p className="font-meta text-muted">
                      {content.work.categoryLabels[item.category]} • {item.year}
                    </p>
                    <h2 className="font-display-expanded text-h3 text-ink">{item.title}</h2>
                    {item.description ? (
                      <p className="text-[0.9375rem] leading-relaxed text-muted">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message={content.work.empty} />
          )}
        </Container>
      </Section>

      <CtaBlock />
    </main>
  );
}
