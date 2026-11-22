import { site } from "@/lib/site";
import type { EventItem } from "@/types/api";

export interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Builds the Schema.org Organization structured data object from centralized `site` config. */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    founder: {
      "@type": "Person",
      name: site.proprietorName,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.locality,
      postalCode: site.postalCode,
      addressCountry: site.countryCode,
    },
  };
}

/** Builds a Schema.org Event structured data object for an upcoming event. */
export function buildEventJsonLd(event: EventItem): Record<string, unknown> {
  return {
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
        addressCountry: site.countryCode,
      },
    },
    organizer: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };
}

/**
 * Renders structured JSON-LD safely as a React text child (no dangerouslySetInnerHTML).
 * Escapes "<" to prevent premature </script> closing from dynamic API strings.
 */
export function JsonLd({ data }: JsonLdProps) {
  const safeJson = JSON.stringify(data).replaceAll("<", "\\u003c");
  return <script type="application/ld+json">{safeJson}</script>;
}
