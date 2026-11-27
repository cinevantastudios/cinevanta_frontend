import { content } from "@/lib/content";
import { site } from "@/lib/site";
import type { EventItem } from "@/types/api";

export interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Brand & founder name variations for Schema.org `alternateName` so searches for Cinevanta or Amit Shree/Shri Yadav resolve to this entity. */
const BRAND_ALTERNATE_NAMES = [
  "Cinevanta",
  "CineVanta",
  "Cinevanta Studio",
  "CineVanta Studio",
  "CineVanta Studios",
  "Cinevanta Studios Delhi",
  "Cinevanta Studios India",
  "Cinevanta Films",
  "Cinevanta Production",
  "Cinevanta Productions",
  "Cinevanta Production House",
  "Cinevanta Entertainment",
  "Cinevanta Delhi",
  "Amit Shree Yadav",
  "Amit Shri Yadav",
  "Amit Shree Yadav Production House",
  "Cinevanta Studios by Amit Shree Yadav",
] as const;

/** Verified public authority & Knowledge Graph profiles for founder Amit Shree Yadav (consolidated from public records). */
const FOUNDER_SAME_AS = [
  "https://www.google.com/search?kgmid=/g/11df3hyddt&hl=en-IN&q=Amit+Shree+Yadav",
  "https://www.youtube.com/@ammiyadav",
  "https://www.moviebuff.com/amit-shree-yadav",
  "https://in.bookmyshow.com/person/amit-shree-yadav/1087102",
  "https://www.indianfilmhistory.com/actor/amit-shree-yadav",
] as const;

/** Builds the Schema.org Organization structured data object from centralized `site` config. */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  const baseUrl = site.url.replace(/\/+$/, "");
  const logoUrl = `${baseUrl}/images/logo.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: site.name,
    legalName: site.name,
    alternateName: [...BRAND_ALTERNATE_NAMES],
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    image: logoUrl,
    description: content.meta.defaultDescription,
    email: site.email,
    telephone: site.phone,
    founder: {
      "@type": "Person",
      "@id": `${baseUrl}/#founder`,
      name: site.proprietorName,
      alternateName: ["Amit Shri Yadav", "Amit Kumar"],
      jobTitle: "Film Director, Screenwriter & Producer",
      sameAs: [...FOUNDER_SAME_AS],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.locality,
      postalCode: site.postalCode,
      addressCountry: site.countryCode,
    },
    areaServed: ["Delhi", "Delhi NCR", "Mumbai", "Lucknow", "Uttar Pradesh", "India"],
    knowsAbout: [
      "Film Production",
      "Hindi Feature Films",
      "Short Films",
      "Advertising Campaigns",
      "TV Commercials",
      "Live Events & Sports",
      "Celebrity Cricket Cup",
      "Fashion Shows & Pageants",
      "Talent Management",
      "Corporate Events",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "customer service",
      areaServed: site.countryCode,
      availableLanguage: ["English", "Hindi"],
    },
  };
}

/** Builds the Schema.org Person structured data linking Cinevanta Studios to founder Amit Shree Yadav's verified Knowledge Graph entity. */
export function buildFounderPersonJsonLd(): Record<string, unknown> {
  const baseUrl = site.url.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#founder`,
    name: site.proprietorName,
    alternateName: ["Amit Shri Yadav", "Amit Kumar", "Amit Shree Yadav Director"],
    jobTitle: "Film Director, Screenwriter & Live Event Producer",
    description:
      "Indian film director, screenwriter, and live-event producer behind Kutumb: The Family (2017, T-Series), Celebrity Cricket Cup at Ekana International Stadium Lucknow (2018), Gannu (2021, Pocket Films), and Mr. & Miss UP.",
    url: site.url,
    image: `${baseUrl}/images/amit-shree-yadav.jpg`,
    worksFor: {
      "@id": `${baseUrl}/#organization`,
    },
    sameAs: [...FOUNDER_SAME_AS],
  };
}

/** Builds the Schema.org ItemList of verified real-world films, sports spectacles, and productions associated with Cinevanta Studios & Amit Shree Yadav. */
export function buildFeaturedWorksJsonLd(): Record<string, unknown> {
  const baseUrl = site.url.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/#featured-works`,
    name: `${site.name} — Verified Films & Live Event Productions`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SportsEvent",
          name: "Celebrity Cricket Cup 2018 — Lucknow",
          startDate: "2018-12-02",
          description:
            "T20 exhibition celebrity cricket tournament at Bharat Ratna Shri Atal Bihari Vajpayee Ekana International Cricket Stadium, Lucknow, organized by Amit Shree Yadav featuring Suniel Shetty, Sonu Sood, Rajpal Yadav, Ravi Kishan, and Dinesh Lal Yadav.",
          location: {
            "@type": "Place",
            name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana International Cricket Stadium",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Lucknow",
              addressRegion: "Uttar Pradesh",
              addressCountry: "IN",
            },
          },
          performer: [
            { "@type": "Person", name: "Suniel Shetty" },
            { "@type": "Person", name: "Sonu Sood" },
            { "@type": "Person", name: "Rajpal Yadav" },
            { "@type": "Person", name: "Ravi Kishan" },
            { "@type": "Person", name: "Dinesh Lal Yadav" },
          ],
          organizer: { "@id": `${baseUrl}/#founder` },
          sameAs: [
            "https://in.bookmyshow.com/sports/celebrity-cricket-cup-2018/ET00087651",
            "https://www.youtube.com/watch?v=mOokta31Fmk",
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Movie",
          name: "Kutumb: The Family",
          datePublished: "2017-11-03",
          duration: "PT1H55M",
          inLanguage: "hi",
          description:
            "Hindi theatrical family drama written and directed by Amit Shree Yadav, starring Alok Nath and Rajpal Yadav, with music released on T-Series.",
          director: { "@id": `${baseUrl}/#founder` },
          author: { "@id": `${baseUrl}/#founder` },
          actor: [
            { "@type": "Person", name: "Alok Nath" },
            { "@type": "Person", name: "Rajpal Yadav" },
            { "@type": "Person", name: "Alok Nair" },
            { "@type": "Person", name: "Ritu Sharma" },
            { "@type": "Person", name: "Vaishali Shrivastav" },
          ],
          productionCompany: {
            "@type": "Organization",
            name: "Shyam Entertainments Pvt. Ltd.",
          },
          sameAs: [
            "https://www.youtube.com/watch?v=PUoXll37KB4",
            "https://www.bollywoodhungama.com/movie/kutumb-the-family/",
            "https://www.moviebuff.com/kutumb-the-family",
            "https://timesofindia.indiatimes.com/entertainment/hindi/movie-reviews/kutumb-the-family/movie-review/61606856.cms",
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Movie",
          name: "Gannu",
          datePublished: "2021",
          duration: "PT18M",
          inLanguage: "hi",
          description:
            "Inspirational Hindi short film written and directed by Amit Shree Yadav, produced under Navlam Film Productions and released on Pocket Films.",
          director: { "@id": `${baseUrl}/#founder` },
          author: { "@id": `${baseUrl}/#founder` },
          productionCompany: {
            "@type": "Organization",
            name: "Navlam Film Productions",
          },
          sameAs: ["https://www.youtube.com/watch?v=xSPEC6QVCM8"],
        },
      },
    ],
  };
}

/** Builds the Schema.org WebSite structured data object so Google displays the canonical Site Name above search results. */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  const baseUrl = site.url.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: site.name,
    alternateName: [...BRAND_ALTERNATE_NAMES],
    url: site.url,
    description: content.meta.defaultDescription,
    inLanguage: site.locale,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
  };
}

/** Builds the Schema.org EntertainmentBusiness (LocalBusiness) structured data object for Delhi / India local search visibility. */
export function buildLocalBusinessJsonLd(): Record<string, unknown> {
  const baseUrl = site.url.replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: site.name,
    alternateName: [...BRAND_ALTERNATE_NAMES],
    url: site.url,
    image: `${baseUrl}/images/logo.png`,
    description: content.meta.defaultDescription,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.locality,
      postalCode: site.postalCode,
      addressCountry: site.countryCode,
    },
    areaServed: "India",
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
