import Image from "next/image";
import { Placeholder } from "@/components/ui";
import { content } from "@/lib/content";
import { formatEventDateParts } from "@/lib/utils";
import type { EventItem } from "@/types/api";

export interface PastEventRowProps {
  event: EventItem;
}

export function PastEventRow({ event }: PastEventRowProps) {
  const { year } = formatEventDateParts(event.date);
  const isDataUri = event.posterUrl?.startsWith("data:") ?? false;

  return (
    <article className="flex flex-col gap-5 rounded-card border-2 border-ink bg-white p-5 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-input border-2 border-ink bg-sand sm:h-28 sm:w-24 sm:aspect-auto">
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={`${event.title} poster`}
            fill
            unoptimized={isDataUri}
            sizes="(max-width: 639px) 100vw, 96px"
            className="object-cover"
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
        <h2 className="font-display-expanded text-[22px] leading-tight text-ink md:text-[24px]">
          {event.title}
        </h2>
        <p className="text-[14px] text-muted">
          {event.venue}, {event.city}
        </p>
        {event.summary ? (
          <p className="pt-1 text-[15px] text-ink/85">{event.summary}</p>
        ) : null}
      </div>
    </article>
  );
}

