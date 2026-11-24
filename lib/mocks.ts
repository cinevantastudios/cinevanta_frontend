import { getEnvMockAdsMode, getEnvMockEventsMode } from "@/lib/env";
import { displayLimits, routes, site, themeColors } from "@/lib/site";
import type { Ad, EventItem, EventStatus, WorkCategory, WorkItem, WorkResponse } from "@/types/api";

interface SvgPlaceholderOptions {
  width: number;
  height: number;
  background: string;
  foreground: string;
  accent?: string;
  title: string;
  subtitle?: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createSvgDataUri({
  width,
  height,
  background,
  foreground,
  accent,
  title,
  subtitle,
}: SvgPlaceholderOptions): string {
  const titleFontSize = Math.max(24, Math.min(72, Math.round(height * 0.24)));
  const subtitleFontSize = Math.max(12, Math.min(20, Math.round(height * 0.08)));
  const safeTitle = escapeXml(title.toUpperCase());
  const safeSubtitle = subtitle ? escapeXml(subtitle.toUpperCase()) : "";
  const strokeColor = accent || foreground;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="${background}"/>`,
    `<rect x="16" y="16" width="${width - 32}" height="${height - 32}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="8 8" opacity="0.35"/>`,
    `<text x="50%" y="${subtitle ? "46%" : "52%"}" text-anchor="middle" dominant-baseline="middle" fill="${foreground}" font-family="'Arial Black', Impact, sans-serif" font-weight="800" font-size="${titleFontSize}" letter-spacing="-1">${safeTitle}</text>`,
    subtitle
      ? `<text x="50%" y="68%" text-anchor="middle" dominant-baseline="middle" fill="${foreground}" opacity="0.8" font-family="monospace" font-weight="500" font-size="${subtitleFontSize}" letter-spacing="2">${safeSubtitle}</text>`
      : "",
    `</svg>`,
  ].join("");

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const ALL_MOCK_ADS: Ad[] = [
  {
    id: "ad-mock-1",
    title: "[Event Name 1]",
    imageDesktop: createSvgDataUri({
      width: 1920,
      height: 240,
      background: themeColors.yellow,
      foreground: themeColors.ink,
      title: "[Event Name 1]",
      subtitle: "[Venue, City] • [Date]",
    }),
    imageMobile: createSvgDataUri({
      width: 750,
      height: 300,
      background: themeColors.yellow,
      foreground: themeColors.ink,
      title: "[Event Name 1]",
      subtitle: "[Venue, City] • [Date]",
    }),
    alt: `Promotional banner for [Event Name 1] by ${site.name}`,
    linkUrl: routes.events,
    label: "Featured event",
    startsAt: "2025-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    priority: 1,
  },
  {
    id: "ad-mock-2",
    title: "[Event Name 2]",
    imageDesktop: createSvgDataUri({
      width: 1920,
      height: 240,
      background: themeColors.ink,
      foreground: themeColors.cream,
      accent: themeColors.yellow,
      title: "[Event Name 2]",
      subtitle: "[Venue, City] • [Date]",
    }),
    imageMobile: createSvgDataUri({
      width: 750,
      height: 300,
      background: themeColors.ink,
      foreground: themeColors.cream,
      accent: themeColors.yellow,
      title: "[Event Name 2]",
      subtitle: "[Venue, City] • [Date]",
    }),
    alt: `Promotional banner for [Event Name 2] by ${site.name}`,
    linkUrl: routes.events,
    label: "Featured event",
    startsAt: "2025-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    priority: 2,
  },
  {
    id: "ad-mock-3",
    title: "[Event Name 3]",
    imageDesktop: createSvgDataUri({
      width: 1920,
      height: 240,
      background: themeColors.sand,
      foreground: themeColors.ink,
      title: "[Event Name 3]",
      subtitle: "[Venue, City] • [Date]",
    }),
    imageMobile: createSvgDataUri({
      width: 750,
      height: 300,
      background: themeColors.sand,
      foreground: themeColors.ink,
      title: "[Event Name 3]",
      subtitle: "[Venue, City] • [Date]",
    }),
    alt: `Promotional banner for [Event Name 3] by ${site.name}`,
    linkUrl: routes.events,
    label: "Featured event",
    startsAt: "2025-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    priority: 3,
  },
];

const ALL_MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-upcoming-1",
    slug: "event-name-1",
    title: "[Event Name 1]",
    date: "2027-06-15T18:30:00+05:30",
    venue: "[Venue, City]",
    city: site.locality,
    posterUrl: createSvgDataUri({
      width: 800,
      height: 1000,
      background: themeColors.yellow,
      foreground: themeColors.ink,
      title: "[Event Poster 1]",
      subtitle: "[Venue, City]",
    }),
    summary: "[Short event summary placeholder]",
    status: "upcoming",
  },
  {
    id: "evt-upcoming-2",
    slug: "event-name-2",
    title: "[Event Name 2]",
    date: "2027-09-20T19:00:00+05:30",
    venue: "[Venue, City]",
    city: site.locality,
    posterUrl: createSvgDataUri({
      width: 800,
      height: 1000,
      background: themeColors.sand,
      foreground: themeColors.ink,
      title: "[Event Poster 2]",
      subtitle: "[Venue, City]",
    }),
    summary: "[Short event summary placeholder]",
    status: "upcoming",
  },
  {
    id: "evt-past-1",
    slug: "past-event-1",
    title: "[Past Event Name 1]",
    date: "2025-11-10T18:00:00+05:30",
    venue: "[Venue, City]",
    city: site.locality,
    posterUrl: createSvgDataUri({
      width: 800,
      height: 1000,
      background: themeColors.ink,
      foreground: themeColors.cream,
      accent: themeColors.yellow,
      title: "[Past Event 1]",
      subtitle: "[Venue, City]",
    }),
    summary: "[Past event summary placeholder]",
    status: "past",
  },
  {
    id: "evt-past-2",
    slug: "past-event-2",
    title: "[Past Event Name 2]",
    date: "2025-08-04T19:30:00+05:30",
    venue: "[Venue, City]",
    city: site.locality,
    posterUrl: createSvgDataUri({
      width: 800,
      height: 1000,
      background: themeColors.white,
      foreground: themeColors.ink,
      title: "[Past Event 2]",
      subtitle: "[Venue, City]",
    }),
    summary: "[Past event summary placeholder]",
    status: "past",
  },
  {
    id: "evt-past-3",
    slug: "past-event-3",
    title: "[Past Event Name 3]",
    date: "2025-03-18T17:00:00+05:30",
    venue: "[Venue, City]",
    city: site.locality,
    posterUrl: createSvgDataUri({
      width: 800,
      height: 1000,
      background: themeColors.sand,
      foreground: themeColors.ink,
      title: "[Past Event 3]",
      subtitle: "[Venue, City]",
    }),
    summary: "[Past event summary placeholder]",
    status: "past",
  },
];

const ALL_MOCK_WORK: WorkItem[] = [
  {
    id: "work-1",
    title: "Kutumb: The Family",
    category: "film",
    year: 2017,
    imageUrl: "https://i.ytimg.com/vi/PUoXll37KB4/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=PUoXll37KB4",
    description:
      "Hindi feature film written and directed by Amit Shree Yadav, starring Alok Nath and Rajpal Yadav. Official trailer and soundtrack released on T-Series.",
  },
  {
    id: "work-2",
    title: "Celebrity Cricket Cup — Ekana Stadium, Lucknow",
    category: "live_event",
    year: 2018,
    imageUrl: "https://i.ytimg.com/vi/mOokta31Fmk/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=mOokta31Fmk",
    description:
      "Star-studded T20 celebrity cricket tournament at Bharat Ratna Shri Atal Bihari Vajpayee Ekana International Stadium, Lucknow, featuring Suniel Shetty, Sonu Sood, Rajpal Yadav, and Ravi Kishan.",
  },
  {
    id: "work-3",
    title: "Gannu — Hindi Short Film (Pocket Films)",
    category: "film",
    year: 2021,
    imageUrl: "https://i.ytimg.com/vi/xSPEC6QVCM8/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=xSPEC6QVCM8",
    description:
      "18-minute emotional drama short film directed by Amit Shree Yadav exploring overprotective parenting and children's creative freedom, streaming on Pocket Films.",
  },
  {
    id: "work-4",
    title: "Suniel Shetty Captain Promo — Celebrity Cricket Cup",
    category: "advertising",
    year: 2018,
    imageUrl: "https://i.ytimg.com/vi/rlwyqTEnh1w/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=rlwyqTEnh1w",
    description:
      "Promotional campaign and broadcast feature starring Bollywood captain Suniel Shetty for the Celebrity Cricket Cup in Lucknow.",
  },
  {
    id: "work-5",
    title: "Mr. & Miss UP — Regional Fashion & Talent Platform",
    category: "fashion",
    year: 2022,
    imageUrl: "https://i.ytimg.com/vi/7E4XKa8z1MQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=7E4XKa8z1MQ",
    description:
      "Regional runway, pageant, and talent mentorship initiative featuring director Amit Shree Yadav on the celebrity jury panel.",
  },
  {
    id: "work-6",
    title: "Atal Stadium Celebrity Match — Broadcast Coverage",
    category: "corporate",
    year: 2018,
    imageUrl: "https://i.ytimg.com/vi/hsQqNP-azbI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=hsQqNP-azbI",
    description:
      "Multi-camera stadium production, press coordination, and national television coverage (Bharat Samachar) at Atal Bihari Vajpayee Ekana Stadium.",
  },
  {
    id: "work-7",
    title: "Ekana Stadium Bollywood Captain Byte — Suniel Shetty",
    category: "advertising",
    year: 2018,
    imageUrl: "https://i.ytimg.com/vi/jP2MyjpYrxE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=jP2MyjpYrxE",
    description:
      "Official pre-match campaign spot featuring Bollywood captain Suniel Shetty ahead of the Celebrity Cricket Cup at Ekana Cricket Stadium, Lucknow.",
  },
];

/** Returns mock ads controlled by NEXT_PUBLIC_MOCK_ADS ("0" for none, "3" for active set). */
export function getMockAds(): Ad[] {
  const mode = getEnvMockAdsMode();
  if (mode === "0") {
    return [];
  }
  return ALL_MOCK_ADS.slice(0, 3);
}

/** Returns mock events controlled by NEXT_PUBLIC_MOCK_EVENTS ("none" or "some"), optionally filtered by status. */
export function getMockEvents(status?: EventStatus): EventItem[] {
  const mode = getEnvMockEventsMode();
  if (mode === "none") {
    return [];
  }
  if (!status) {
    return ALL_MOCK_EVENTS;
  }
  return ALL_MOCK_EVENTS.filter((event) => event.status === status);
}

export function getMockWork(
  category?: WorkCategory,
  page = 1,
  pageSize: number = displayLimits.workPageSize,
): WorkResponse {
  const filtered = category
    ? ALL_MOCK_WORK.filter((item) => item.category === category)
    : ALL_MOCK_WORK;

  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
  };
}

export function waitMockLatency(ms = 600): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

