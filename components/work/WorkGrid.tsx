"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, EmptyState } from "@/components/ui";
import { WorkDialog } from "@/components/work/WorkDialog";
import { WorkFilters, type WorkFilterValue } from "@/components/work/WorkFilters";
import { WorkFrame } from "@/components/work/WorkFrame";
import { getWork } from "@/lib/api";
import { content } from "@/lib/content";
import type { WorkItem } from "@/types/api";

const PAGE_SIZE = 9;

export interface WorkGridProps {
  initialCategory: WorkFilterValue;
  initialItems: WorkItem[];
  initialTotal: number;
}

export function WorkGrid({
  initialCategory,
  initialItems,
  initialTotal,
}: WorkGridProps) {
  const router = useRouter();
  const [category, setCategory] = useState<WorkFilterValue>(initialCategory);
  const [items, setItems] = useState<WorkItem[]>(initialItems);
  const [total, setTotal] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>("");
  const [selected, setSelected] = useState<WorkItem | null>(null);

  const hasMore = items.length < total;

  async function handleSelectCategory(nextCategory: WorkFilterValue) {
    if (nextCategory === category) return;

    setCategory(nextCategory);
    setLoading(true);
    setAnnouncement("");

    const nextUrl = nextCategory === "all" ? "/work" : `/work?category=${nextCategory}`;
    router.replace(nextUrl, { scroll: false });

    const response = await getWork(
      nextCategory === "all" ? undefined : nextCategory,
      1,
      PAGE_SIZE,
    );

    setItems(response.items);
    setTotal(response.total);
    setPage(1);
    setLoading(false);
  }

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    const response = await getWork(
      category === "all" ? undefined : category,
      nextPage,
      PAGE_SIZE,
    );

    setItems((prev) => [...prev, ...response.items]);
    setTotal(response.total);
    setPage(nextPage);
    setLoadingMore(false);

    if (response.items.length > 0) {
      setAnnouncement(content.work.loadedAnnouncement(response.items.length));
    }
  }

  return (
    <div className="space-y-10">
      <WorkFilters activeCategory={category} onSelect={handleSelectCategory} />

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              aria-hidden="true"
              className="animate-skeleton aspect-[4/5] rounded-frame bg-sand md:h-[400px]"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <WorkFrame key={item.id} item={item} index={idx} onSelect={setSelected} />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                loading={loadingMore}
                onClick={handleLoadMore}
              >
                {loadingMore ? content.work.loadingMore : content.work.loadMore}
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <EmptyState
          message={content.work.emptyCategory}
          action={
            category !== "all" ? (
              <Button
                type="button"
                variant="ink"
                onClick={() => handleSelectCategory("all")}
              >
                {content.work.seeAll}
              </Button>
            ) : undefined
          }
        />
      )}

      <WorkDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

