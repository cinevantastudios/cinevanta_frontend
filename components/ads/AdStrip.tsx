"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import { AdControls } from "@/components/ads/AdControls";
import { AdSlide } from "@/components/ads/AdSlide";
import { content } from "@/lib/content";
import { useDocumentHidden, usePrefersReducedMotion } from "@/lib/hooks";
import { displayLimits, mediaConfig, uiConfig } from "@/lib/site";
import { trackAdClick, trackAdImpressionOnce } from "@/lib/tracking";
import { cn, filterAndSortAds } from "@/lib/utils";
import type { Ad } from "@/types/api";

const AUTOPLAY_INTERVAL_MS = uiConfig.adAutoplayIntervalMs;
const IMPRESSION_DELAY_MS = uiConfig.adImpressionDelayMs;
const SWIPE_DISTANCE_PX = uiConfig.adSwipeDistancePx;
const SWIPE_VELOCITY_PX_PER_MS = uiConfig.adSwipeVelocityPxPerMs;

export interface AdStripProps {
  ads: Ad[];
  /** Server render timestamp used to keep initial SSR and client hydration filtering deterministic. */
  renderedAtIso?: string;
  className?: string;
}

/**
 * Full-bleed own-event promo carousel rendered directly beneath the Navbar.
 * Supports autoplay, keyboard navigation, touch swiping, visibility/hover/focus pausing,
 * reduced motion, and per-session impression/click tracking.
 */
export function AdStrip({ ads, renderedAtIso, className }: AdStripProps) {
  const activeAds = useMemo(() => {
    const referenceDate = renderedAtIso ? new Date(renderedAtIso) : new Date();
    return filterAndSortAds(ads, referenceDate, displayLimits.maxAdSlides);
  }, [ads, renderedAtIso]);
  const total = activeAds.length;

  const [rawActiveIndex, setRawActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isHalfVisible, setIsHalfVisible] = useState(true);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const reducedMotion = usePrefersReducedMotion();
  const isTabHidden = useDocumentHidden();

  const stripRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const touchAxisRef = useRef<"x" | "y" | null>(null);

  const activeIndex = total > 0 ? rawActiveIndex % total : 0;
  const currentAd = activeAds[activeIndex];

  const isAutoplayPaused =
    total <= 1 ||
    reducedMotion ||
    userPaused ||
    isHovered ||
    isFocusWithin ||
    isTabHidden ||
    !isInView ||
    isDragging;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setRawActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setRawActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      if (total <= 1) return;
      setRawActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  // Pause when scrolled out of view & track >= 50% visibility for impressions.
  useEffect(() => {
    const element = stripRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0);
        setIsHalfVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: [0, 0.5] },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [total]);

  // Autoplay interval.
  useEffect(() => {
    if (isAutoplayPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setRawActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [isAutoplayPaused, total, activeIndex]);

  // Impression tracking: >= 50% visible for 1s, once per session per ad.
  useEffect(() => {
    if (!currentAd || !isHalfVisible || isTabHidden) {
      return;
    }

    const adId = currentAd.id;
    const timer = window.setTimeout(() => {
      trackAdImpressionOnce(adId);
    }, IMPRESSION_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentAd, isHalfVisible, isTabHidden]);

  // Preload next slide image when current becomes active.
  useEffect(() => {
    if (total <= 1 || typeof window === "undefined") {
      return;
    }

    const nextSlide = activeAds[(activeIndex + 1) % total];
    if (!nextSlide) return;

    const isMobile =
      typeof window.matchMedia === "function" &&
      window.matchMedia(mediaConfig.mobileMediaQuery).matches;
    const img = new window.Image();
    img.src = isMobile ? nextSlide.imageMobile : nextSlide.imageDesktop;
  }, [activeAds, activeIndex, total]);

  function handleFocus() {
    setIsFocusWithin(true);
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocusWithin(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (total <= 1) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (total <= 1) return;
    const touch = event.touches[0];
    if (!touch) return;

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchStartTimeRef.current = performance.now();
    touchAxisRef.current = null;
    setDragOffsetPx(0);
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (total <= 1) return;
    const touch = event.touches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartXRef.current;
    const dy = touch.clientY - touchStartYRef.current;

    if (touchAxisRef.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      touchAxisRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    if (touchAxisRef.current === "x") {
      setIsDragging(true);
      setDragOffsetPx(dx);
    }
  }

  function handleTouchEnd() {
    if (total <= 1) return;

    if (touchAxisRef.current === "x") {
      const elapsed = Math.max(1, performance.now() - touchStartTimeRef.current);
      const velocity = Math.abs(dragOffsetPx) / elapsed;
      const shouldSwipe =
        Math.abs(dragOffsetPx) >= SWIPE_DISTANCE_PX ||
        velocity > SWIPE_VELOCITY_PX_PER_MS;

      if (shouldSwipe) {
        if (dragOffsetPx < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }

    touchAxisRef.current = null;
    setIsDragging(false);
    setDragOffsetPx(0);
  }

  if (total === 0) {
    return null;
  }

  return (
    <section
      ref={stripRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={content.adStrip.regionLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/strip relative z-[var(--z-ad-strip)] w-full overflow-hidden border-y-[3px] border-ink bg-yellow",
        className,
      )}
    >
      {/* Live region: polite only when autoplay is paused */}
      <div
        aria-live={isAutoplayPaused ? "polite" : "off"}
        aria-atomic="true"
        className="sr-only"
      >
        {currentAd
          ? content.adStrip.announcement(activeIndex + 1, total, currentAd.title)
          : ""}
      </div>

      {/* Slides track */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          touchAction: "pan-y",
          transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffsetPx}px), 0, 0)`,
          transitionDuration: isDragging || reducedMotion ? "0ms" : "600ms",
          transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.2, 1)",
        }}
        className="flex w-full transition-transform will-change-transform"
      >
        {activeAds.map((ad, index) => (
          <AdSlide
            key={ad.id}
            ad={ad}
            index={index}
            total={total}
            isActive={index === activeIndex}
            onSlideClick={trackAdClick}
          />
        ))}
      </div>

      {/* Controls: Prev, Next, Pause/Play, Dots, Progress bar */}
      <AdControls
        total={total}
        activeIndex={activeIndex}
        isUserPaused={userPaused}
        isProgressPaused={isAutoplayPaused}
        reducedMotion={reducedMotion}
        intervalMs={AUTOPLAY_INTERVAL_MS}
        onPrev={goPrev}
        onNext={goNext}
        onSelectSlide={goTo}
        onTogglePause={() => setUserPaused((prev) => !prev)}
      />
    </section>
  );
}
