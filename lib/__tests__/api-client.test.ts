import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchWorkPage,
  getAds,
  getApiBaseUrl,
  getEvents,
  getWork,
  isMockMode,
  postEnquiry,
  postSubscriber,
  trackAd,
} from "@/lib/api-client";
import { resetTrackingMemoryForTests, trackAdImpressionOnce } from "@/lib/tracking";

const originalEnv = { ...process.env };

describe("lib/api", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_USE_MOCKS = "true";
    process.env.NEXT_PUBLIC_MOCK_ADS = "3";
    process.env.NEXT_PUBLIC_MOCK_EVENTS = "some";
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000";
    resetTrackingMemoryForTests();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("returns 3 mock ads by default and 0 when NEXT_PUBLIC_MOCK_ADS=0", async () => {
    const ads = await getAds();
    expect(ads).toHaveLength(3);
    expect(ads[0]?.priority).toBeLessThanOrEqual(ads[1]?.priority ?? 0);

    process.env.NEXT_PUBLIC_MOCK_ADS = "0";
    const emptyAds = await getAds();
    expect(emptyAds).toEqual([]);
  });

  it("returns mock events by status and empty list when NEXT_PUBLIC_MOCK_EVENTS=none", async () => {
    const upcoming = await getEvents("upcoming");
    const past = await getEvents("past");
    expect(upcoming).toHaveLength(2);
    expect(past).toHaveLength(3);

    process.env.NEXT_PUBLIC_MOCK_EVENTS = "none";
    expect(await getEvents("upcoming")).toEqual([]);
    expect(await getEvents("past")).toEqual([]);
  });

  it("filters and paginates mock work items", async () => {
    const all = await getWork();
    expect(all.total).toBe(7);
    expect(all.items).toHaveLength(7);

    const films = await getWork("film");
    expect(films.total).toBe(2);
    expect(films.items.every((item) => item.category === "film")).toBe(true);
  });

  it("fetches from real API when NEXT_PUBLIC_USE_MOCKS=false and returns empty list on schema failure", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: "bad-item" }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const ads = await getAds();
    expect(ads).toEqual([]);
  });

  it("returns empty list when real API network request fails", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network down"));

    const events = await getEvents("upcoming");
    expect(events).toEqual([]);
  });

  it("rejects enquiry submissions when honeypot field is filled", async () => {
    const result = await postEnquiry({
      name: "Test Person",
      email: "test@example.com",
      phone: "",
      type: "film",
      message: "We would like to discuss a film shoot in Delhi.",
      website: "https://spam.example.com",
      startedAt: Date.now(),
    });

    expect(result.ok).toBe(false);
  });

  it("maps field errors from real API error payloads", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "Validation failed",
          fields: { email: "Enter a valid email." },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await postSubscriber({
      email: "invalid@example.com",
      source: "footer",
    });

    expect(result).toEqual({
      ok: false,
      error: "Validation failed",
      fields: { email: "Enter a valid email." },
    });
  });

  it("deduplicates ad impressions once per session", () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));

    expect(trackAdImpressionOnce("ad-1")).toBe(true);
    expect(trackAdImpressionOnce("ad-1")).toBe(false);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("falls back to safe pure-frontend defaults when optional backend env variables are omitted", () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    delete process.env.NEXT_PUBLIC_USE_MOCKS;

    expect(getApiBaseUrl()).toBe("");
    expect(isMockMode()).toBe(true);
  });

  it("rejects unsafe javascript: ad linkUrl payloads from the API", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: "xss-ad",
            title: "Bad Ad",
            imageDesktop: "/banner.jpg",
            imageMobile: "/banner-m.jpg",
            alt: "Bad Ad",
            linkUrl: "javascript:alert(1)",
            startsAt: "2024-01-01T00:00:00.000Z",
            endsAt: "2032-12-31T23:59:59.000Z",
            priority: 1,
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const ads = await getAds();
    expect(ads).toEqual([]);
  });

  it("returns an actionable rate-limited error on HTTP 429 without exposing status codes", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("Too Many Requests", { status: 429 }),
    );

    const result = await postSubscriber({
      email: "user@example.com",
      source: "footer",
    });

    expect(result).toEqual({
      ok: false,
      rateLimited: true,
      error: "You have sent several requests in a short time. Please wait a minute and try again.",
    });
  });

  it("distinguishes aborted work fetches from server failures", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    const controller = new AbortController();
    controller.abort();

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

    const result = await fetchWorkPage("film", 1, 9, controller.signal);
    expect(result).toEqual({ ok: false, aborted: true, error: "" });
  });

  it("handles HTTP 500 and invalid JSON gracefully across getAds, getEvents, getWork, postEnquiry, and trackAd", async () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("Server Error", { status: 500 }))
      .mockResolvedValueOnce(new Response("Server Error", { status: 500 }))
      .mockResolvedValueOnce(new Response("Server Error", { status: 500 }))
      .mockResolvedValueOnce(new Response("Non-JSON 502 Bad Gateway", { status: 502 }))
      .mockRejectedValueOnce(new Error("Offline"));

    expect(await getAds()).toEqual([]);
    expect(await getEvents("past")).toEqual([]);
    expect(await getWork("advertising", 2, 9)).toEqual({ items: [], total: 0 });

    const nonJsonMutation = await postEnquiry({
      name: "Test User",
      email: "user@example.com",
      phone: "9876543210",
      type: "advertising",
      message: "Checking non-JSON 502 error handling.",
      website: "",
      startedAt: Date.now(),
    });
    expect(nonJsonMutation).toEqual({
      ok: false,
      error: "We could not process your request right now. Please try again in a moment.",
    });

    const networkMutation = await postSubscriber({
      email: "user@example.com",
      source: "footer",
    });
    expect(networkMutation).toEqual({
      ok: false,
      error: "We could not reach the server. Check your internet connection and try again.",
    });
    expect(fetchSpy).toHaveBeenCalledTimes(5);

    // trackAd uses navigator.sendBeacon for click when available
    const beaconSpy = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      writable: true,
      value: beaconSpy,
    });
    trackAd("ad-99", "click");
    expect(beaconSpy).toHaveBeenCalledWith("http://localhost:8000/api/ads/ad-99/click");
  });

  it("throws when NEXT_PUBLIC_USE_MOCKS has an invalid boolean string", () => {
    process.env.NEXT_PUBLIC_USE_MOCKS = "maybe";
    expect(() => isMockMode()).toThrow('Invalid NEXT_PUBLIC_USE_MOCKS value: "maybe"');
  });
});

