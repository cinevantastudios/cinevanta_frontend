import type { Metadata } from "next";
import { Button, Container, EmptyState, Section } from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { JsonLd, buildEventJsonLd } from "@/components/seo/JsonLd";
import { getEvents } from "@/lib/api-client";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { createPageMetadata, formatEventDateParts } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.events.pageTitle,
  description: content.events.pageLead,
  path: routes.events,
});

export interface EventsPageProps {
  searchParams?: Promise<{ status?: string | string[] }>;
}

/**
 * Basic fast-track Events page.
 * Displays upcoming events and past events in a clean static layout.
 */
export default async function EventsPage(_props: EventsPageProps) {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents("upcoming"),
    getEvents("past"),
  ]);

  return (
    <main id="main-content">
      {upcomingEvents.map((event) => (
        <JsonLd key={event.id} data={buildEventJsonLd(event)} />
      ))}

      <Section tone="cream" className="pt-12 pb-16 md:pt-16">
        <Container className="space-y-12">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.events.pageTitle}
            </h1>
            <p className="text-[1.125rem] leading-[1.6] text-muted">{content.events.pageLead}</p>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <h2 className="font-display-expanded text-h2 text-ink">
              {content.events.upcomingBadge}
            </h2>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {upcomingEvents.map((event) => {
                  const { fullDate } = formatEventDateParts(event.date);
                  return (
                    <article
                      key={event.id}
                      id={event.slug}
                      className="flex flex-col justify-between gap-6 rounded-card border-2 border-ink bg-white p-7 text-ink"
                    >
                      <div className="space-y-3">
                        <span className="font-meta inline-block rounded-pill border border-ink bg-yellow px-3 py-1 text-ink">
                          {fullDate}
                        </span>
                        <h3 className="font-display-expanded text-[1.5rem] text-ink">
                          {event.title}
                        </h3>
                        <p className="text-[0.9375rem] font-medium text-ink">
                          {event.venue} • {event.city}
                        </p>
                        {event.summary ? (
                          <p className="text-[0.9375rem] leading-relaxed text-muted">
                            {event.summary}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <Button
                          href={routes.contactByType("live_event")}
                          variant="ink"
                          withArrow
                        >
                          {content.events.registerLabel}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState message={content.events.emptyUpcoming} />
            )}
          </div>

          {/* Past Events */}
          <div className="space-y-6 border-t-2 border-ink pt-10">
            <h2 className="font-display-expanded text-h2 text-ink">
              {content.events.pastHeading}
            </h2>

            {pastEvents.length > 0 ? (
              <ul className="divide-y-2 divide-ink border-y-2 border-ink">
                {pastEvents.map((event) => {
                  const { fullDate } = formatEventDateParts(event.date);
                  return (
                    <li
                      key={event.id}
                      id={event.slug}
                      className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-baseline"
                    >
                      <div>
                        <h3 className="font-display-expanded text-[1.25rem] text-ink">
                          {event.title}
                        </h3>
                        {event.summary ? (
                          <p className="mt-1 text-[0.9375rem] text-muted">{event.summary}</p>
                        ) : null}
                      </div>
                      <p className="font-meta shrink-0 text-muted">
                        {event.venue} • {fullDate}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState message={content.events.emptyPast} />
            )}
          </div>
        </Container>
      </Section>

      <CtaBlock />
    </main>
  );
}
