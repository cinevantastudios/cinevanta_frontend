"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Dialog } from "@/components/ui";
import { content } from "@/lib/content";
import type { WorkItem } from "@/types/api";

export interface WorkDialogProps {
  item: WorkItem | null;
  onClose: () => void;
}

function toPrivacyEmbedUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be") || host.includes("youtube-nocookie.com")) {
      let videoId = "";
      if (host.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1).split("/")[0] ?? "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "").split("/")[0] ?? "";
      } else {
        videoId = parsed.searchParams.get("v") ?? "";
      }
      if (/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    if (host.includes("vimeo.com")) {
      const match = parsed.pathname.match(/\/(\d+)/);
      if (match?.[1]) {
        return `https://player.vimeo.com/video/${match[1]}?dnt=1&autoplay=1`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function WorkDialog({ item, onClose }: WorkDialogProps) {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    setPlayVideo(false);
  }, [item?.id]);

  if (!item) {
    return null;
  }

  const categoryLabel = content.work.categoryLabels[item.category];
  const embedUrl = item.videoUrl ? toPrivacyEmbedUrl(item.videoUrl) : null;
  const isDataUri = item.imageUrl.startsWith("data:");

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
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                unoptimized={isDataUri}
                sizes="(max-width: 767px) 100vw, 720px"
                className="object-cover"
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

        {item.description ? (
          <p className="max-w-[65ch] text-[16px] leading-relaxed text-ink">{item.description}</p>
        ) : null}
      </div>
    </Dialog>
  );
}

