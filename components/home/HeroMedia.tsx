"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { Placeholder } from "@/components/ui";
import { content } from "@/lib/content";
import type { ShowreelMedia } from "@/lib/site";

export interface HeroMediaProps {
  showreel: ShowreelMedia | null;
}

export function HeroMedia({ showreel }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playingReduced, setPlayingReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  function toggleMute() {
    if (!videoRef.current) return;
    const nextMuted = !muted;
    videoRef.current.muted = nextMuted;
    setMuted(nextMuted);
  }

  function handleReducedPlay() {
    setPlayingReduced(true);
    window.setTimeout(() => {
      void videoRef.current?.play().catch(() => {
        // Autoplay or playback may be blocked by browser policy.
      });
    }, 0);
  }

  if (!showreel?.videoUrl) {
    return (
      <div className="relative overflow-hidden rounded-media border-2 border-ink">
        <Placeholder
          tone="ink"
          ratio="16/9"
          label={content.hero.showreelPlaceholder}
          className="rounded-none"
        >
          <div className="absolute top-4 left-4 z-[2] inline-flex items-center gap-2 rounded-pill border border-line-on-ink bg-ink px-3 py-1.5 text-cream md:top-6 md:left-6">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-yellow" />
            <span className="font-meta text-cream">{content.hero.showreelLabel}</span>
          </div>
        </Placeholder>
      </div>
    );
  }

  return (
    <div
      data-surface="ink"
      className="relative aspect-video w-full overflow-hidden rounded-media border-2 border-ink bg-ink"
    >
      <div className="pointer-events-none absolute top-4 left-4 z-[2] inline-flex items-center gap-2 rounded-pill border border-line-on-ink bg-ink/90 px-3 py-1.5 text-cream md:top-6 md:left-6">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-yellow" />
        <span className="font-meta text-cream">{content.hero.showreelLabel}</span>
      </div>

      {reducedMotion && !playingReduced ? (
        <div className="relative flex h-full w-full items-center justify-center bg-ink">
          {showreel.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Video poster fallback under reduced motion
            <img
              src={showreel.posterUrl}
              alt={content.hero.showreelLabel}
              className="h-full w-full object-cover"
            />
          ) : (
            <Placeholder
              tone="ink"
              ratio="16/9"
              label={content.hero.showreelPlaceholder}
              className="h-full"
            />
          )}
          <button
            type="button"
            onClick={handleReducedPlay}
            aria-label={content.hero.playShowreelLabel}
            className="absolute inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-yellow text-ink transition-colors duration-200 hover:bg-cream"
          >
            <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={showreel.videoUrl}
            poster={showreel.posterUrl}
            autoPlay={!reducedMotion || playingReduced}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? content.hero.unmuteLabel : content.hero.muteLabel}
            aria-pressed={!muted}
            className="absolute right-4 bottom-4 z-[2] inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink transition-colors duration-200 hover:bg-yellow md:right-6 md:bottom-6"
          >
            {muted ? (
              <VolumeX className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </>
      )}
    </div>
  );
}

