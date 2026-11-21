import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui";
import { NotifyForm } from "@/components/events/NotifyForm";
import { TicketCard } from "@/components/home/TicketCard";
import { content } from "@/lib/content";
import { formatEventDateParts } from "@/lib/utils";
import type { EventItem } from "@/types/api";

export interface EventsSectionProps {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
}

export function EventsSection({ upcomingEvents, pastEvents }: EventsSectionProps) {
  const nextEvent = upcomingEvents[0];
  const visiblePast = pastEvents.slice(0, 4);

  return (
    <Section id="events" tone="ink" aria-labelledby="events-heading">
      <Container className="space-y-10 md:space-y-12">
        <SectionHeading
          id="events-heading"
          title={content.events.heading}
          sticker={content.events.sticker}
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Upcoming event ticket OR inline empty state */}
          <div className="lg:col-span-7">
            {nextEvent ? (
              <TicketCard event={nextEvent} />
            ) : (
              <div className="max-w-[760px] space-y-6 rounded-card border-2 border-dashed border-cream/60 bg-ink p-7 text-cream md:p-9">
                <p className="max-w-[52ch] text-[17px] leading-relaxed text-cream">
                  {content.events.emptyUpcoming}
                </p>
                <NotifyForm
                  source="events-section"
                  mode="inline"
                  surface="ink"
                  idPrefix="home-events-notify"
                />
              </div>
            )}
          </div>

          {/* Past events list */}
          <div className="space-y-5 lg:col-span-5">
            <h3 className="font-display-expanded text-[22px] text-cream md:text-[24px]">
              {content.events.pastHeading}
            </h3>

            {visiblePast.length > 0 ? (
              <ul className="divide-y divide-line-on-ink border-t border-line-on-ink">
                {visiblePast.map((event) => {
                  const { year } = formatEventDateParts(event.date);
                  return (
                    <li
                      key={event.id}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      <div className="space-y-1">
                        <p className="font-display-expanded text-[20px] leading-tight text-cream md:text-[24px]">
                          {event.title}
                        </p>
                        <p className="text-[14px] text-muted-on-ink">
                          {event.venue} • {year}
                        </p>
                      </div>
                      <Link
                        href="/events?status=past"
                        className="inline-flex min-h-[44px] shrink-0 items-center text-[14px] font-semibold text-yellow underline decoration-2 underline-offset-4 transition-opacity duration-150 hover:opacity-80"
                      >
                        {content.events.galleryLink}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="border-t border-line-on-ink pt-5 text-[15px] text-muted-on-ink">
                {content.events.emptyPast}
              </p>
            )}

            <div className="pt-1">
              <Link
                href="/events"
                className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-cream underline decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-yellow"
              >
                {content.events.seeAll}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

