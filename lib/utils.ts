import type { Ad } from "@/types/api";

type ClassValue = string | number | boolean | null | undefined | ClassValue[];

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

export function isAdActiveAt(ad: Pick<Ad, "startsAt" | "endsAt">, now: Date = new Date()): boolean {
  const start = Date.parse(ad.startsAt);
  const end = Date.parse(ad.endsAt);
  const current = now.getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return false;
  }

  return current >= start && current <= end;
}

export function filterAndSortAds(ads: Ad[], now: Date = new Date(), maxSlides = 5): Ad[] {
  return ads
    .filter((ad) => isAdActiveAt(ad, now))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxSlides);
}

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

  const day = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const monthYear = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);

  const year = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const fullDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);

  return { day, monthYear, time, year, fullDate };
}

