import { Placeholder, SafeImage } from "@/components/ui";
import { content } from "@/lib/content";
import { mediaConfig } from "@/lib/site";
import { formatEventDateParts } from "@/lib/utils";
import type { EventItem } from "@/types/api";

export interface PastEventRowProps {
  event: EventItem;
}

/** Displays a completed event archive row with thumbnail fallback, year meta, and venue summary. */
export function PastEventRow({ event }: PastEventRowProps) {
  const { year } = formatEventDateParts(event.date);

  return (
    <article className="flex flex-col gap-5 rounded-card border-2 border-ink bg-white p-5 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-input border-2 border-ink bg-sand sm:h-28 sm:w-24 sm:aspect-auto">
        {event.posterUrl ? (
          <SafeImage
            src={event.posterUrl}
            alt={`${event.title} poster`}
            fill
            sizes={mediaConfig.thumbnailSizes}
            className="object-cover"
            fallbackLabel={content.events.posterPlaceholder}
            fallbackTone="sand"
            fallbackRatio="auto"
          />
        ) : (
          <Placeholder
            tone="sand"
            ratio="auto"
            label={content.events.posterPlaceholder}
            className="h-full w-full p-2"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <span className="font-meta text-muted">{year}</span>
        <h2 className="font-display-expanded text-[1.375rem] leading-tight text-ink md:text-[1.5rem]">
          {event.title}
        </h2>
        <p className="text-[0.875rem] text-muted">
          {event.venue}, {event.city}
        </p>
        {event.summary ? (
          <p className="pt-1 text-[0.9375rem] text-ink/85">{event.summary}</p>
        ) : null}
      </div>
    </article>
  );
}
