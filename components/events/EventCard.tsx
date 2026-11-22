import { Placeholder, SafeImage } from "@/components/ui";
import { RegisterButton } from "@/components/events/RegisterButton";
import { content } from "@/lib/content";
import { mediaConfig } from "@/lib/site";
import { formatEventDateParts } from "@/lib/utils";
import type { EventItem } from "@/types/api";

export interface EventCardProps {
  event: EventItem;
}

/** Displays an upcoming event with a 4:5 poster/placeholder, IST date badge, venue details, and RegisterButton. */
export function EventCard({ event }: EventCardProps) {
  const { day, monthYear, time } = formatEventDateParts(event.date);

  return (
    <article className="flex flex-col overflow-hidden rounded-card border-2 border-ink bg-white text-ink">
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b-2 border-ink bg-sand">
        {event.posterUrl ? (
          <SafeImage
            src={event.posterUrl}
            alt={`${event.title} poster`}
            fill
            sizes={mediaConfig.gridCardSizes}
            className="object-cover"
            fallbackLabel={content.events.posterPlaceholder}
            fallbackTone="sand"
            fallbackRatio="4/5"
          />
        ) : (
          <Placeholder
            tone="sand"
            ratio="4/5"
            label={content.events.posterPlaceholder}
            className="h-full w-full"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 p-6">
        <div className="space-y-4">
          <div className="inline-flex items-baseline gap-2.5 rounded-input border-2 border-ink bg-yellow px-3.5 py-2">
            <span className="font-display-expanded text-[1.75rem] leading-none text-ink">{day}</span>
            <span className="font-meta text-ink">{monthYear}</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display-expanded text-[1.375rem] leading-tight text-ink md:text-[1.5rem]">
              {event.title}
            </h2>
            <p className="text-[0.875rem] text-muted">
              {event.venue} • {time}
            </p>
            {event.summary ? (
              <p className="pt-1 text-[0.9375rem] leading-relaxed text-ink/85">{event.summary}</p>
            ) : null}
          </div>
        </div>

        <RegisterButton
          eventId={event.id}
          eventTitle={event.title}
          variant="ink"
          label={content.events.registerLabel}
          withArrow
          fullWidth
        />
      </div>
    </article>
  );
}
