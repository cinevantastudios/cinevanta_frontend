import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import type { WorkFilterValue } from "@/components/work/WorkFilters";
import { WorkGrid } from "@/components/work/WorkGrid";
import { getWork } from "@/lib/api-client";
import { content } from "@/lib/content";
import { displayLimits, routes } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";
import { workCategorySchema } from "@/types/api";

export const metadata: Metadata = createPageMetadata({
  title: content.work.pageTitle,
  description: content.work.pageLead,
  path: routes.work,
});

interface WorkPageProps {
  searchParams?: Promise<{ category?: string | string[] }>;
}

/** Validates the ?category= query parameter on the server so deep links from Services render immediately. */
function parseCategory(raw: string | string[] | undefined): WorkFilterValue {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = workCategorySchema.safeParse(value);
  return parsed.success ? parsed.data : "all";
}

/**
 * Portfolio listing page.
 * Pre-renders the requested category on the server with zero visual flash while `getWork`
 * caches upstream API responses via `cache_logics/revalidation-cache`.
 */
export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialCategory = parseCategory(params.category);

  const initialWork = await getWork(
    initialCategory === "all" ? undefined : initialCategory,
    1,
    displayLimits.workPageSize,
  );

  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.work.pageTitle}
            </h1>
            <p className="text-[1.125rem] leading-[1.6] text-muted">{content.work.pageLead}</p>
          </div>

          <WorkGrid
            initialCategory={initialCategory}
            initialItems={initialWork.items}
            initialTotal={initialWork.total}
          />
        </Container>
      </Section>
    </main>
  );
}
