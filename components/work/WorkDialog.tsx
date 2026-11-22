"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, SafeImage } from "@/components/ui";
import { reportError } from "@/lib/analytics";
import { content } from "@/lib/content";
import { mediaConfig } from "@/lib/site";
import type { WorkItem } from "@/types/api";

export interface WorkDialogProps {
  item: WorkItem | null;
  onClose: () => void;
}

/** Converts supported YouTube or Vimeo URLs into privacy-enhanced iframe embed URLs using strict hostname checks. */
export function toPrivacyEmbedUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    const host = parsed.hostname.toLowerCase();
    const isYouTube =
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtu.be" ||
      host === "youtube-nocookie.com" ||
      host.endsWith(".youtube-nocookie.com");

    if (isYouTube) {
      let videoId = "";
      if (host === "youtu.be") {
        videoId = parsed.pathname.slice(1).split("/")[0] ?? "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "").split("/")[0] ?? "";
      } else {
        videoId = parsed.searchParams.get("v") ?? "";
      }
      if (/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
        return `${mediaConfig.youtubeEmbedBaseUrl}/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    const isVimeo = host === "vimeo.com" || host.endsWith(".vimeo.com");
    if (isVimeo) {
      const match = parsed.pathname.match(/\/(\d+)/);
      if (match?.[1]) {
        return `${mediaConfig.vimeoEmbedBaseUrl}/video/${match[1]}?dnt=1&autoplay=1`;
      }
    }
  } catch (error) {
    reportError("WorkDialog", error, { rawUrl });
    return null;
  }

  return null;
}

/** Inner media stage keyed by `item.id` so switching items automatically resets playback state without an effect. */
function WorkDialogMedia({ item }: { item: WorkItem }) {
  const [playVideo, setPlayVideo] = useState(false);
  const embedUrl = item.videoUrl ? toPrivacyEmbedUrl(item.videoUrl) : null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-frame border-2 border-ink bg-ink">
      {playVideo && embedUrl ? (
        <iframe
          src={embedUrl}
          title={item.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <>
          <SafeImage
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes={mediaConfig.dialogHeroSizes}
            className="object-cover"
            fallbackLabel={content.work.placeholderStillLabel}
            fallbackTone="ink"
            fallbackRatio="16/9"
          />
          {embedUrl ? (
            <button
              type="button"
              onClick={() => setPlayVideo(true)}
              aria-label={content.work.playVideoLabel}
              className="absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-yellow text-ink transition-colors duration-200 hover:bg-cream"
            >
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

/** Lightbox modal showing enlarged project imagery, metadata, description, and on-demand privacy-enhanced video. */
export function WorkDialog({ item, onClose }: WorkDialogProps) {
  if (!item) {
    return null;
  }

  const categoryLabel = content.work.categoryLabels[item.category];

  return (
    <Dialog
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={item.title}
      description={`${categoryLabel} • ${item.year}`}
      closeLabel={content.work.closeDialogLabel}
      size="lg"
    >
      <div className="space-y-5">
        <WorkDialogMedia key={item.id} item={item} />

        {item.description ? (
          <p className="max-w-[65ch] text-[1rem] leading-relaxed text-ink">{item.description}</p>
        ) : null}
      </div>
    </Dialog>
  );
}
