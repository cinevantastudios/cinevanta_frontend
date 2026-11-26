import { getEnvSiteUrl } from "@/lib/env";
import type { EnquiryType, EventStatus, WorkCategory } from "@/types/api";

/** Canonical brand color tokens shared by CSS variables, Open Graph images, PWA manifest, and SVG assets. */
export const themeColors = {
  cream: "#FFF6E3",
  ink: "#15110E",
  yellow: "#FFC93C",
  sand: "#FFE7B0",
  white: "#FFFFFF",
  muted: "#5C5249",
  mutedOnInk: "#D8CEBD",
  faint: "#A39787",
  lineOnInk: "#5A5148",
} as const;

/** Canonical application route paths and one-page section anchors so navigation, CTAs, and sitemaps share one source of truth. */
export const routes = {
  home: "/",
  services: "/#services",
  work: "/#work",
  events: "/#events",
  about: "/#about",
  contact: "/#contact",
  privacy: "/privacy",
  terms: "/terms",
  styleguide: "/styleguide",
  serviceAnchor: (category: WorkCategory) => `/#${category}`,
  workByCategory: (_category?: WorkCategory | "all") => "/#work",
  eventsByStatus: (_status?: EventStatus) => "/#events",
  eventAnchor: (_status: EventStatus, slug: string) =>
    `/#${encodeURIComponent(slug)}`,
  contactByType: (_type?: EnquiryType) => "/#contact",
} as const;

/** Centralized pagination and section item-count limits across home, work, events, and ad strip. */
export const displayLimits = {
  workPageSize: 9,
  homeWorkPreviewCount: 6,
  homePastEventsCount: 4,
  maxAdSlides: 5,
} as const;

/** Centralized layout scale and container framing tokens so all pages and future components share one source of truth. */
export const layoutConfig = {
  rootScalePercent: 90,
  containerMaxWidthPx: 1318,
  containerMaxWidthCss: "var(--container-max-width)",
} as const;

/** Centralized UI interaction timings and scroll/gesture thresholds. */
export const uiConfig = {
  adAutoplayIntervalMs: 5500,
  adImpressionDelayMs: 1000,
  adSwipeDistancePx: 40,
  adSwipeVelocityPxPerMs: 0.3,
  toastDurationMs: 4000,
  navScrollBorderThresholdPx: 8,
  navScrollDeltaPx: 6,
  navHideThresholdPx: 72,
} as const;

/** Centralized responsive media queries, next/image `sizes` presets, and privacy video embed origins. */
export const mediaConfig = {
  mobileMediaQuery: "(max-width: 767px)",
  gridCardSizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  dialogHeroSizes: "(max-width: 767px) 100vw, 720px",
  thumbnailSizes: "(max-width: 639px) 100vw, 96px",
  youtubeEmbedBaseUrl: "https://www.youtube-nocookie.com",
  vimeoEmbedBaseUrl: "https://player.vimeo.com",
} as const;

/** Social media link rendered in the footer and contact details. */
export interface SocialLink {
  label: string;
  href: string;
}

/** Optional hero showreel video and poster configuration. */
export interface ShowreelMedia {
  videoUrl: string;
  posterUrl?: string;
}

/** Global studio metadata, locale/timezone, and contact configuration. */
export interface SiteConfig {
  name: string;
  wordmark: string;
  shortMark: string;
  proprietorName: string;
  legalStructure: string;
  streetAddress: string;
  locality: string;
  postalCode: string;
  countryName: string;
  countryCode: string;
  city: string;
  address: string;
  locale: string;
  ogLocale: string;
  htmlLang: string;
  timeZone: string;
  foundedYear: number;
  email: string;
  phone: string;
  responseTime: string;
  copyright: string;
  url: string;
  showreel: ShowreelMedia | null;
  socials: SocialLink[];
  partners: string[];
}

const STUDIO_NAME = "Cinevanta Studios";
const STUDIO_WORDMARK = "Cinevanta";
const STUDIO_PROPRIETOR_NAME = "Amit Shree Yadav";
const STUDIO_LEGAL_STRUCTURE = "Sole proprietorship";
const STUDIO_STREET_ADDRESS = "183, Mayur Vihar Phase 2";
const STUDIO_LOCALITY = "Delhi";
const STUDIO_POSTAL_CODE = "110091";
const STUDIO_COUNTRY_NAME = "India";
const STUDIO_FOUNDED_YEAR = 2026;

/** Canonical site configuration shared across pages, metadata, JSON-LD, date formatters, and layout. */
export const site: SiteConfig = {
  name: STUDIO_NAME,
  wordmark: STUDIO_WORDMARK,
  shortMark: `${STUDIO_WORDMARK.charAt(0).toUpperCase()}*`,
  proprietorName: STUDIO_PROPRIETOR_NAME,
  legalStructure: STUDIO_LEGAL_STRUCTURE,
  streetAddress: STUDIO_STREET_ADDRESS,
  locality: STUDIO_LOCALITY,
  postalCode: STUDIO_POSTAL_CODE,
  countryName: STUDIO_COUNTRY_NAME,
  countryCode: "IN",
  city: `${STUDIO_LOCALITY}, ${STUDIO_COUNTRY_NAME}`,
  address: `${STUDIO_STREET_ADDRESS}, ${STUDIO_LOCALITY} – ${STUDIO_POSTAL_CODE}, ${STUDIO_COUNTRY_NAME}`,
  locale: "en-IN",
  ogLocale: "en_IN",
  htmlLang: "en",
  timeZone: "Asia/Kolkata",
  foundedYear: STUDIO_FOUNDED_YEAR,
  email: "amitshreeyadav@gmail.com",
  phone: "+91 7992022400",
  responseTime: "We reply within 1–2 working days.",
  copyright: `© ${STUDIO_FOUNDED_YEAR} ${STUDIO_NAME}`,
  url: getEnvSiteUrl(),
  showreel: {
    videoUrl: "https://www.youtube.com/watch?v=mOokta31Fmk",
    posterUrl: "https://i.ytimg.com/vi/mOokta31Fmk/hqdefault.jpg",
  },
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "https://www.youtube.com/watch?v=PUoXll37KB4" },
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ],
  partners: ["T-Series", "Pocket Films", "BookMyShow", "Shyam Entertainments"],
};

/** Formats the studio's single-line contact summary (email • phone • city) from `site`. */
export function formatStudioContactSummary(separator = " • "): string {
  return [site.email, site.phone, site.city].join(separator);
}
