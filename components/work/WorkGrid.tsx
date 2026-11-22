"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, EmptyState, StatusBanner } from "@/components/ui";
import { WorkDialog } from "@/components/work/WorkDialog";
import { WorkFilters, type WorkFilterValue } from "@/components/work/WorkFilters";
import { WorkFrame } from "@/components/work/WorkFrame";
import { fetchWorkPage } from "@/lib/api-client";
import { content } from "@/lib/content";
import { displayLimits, routes } from "@/lib/site";
import type { WorkItem } from "@/types/api";

const PAGE_SIZE = displayLimits.workPageSize;

export interface WorkGridProps {
  initialCategory: WorkFilterValue;
  initialItems: WorkItem[];
  initialTotal: number;
}

/**
 * Interactive portfolio grid with category filters, pagination, and lightbox preview.
 * Cancels superseded in-flight requests to prevent race conditions and surfaces retryable errors
 * without clearing existing items when a network error occurs.
 */
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");
  const [selected, setSelected] = useState<WorkItem | null>(null);

  // Track active request ID and AbortController so stale responses never overwrite newer selections.
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasMore = items.length < total;

  /** Cancels any active fetch and returns a fresh AbortController + request ID. */
  const startRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    requestIdRef.current += 1;
    return { controller, requestId: requestIdRef.current };
  }, []);

  /** Loads page 1 for a given category with race-condition cancellation. */
  const loadCategory = useCallback(
    async (nextCategory: WorkFilterValue, updateUrl: boolean) => {
      const { controller, requestId } = startRequest();

      setCategory(nextCategory);
      setLoading(true);
      setLoadingMore(false);
      setLoadError(null);
      setAnnouncement("");

      if (updateUrl) {
        router.replace(routes.workByCategory(nextCategory), { scroll: false });
      }

      const result = await fetchWorkPage(
        nextCategory === "all" ? undefined : nextCategory,
        1,
        PAGE_SIZE,
        controller.signal,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!result.ok) {
        if (!result.aborted) {
          setLoadError(result.error);
        }
        setLoading(false);
        return;
      }

      setItems(result.data.items);
      setTotal(result.data.total);
      setPage(1);
      setLoading(false);
    },
    [router, startRequest],
  );

  // Abort any in-flight work fetch if the component unmounts.
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function handleSelectCategory(nextCategory: WorkFilterValue) {
    if (nextCategory === category && !loadError) return;
    void loadCategory(nextCategory, true);
  }

  /** Appends the next page of projects without wiping current items if the request fails. */
  async function handleLoadMore() {
    if (loadingMore || loading || !hasMore) return;

    const { controller, requestId } = startRequest();
    setLoadingMore(true);
    setLoadError(null);

    const nextPage = page + 1;
    const result = await fetchWorkPage(
      category === "all" ? undefined : category,
      nextPage,
      PAGE_SIZE,
      controller.signal,
    );

    if (requestId !== requestIdRef.current) {
      return;
    }

    if (!result.ok) {
      if (!result.aborted) {
        setLoadError(result.error);
      }
      setLoadingMore(false);
      return;
    }

    setItems((prev) => {
      const seen = new Set(prev.map((item) => item.id));
      const uniqueNew = result.data.items.filter((item) => !seen.has(item.id));
      return [...prev, ...uniqueNew];
    });
    setTotal(result.data.total);
    setPage(nextPage);
    setLoadingMore(false);

    if (result.data.items.length > 0) {
      setAnnouncement(content.work.loadedAnnouncement(result.data.items.length));
    }
  }

  return (
    <div className="space-y-10">
      <WorkFilters activeCategory={category} onSelect={handleSelectCategory} />

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {loadError ? (
        <StatusBanner
          variant="error"
          message={loadError}
          action={
            <Button
              type="button"
              variant="ink"
              onClick={() =>
                items.length > 0 ? void handleLoadMore() : void loadCategory(category, false)
              }
            >
              {content.errors.errorCta}
            </Button>
          }
        />
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              aria-hidden="true"
              className="animate-skeleton aspect-[4/5] rounded-frame bg-sand md:h-[25rem]"
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
      ) : !loadError ? (
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
      ) : null}

      <WorkDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
