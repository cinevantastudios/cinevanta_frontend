import type { Metadata } from "next";
import { displayLimits, routes, site } from "@/lib/site";
import type { Ad } from "@/types/api";

type ClassValue = string | number | boolean | null | undefined | ClassValue[];

/** Cached Intl date/time formatters initialized dynamically from `site.locale` and `site.timeZone`. */
const DAY_FORMATTER = new Intl.DateTimeFormat(site.locale, {
  day: "2-digit",
  timeZone: site.timeZone,
});
const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat(site.locale, {
  month: "short",
  year: "numeric",
  timeZone: site.timeZone,
});
const TIME_FORMATTER = new Intl.DateTimeFormat(site.locale, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: site.timeZone,
});
const YEAR_FORMATTER = new Intl.DateTimeFormat(site.locale, {
  year: "numeric",
  timeZone: site.timeZone,
});
const FULL_DATE_FORMATTER = new Intl.DateTimeFormat(site.locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: site.timeZone,
});

/** Joins conditional Tailwind/CSS class names cleanly, ignoring falsy values. */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    }
  }

  return classes.join(" ");
}

/**
 * Checks whether a URL is safe for navigation (app-relative "/..." or http(s)://).
 * Blocks javascript:, data:, vbscript:, and protocol-relative "//" URLs.
 */
export function isSafeHref(url: string): boolean {
  const trimmed = url.trim();
  return /^\/(?!\/)/.test(trimmed) || /^https?:\/\//i.test(trimmed);
}

/**
 * Determines whether a URL points outside the Next.js router (http(s), mailto, tel, or explicit flag).
 */
export function isExternalHref(url: string, explicitExternal = false): boolean {
  if (explicitExternal) return true;
  return /^(https?:|mailto:|tel:)/i.test(url.trim());
}

/**
 * Determines whether a primary navigation item matches the active pathname.
 * Excludes hash-anchor links (such as `/#services`) from active route highlighting.
 */
export function isNavRouteActive(pathname: string, itemHref: string): boolean {
  if (itemHref === routes.services || itemHref.includes("#")) {
    return false;
  }
  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

/**
 * Builds consistent Next.js page Metadata and Open Graph tags from a single factory.
 */
export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
    },
  };
}

/** Returns true if an ad's schedule window includes the provided reference timestamp. */
export function isAdActiveAt(ad: Pick<Ad, "startsAt" | "endsAt">, now: Date = new Date()): boolean {
  const start = Date.parse(ad.startsAt);
  const end = Date.parse(ad.endsAt);
  const current = now.getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }

  return current >= start && current <= end;
}

/** Filters ads to those active at `now`, sorts by ascending priority, and caps the slide count. */
export function filterAndSortAds(
  ads: Ad[],
  now: Date = new Date(),
  maxSlides: number = displayLimits.maxAdSlides,
): Ad[] {
  return ads
    .filter((ad) => isAdActiveAt(ad, now))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxSlides);
}

/** Formats an ISO date string into display parts for event cards and tickets using `site.locale` and `site.timeZone`. */
export function formatEventDateParts(isoDate: string): {
  day: string;
  monthYear: string;
  time: string;
  year: string;
  fullDate: string;
} {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      monthYear: "[Month YYYY]",
      time: "[Time]",
      year: "[YYYY]",
      fullDate: isoDate,
    };
  }

  return {
    day: DAY_FORMATTER.format(date),
    monthYear: MONTH_YEAR_FORMATTER.format(date),
    time: TIME_FORMATTER.format(date),
    year: YEAR_FORMATTER.format(date),
    fullDate: FULL_DATE_FORMATTER.format(date),
  };
}
