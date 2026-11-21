import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAds, getEvents, getWork, postEnquiry, postSubscriber } from "@/lib/api";
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
});

