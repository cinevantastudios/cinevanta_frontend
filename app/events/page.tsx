import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { EventsView } from "@/components/events/EventsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getEvents } from "@/lib/api";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import type { EventStatus } from "@/types/api";

export const metadata: Metadata = {
  title: content.events.pageTitle,
  description: content.events.pageLead,
  openGraph: {
    title: `${content.events.pageTitle} | Cinevanta Studios`,
    description: content.events.pageLead,
    url: "/events",
  },
};

interface EventsPageProps {
  searchParams: Promise<{ status?: string | string[] }>;
}

function parseStatus(raw: string | string[] | undefined): EventStatus {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "past" ? "past" : "upcoming";
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const initialStatus = parseStatus(params.status);

  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents("upcoming"),
    getEvents("past"),
  ]);

  const upcomingJsonLd = upcomingEvents.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  }));

  return (
    <main id="main-content">
      {upcomingJsonLd.map((ld, idx) => (
        <JsonLd key={upcomingEvents[idx]?.id ?? idx} data={ld} />
      ))}
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.events.pageTitle}
            </h1>
            <p className="text-[18px] leading-[1.6] text-muted">{content.events.pageLead}</p>
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
