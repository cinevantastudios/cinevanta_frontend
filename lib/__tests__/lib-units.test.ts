import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportError, trackEvent, trackPageView } from "@/lib/analytics";
import { content } from "@/lib/content";
import { requireDefinedEnv, requireEnv } from "@/lib/env";
import { layoutConfig, routes, site, themeColors } from "@/lib/site";
import {
  resetTrackingMemoryForTests,
  trackAdClick,
  trackAdImpressionOnce,
} from "@/lib/tracking";
import {
  cn,
  filterAndSortAds,
  formatEventDateParts,
  isAdActiveAt,
  isExternalHref,
  isSafeHref,
} from "@/lib/utils";
import {
  enquiryFormSchema,
  footerNotifySchema,
  inlineNotifySchema,
  isValidIndianPhone,
  mapZodFieldErrors,
  normalizePhone,
  notifyFormSchema,
} from "@/lib/validators";
import type { Ad } from "@/types/api";

const originalEnv = { ...process.env };

describe("lib/env, lib/utils, lib/validators, lib/tracking, lib/analytics & lib/site", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000";
    resetTrackingMemoryForTests();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  describe("lib/env", () => {
    it("requireEnv trims valid strings and throws on undefined, empty, or whitespace-only values", () => {
      expect(requireEnv("  https://cinevanta.in  ", "TEST_VAR")).toBe("https://cinevanta.in");
      expect(() => requireEnv(undefined, "TEST_VAR")).toThrow(
        "Missing required environment variable: TEST_VAR",
      );
      expect(() => requireEnv("", "TEST_VAR")).toThrow(
        "Missing required environment variable: TEST_VAR",
      );
      expect(() => requireEnv("   ", "TEST_VAR")).toThrow(
        "Missing required environment variable: TEST_VAR",
      );
    });

    it("requireDefinedEnv allows empty strings when explicitly defined but throws on undefined", () => {
      expect(requireDefinedEnv("", "EMPTY_LIST")).toBe("");
      expect(requireDefinedEnv("  cdn.example.com  ", "HOST_LIST")).toBe("cdn.example.com");
      expect(() => requireDefinedEnv(undefined, "MISSING_LIST")).toThrow(
        "Missing required environment variable: MISSING_LIST",
      );
    });
  });

  describe("lib/utils", () => {
    it("cn combines strings, numbers, nested arrays, and ignores falsy values", () => {
      expect(cn("a", false, null, undefined, "", 0, ["b", ["c", null]], 42)).toBe("a b c 42");
      expect(cn()).toBe("");
    });

    it("isSafeHref allows relative paths and http(s) URLs while blocking dangerous protocols", () => {
      expect(isSafeHref("/events")).toBe(true);
      expect(isSafeHref("/work?category=film")).toBe(true);
      expect(isSafeHref("https://cinevanta.in/reel")).toBe(true);
      expect(isSafeHref("http://localhost:3000")).toBe(true);

      expect(isSafeHref("//evil.example.com")).toBe(false);
      expect(isSafeHref("javascript:alert(1)")).toBe(false);
      expect(isSafeHref("JAVASCRIPT:alert(1)")).toBe(false);
      expect(isSafeHref("data:text/html,<script>alert(1)</script>")).toBe(false);
      expect(isSafeHref("vbscript:msgbox(1)")).toBe(false);
      expect(isSafeHref("")).toBe(false);
    });

    it("isExternalHref detects http(s), mailto, tel, and explicitExternal flags", () => {
      expect(isExternalHref("/events")).toBe(false);
      expect(isExternalHref("/events", true)).toBe(true);
      expect(isExternalHref("https://youtube.com")).toBe(true);
      expect(isExternalHref("http://example.com")).toBe(true);
      expect(isExternalHref("mailto:hello@cinevanta.in")).toBe(true);
      expect(isExternalHref("tel:+919876543210")).toBe(true);
    });

    it("isAdActiveAt and filterAndSortAds handle schedule boundaries, invalid dates, sorting, and maxSlides cap", () => {
      const now = new Date("2026-06-15T12:00:00.000Z");

      expect(
        isAdActiveAt(
          { startsAt: "invalid-date", endsAt: "2026-12-31T00:00:00.000Z" },
          now,
        ),
      ).toBe(false);

      const makeAd = (id: string, priority: number, startsAt: string, endsAt: string): Ad => ({
        id,
        title: id,
        imageDesktop: "/d.jpg",
        imageMobile: "/m.jpg",
        alt: id,
        linkUrl: "/events",
        startsAt,
        endsAt,
        priority,
      });

      const ads: Ad[] = [
        makeAd("future", 1, "2026-07-01T00:00:00.000Z", "2026-08-01T00:00:00.000Z"),
        makeAd("expired", 1, "2025-01-01T00:00:00.000Z", "2025-02-01T00:00:00.000Z"),
        makeAd("p3", 3, "2026-01-01T00:00:00.000Z", "2026-12-31T00:00:00.000Z"),
        makeAd("p1", 1, "2026-01-01T00:00:00.000Z", "2026-12-31T00:00:00.000Z"),
        makeAd("p2", 2, "2026-01-01T00:00:00.000Z", "2026-12-31T00:00:00.000Z"),
      ];

      const filtered = filterAndSortAds(ads, now, 2);
      expect(filtered.map((a) => a.id)).toEqual(["p1", "p2"]);
    });

    it("formatEventDateParts formats valid ISO dates in IST and returns safe placeholders for invalid dates", () => {
      const valid = formatEventDateParts("2026-11-15T13:30:00.000Z");
      expect(valid.day).toBe("15");
      expect(valid.year).toBe("2026");
      expect(valid.monthYear).toContain("2026");
      expect(valid.fullDate).toContain("2026");

      const invalid = formatEventDateParts("not-a-real-date");
      expect(invalid).toEqual({
        day: "--",
        monthYear: "[Month YYYY]",
        time: "[Time]",
        year: "[YYYY]",
        fullDate: "not-a-real-date",
      });
    });
  });

  describe("lib/validators", () => {
    it("normalizes and validates Indian mobile numbers across formats and edge cases", () => {
      expect(normalizePhone("   ")).toBe("");
      expect(normalizePhone(" +91   98765--43210 ")).toBe("+91 98765 43210");

      expect(isValidIndianPhone("9876543210")).toBe(true);
      expect(isValidIndianPhone("6123456789")).toBe(true);
      expect(isValidIndianPhone("+91 98765 43210")).toBe(true);
      expect(isValidIndianPhone("+91-9876543210")).toBe(true);

      // Invalid first digit (must be 6-9), wrong length, or non-digits
      expect(isValidIndianPhone("5876543210")).toBe(false);
      expect(isValidIndianPhone("987654321")).toBe(false);
      expect(isValidIndianPhone("98765432100")).toBe(false);
      expect(isValidIndianPhone("98765abcde")).toBe(false);
    });

    it("enforces boundary rules across enquiryFormSchema, notifyFormSchema, inlineNotifySchema, and footerNotifySchema", () => {
      // Name too short / too long, message too short / too long
      const badEnquiry = enquiryFormSchema.safeParse({
        name: "A",
        email: "not-an-email",
        phone: "12345",
        type: "film",
        message: "Too short",
        website: "",
        startedAt: 100,
      });
      expect(badEnquiry.success).toBe(false);
      if (!badEnquiry.success) {
        const mapped = mapZodFieldErrors(badEnquiry.error.issues, [
          "name",
          "email",
          "phone",
          "message",
        ]);
        expect(mapped.name).toBe(content.validation.nameRequired);
        expect(mapped.email).toBe(content.validation.emailInvalid);
        expect(mapped.phone).toBe(content.validation.phoneInvalid);
        expect(mapped.message).toBe(content.validation.messageShort);
      }

      const tooLongEnquiry = enquiryFormSchema.safeParse({
        name: "A".repeat(81),
        email: "ok@example.com",
        phone: "",
        type: "film",
        message: "M".repeat(1001),
        website: "",
        startedAt: 100,
      });
      expect(tooLongEnquiry.success).toBe(false);
      if (!tooLongEnquiry.success) {
        const mapped = mapZodFieldErrors(tooLongEnquiry.error.issues, ["name", "message"]);
        expect(mapped.name).toBe(content.validation.nameTooLong);
        expect(mapped.message).toBe(content.validation.messageTooLong);
      }

      // notifyFormSchema requires email OR phone, plus consent === true
      expect(
        notifyFormSchema.safeParse({ email: "", phone: "", consent: true }).success,
      ).toBe(false);
      expect(
        notifyFormSchema.safeParse({ email: "a@b.com", phone: "", consent: false }).success,
      ).toBe(false);
      expect(
        notifyFormSchema.safeParse({ email: "a@b.com", phone: "", consent: true }).success,
      ).toBe(true);
      expect(
        notifyFormSchema.safeParse({ email: "", phone: "9876543210", consent: true }).success,
      ).toBe(true);

      // inlineNotifySchema requires email OR phone without consent
      expect(inlineNotifySchema.safeParse({ email: "", phone: "" }).success).toBe(false);
      expect(inlineNotifySchema.safeParse({ email: "a@b.com", phone: "" }).success).toBe(true);

      // footerNotifySchema requires valid email
      expect(footerNotifySchema.safeParse({ email: "" }).success).toBe(false);
      expect(footerNotifySchema.safeParse({ email: "fan@cinevanta.in" }).success).toBe(true);
    });
  });

  describe("lib/tracking & lib/analytics", () => {
    it("handles ad impression deduplication even if sessionStorage throws and tracks ad clicks", () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(new Response(null, { status: 204 }));

      // Simulate private-browsing sessionStorage access error
      vi.spyOn(window.sessionStorage, "getItem").mockImplementation(() => {
        throw new Error("QuotaExceeded / SecurityError");
      });
      vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceeded / SecurityError");
      });

      expect(trackAdImpressionOnce("ad-private")).toBe(true);
      expect(trackAdImpressionOnce("ad-private")).toBe(false);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      trackAdClick("ad-private");
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("logs errors via reportError with and without context and runs analytics stubs safely", () => {
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      trackPageView("/work");
      trackEvent("cta_click", { page: "home" });

      const err = new Error("Test failure");
      reportError("UnitScope", err);
      expect(errSpy).toHaveBeenCalledWith("[UnitScope]", err);

      reportError("UnitScope", err, { status: 500 });
      expect(errSpy).toHaveBeenCalledWith("[UnitScope]", err, { status: 500 });
    });
  });

  describe("lib/site & lib/content single source of truth", () => {
    it("derives dynamic studio copy and route links from site and routes registries", () => {
      expect(site.shortMark).toBe("C*");
      expect(site.city).toContain(site.locality);
      expect(content.meta.titleTemplate).toContain(site.name);
      expect(content.hero.kicker).toContain(site.locality);
      expect(content.nav.links.map((l) => l.label)).toEqual([
        "Home",
        "About",
        "Services",
        "Work",
        "Events",
        "Contact",
      ]);
      expect(content.nav.links.find((l) => l.label === "Home")?.href).toBe(routes.home);
      expect(content.nav.links.find((l) => l.label === "About")?.href).toBe(routes.about);
      expect(content.nav.links.find((l) => l.label === "Services")?.href).toBe(routes.services);
      expect(content.footer.navLinks.some((l) => l.label === "About")).toBe(true);
      expect(themeColors.yellow).toBe("#FFC93C");
      expect(layoutConfig.rootScalePercent).toBe(90);
      expect(layoutConfig.containerMaxWidthPx).toBe(1318);
      expect(layoutConfig.containerMaxWidthCss).toBe("var(--container-max-width)");
    });
  });
});
