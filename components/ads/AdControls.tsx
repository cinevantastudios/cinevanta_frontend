"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { content } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface AdControlsProps {
  total: number;
  activeIndex: number;
  isUserPaused: boolean;
  isProgressPaused: boolean;
  reducedMotion: boolean;
  intervalMs: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
  onTogglePause: () => void;
}

export function AdControls({
  total,
  activeIndex,
  isUserPaused,
  isProgressPaused,
  reducedMotion,
  intervalMs,
  onPrev,
  onNext,
  onSelectSlide,
  onTogglePause,
}: AdControlsProps) {
  if (total <= 1) {
    return null;
  }

  const arrowClasses = cn(
    "absolute top-1/2 z-[4] -translate-y-1/2",
    "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink",
    "transition-[opacity,background-color,color] duration-150 ease-out",
    "hover:bg-yellow focus-visible:opacity-100",
    "opacity-0 group-hover/strip:opacity-100 group-focus-within/strip:opacity-100",
    "[@media(hover:none)_and_(pointer:coarse)]:hidden",
  );

  return (
    <>
      {/* Prev & Next buttons (DOM order: slide link -> prev -> next -> pause -> dots) */}
      <button
        type="button"
        onClick={onPrev}
        aria-label={content.adStrip.prevLabel}
        className={cn(arrowClasses, "left-4")}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label={content.adStrip.nextLabel}
        className={cn(arrowClasses, "right-4")}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Pause / Play toggle */}
      <button
        type="button"
        onClick={onTogglePause}
        aria-label={isUserPaused ? content.adStrip.playLabel : content.adStrip.pauseLabel}
        aria-pressed={isUserPaused}
        className="absolute right-4 bottom-3 z-[4] inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink transition-colors duration-150 hover:bg-yellow"
      >
        {isUserPaused ? (
          <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
        ) : (
          <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
        )}
      </button>

      {/* Dots indicator */}
      <div
        data-surface="ink"
        className="absolute bottom-3 left-1/2 z-[4] flex -translate-x-1/2 items-center gap-0.5 rounded-pill bg-ink/70 px-2 py-0.5"
      >
        {Array.from({ length: total }).map((_, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectSlide(index)}
              aria-label={content.adStrip.goToSlideLabel(index + 1)}
              aria-current={active ? "true" : undefined}
              className="inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-2 rounded-pill transition-[width,background-color] duration-200 ease-[var(--ease-move)]",
                  active ? "w-6 bg-yellow" : "w-2 bg-cream",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Autoplay progress bar */}
      {!reducedMotion ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-[3] h-[3px] w-full bg-ink/20"
        >
          <div
            key={activeIndex}
            className="h-full w-full origin-left bg-yellow"
            style={{
              animationName: "ad-progress",
              animationDuration: `${intervalMs}ms`,
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
              animationPlayState: isProgressPaused ? "paused" : "running",
            }}
          />
        </div>
      ) : null}
    </>
  );
}

