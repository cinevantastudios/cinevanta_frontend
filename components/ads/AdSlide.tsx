"use client";

import Link from "next/link";
import { useState } from "react";
import { Sticker } from "@/components/ui";
import { content } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/api";

export interface AdSlideProps {
  ad: Ad;
  index: number;
  total: number;
  isActive: boolean;
  onSlideClick: (id: string) => void;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function AdSlide({ ad, index, total, isActive, onSlideClick }: AdSlideProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const label = ad.label?.trim() || content.adStrip.defaultLabel;
  const external = isExternalUrl(ad.linkUrl);
  const linkClassName = cn(
    "relative block w-full overflow-hidden bg-yellow",
    "aspect-[5/2] md:aspect-[8/1] min-h-[96px] max-h-[260px]",
    "focus-visible:outline-offset-[-4px]",
  );

  const slideContent = (
    <>
      <span className="pointer-events-none absolute top-3 left-3 z-[2]">
        <Sticker rotation={0} className="px-3 py-1 text-[10px]">
          {label}
        </Sticker>
      </span>

      {imageFailed ? (
        <div className="flex h-full w-full items-center justify-center bg-yellow px-12 text-center text-ink">
          <span className="font-display-expanded text-[24px] md:text-[36px]">{ad.title}</span>
        </div>
      ) : (
        <picture className="block h-full w-full">
          <source media="(max-width: 767px)" srcSet={ad.imageMobile} />
          <img
            src={ad.imageDesktop}
            alt={ad.alt}
            fetchPriority={index === 0 ? "high" : undefined}
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </picture>
      )}
    </>
  );

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={content.adStrip.slideLabel(index + 1, total)}
      aria-hidden={!isActive}
      className="w-full shrink-0 grow-0 basis-full"
    >
      {external ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isActive ? 0 : -1}
          onClick={() => onSlideClick(ad.id)}
          className={linkClassName}
        >
          {slideContent}
        </a>
      ) : (
        <Link
          href={ad.linkUrl}
          tabIndex={isActive ? 0 : -1}
          onClick={() => onSlideClick(ad.id)}
          className={linkClassName}
        >
          {slideContent}
        </Link>
      )}
    </div>
  );
}
