import Link from "next/link";
import { Button, Container, Section, SectionHeading } from "@/components/ui";
import { content } from "@/lib/content";
import { displayLimits, routes } from "@/lib/site";
import { formatEventDateParts } from "@/lib/utils";
import type { EventItem } from "@/types/api";

export interface EventsSectionProps {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
}

/**
 * Basic fast-track Events section on the home page.
 * Shows the next upcoming event in a simple card alongside a list of recent past events.
 */
export function EventsSection({ upcomingEvents, pastEvents }: EventsSectionProps) {
  const nextEvent = upcomingEvents[0];
  const visiblePast = pastEvents.slice(0, displayLimits.homePastEventsCount);

  return (
    <Section
      id="events"
      tone="ink"
      className="scroll-mt-20"
      aria-labelledby="events-heading"
    >
      <Container className="space-y-10">
        <SectionHeading
          id="events-heading"
          title={content.events.heading}
          sticker={content.events.sticker}
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Next upcoming event card or simple empty note */}
          <div className="lg:col-span-7">
            {nextEvent ? (
              <article className="space-y-5 rounded-card border-2 border-cream bg-yellow p-7 text-ink md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-meta rounded-pill border-2 border-ink bg-white px-3 py-1 text-ink">
                    {content.events.upcomingBadge}
                  </span>
                  <span className="font-meta text-ink/80">
                    {formatEventDateParts(nextEvent.date).fullDate}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display-expanded text-h2 text-ink">{nextEvent.title}</h3>
                  <p className="text-[0.9375rem] font-semibold text-ink/85">
                    {nextEvent.venue} • {nextEvent.city}
                  </p>
                  {nextEvent.summary ? (
                    <p className="max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink/80">
                      {nextEvent.summary}
                    </p>
                  ) : null}
                </div>

                <div className="pt-2">
                  <Button href={routes.contactByType("live_event")} variant="ink" withArrow>
                    {content.events.registerLabel}
                  </Button>
                </div>
              </article>
            ) : (
              <div className="space-y-5 rounded-card border-2 border-dashed border-cream/60 bg-ink p-7 text-cream md:p-8">
                <p className="max-w-[52ch] text-[1.0625rem] leading-relaxed text-cream">
                  {content.events.emptyUpcoming}
                </p>
                <Button href={routes.contactByType("live_event")} variant="yellow" withArrow>
                  {content.cta.button}
                </Button>
              </div>
            )}
          </div>

          {/* Past events list */}
          <div className="space-y-5 lg:col-span-5">
            <h3 className="font-display-expanded text-[1.375rem] text-cream md:text-[1.5rem]">
              {content.events.pastHeading}
            </h3>

            {visiblePast.length > 0 ? (
              <ul className="divide-y divide-line-on-ink border-t border-line-on-ink">
                {visiblePast.map((event) => {
                  const { year } = formatEventDateParts(event.date);
                  return (
                    <li
                      key={event.id}
                      className="flex items-baseline justify-between gap-4 py-4"
                    >
                      <div className="space-y-1">
                        <p className="font-display-expanded text-[1.25rem] leading-tight text-cream">
                          {event.title}
                        </p>
                        <p className="text-[0.875rem] text-muted-on-ink">
                          {event.venue} • {year}
                        </p>
                      </div>
                      <Link
                        href={routes.events}
                        className="inline-flex min-h-[2.75rem] shrink-0 items-center text-[0.875rem] font-semibold text-yellow underline decoration-2 underline-offset-4"
                      >
                        {content.events.galleryLink}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="border-t border-line-on-ink pt-5 text-[0.9375rem] text-muted-on-ink">
                {content.events.emptyPast}
              </p>
            )}

            <div className="pt-1">
              <Link
                href={routes.events}
                className="inline-flex min-h-[2.75rem] items-center text-[0.9375rem] font-semibold text-cream underline decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-yellow"
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
