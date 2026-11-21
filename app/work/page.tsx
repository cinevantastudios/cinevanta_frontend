import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { WorkGrid } from "@/components/work/WorkGrid";
import type { WorkFilterValue } from "@/components/work/WorkFilters";
import { getWork } from "@/lib/api";
import { content } from "@/lib/content";
import { workCategorySchema } from "@/types/api";

export const metadata: Metadata = {
  title: content.work.pageTitle,
  description: content.work.pageLead,
  openGraph: {
    title: `${content.work.pageTitle} | Cinevanta Studios`,
    description: content.work.pageLead,
    url: "/work",
  },
};

interface WorkPageProps {
  searchParams: Promise<{ category?: string | string[] }>;
}

function parseCategory(raw: string | string[] | undefined): WorkFilterValue {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = workCategorySchema.safeParse(value);
  return parsed.success ? parsed.data : "all";
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = await searchParams;
  const initialCategory = parseCategory(params.category);

  const initialWork = await getWork(
    initialCategory === "all" ? undefined : initialCategory,
    1,
    9,
  );

  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.work.pageTitle}
            </h1>
            <p className="text-[18px] leading-[1.6] text-muted">{content.work.pageLead}</p>
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

