import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { EventsView } from "@/components/events/EventsView";
import { JsonLd, buildEventJsonLd } from "@/components/seo/JsonLd";
import { getEvents } from "@/lib/api-client";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";
import type { EventStatus } from "@/types/api";

export const metadata: Metadata = createPageMetadata({
  title: content.events.pageTitle,
  description: content.events.pageLead,
  path: routes.events,
});

interface EventsPageProps {
  searchParams?: Promise<{ status?: string | string[] }>;
}

/** Parses the requested ?status= query param on the server so deep links render with zero tab flash. */
function parseStatus(raw: string | string[] | undefined): EventStatus {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "past" ? "past" : "upcoming";
}

/**
 * Events archive and upcoming schedule page.
 * Reads `searchParams` on the server for instant deep-link tab rendering while `getEvents`
 * caches upstream API responses via `cache_logics/revalidation-cache`.
 */
export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialStatus = parseStatus(params.status);

  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents("upcoming"),
    getEvents("past"),
  ]);

  return (
    <main id="main-content">
      {upcomingEvents.map((event) => (
        <JsonLd key={event.id} data={buildEventJsonLd(event)} />
      ))}
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.events.pageTitle}
            </h1>
            <p className="text-[1.125rem] leading-[1.6] text-muted">{content.events.pageLead}</p>
          </div>

          <EventsView
            initialStatus={initialStatus}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
          />
        </Container>
      </Section>
    </main>
  );
}
