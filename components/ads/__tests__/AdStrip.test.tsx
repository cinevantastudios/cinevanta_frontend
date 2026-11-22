import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdStrip } from "@/components/ads/AdStrip";
import * as tracking from "@/lib/tracking";
import type { Ad } from "@/types/api";

function makeAd(id: string, priority: number, overrides: Partial<Ad> = {}): Ad {
  return {
    id,
    title: `[Event ${id}]`,
    imageDesktop: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22/%3E",
    imageMobile: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22/%3E",
    alt: `Banner for [Event ${id}]`,
    linkUrl: "/events",
    label: "Featured event",
    startsAt: "2024-01-01T00:00:00.000Z",
    endsAt: "2032-12-31T23:59:59.000Z",
    priority,
    ...overrides,
  };
}

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("AdStrip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
    tracking.resetTrackingMemoryForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders nothing when given zero ads", () => {
    const { container } = render(<AdStrip ads={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders no arrows, dots, or pause controls with a single ad", () => {
    render(<AdStrip ads={[makeAd("only", 1)]} />);
    expect(screen.getByRole("region", { name: "Featured events" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous slide" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pause" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Go to slide 1" })).not.toBeInTheDocument();
  });

  it("filters out expired and future ads on the client and sorts by priority", () => {
    const ads = [
      makeAd("expired", 1, {
        startsAt: "2020-01-01T00:00:00.000Z",
        endsAt: "2021-01-01T00:00:00.000Z",
      }),
      makeAd("second", 2),
      makeAd("first", 1),
    ];

    render(<AdStrip ads={ads} />);
    const slides = screen.getAllByRole("group", { hidden: true });
    expect(slides).toHaveLength(2);
    expect(slides[0]).toHaveAttribute("aria-label", "1 of 2");
    expect(slides[0]).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByAltText("Banner for [Event first]")).toBeInTheDocument();
  });

  it("advances via autoplay every 5.5s and loops infinitely", () => {
    const ads = [makeAd("one", 1), makeAd("two", 2)];
    render(<AdStrip ads={ads} />);

    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    act(() => {
      vi.advanceTimersByTime(5500);
    });
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    act(() => {
      vi.advanceTimersByTime(5500);
    });
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("pauses on hover, focus within, and Pause button press", () => {
    const ads = [makeAd("one", 1), makeAd("two", 2)];
    render(<AdStrip ads={ads} />);
    const region = screen.getByRole("region", { name: "Featured events" });

    // Hover pauses autoplay
    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Mouse leave resumes autoplay
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(5500);
    });
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Focus within pauses autoplay
    const nextBtn = screen.getByRole("button", { name: "Next slide" });
    fireEvent.focus(nextBtn);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    fireEvent.blur(nextBtn, { relatedTarget: null });

    // Explicit Pause persists until Play is pressed
    const pauseBtn = screen.getByRole("button", { name: "Pause" });
    fireEvent.click(pauseBtn);
    expect(screen.getByRole("button", { name: "Play" })).toHaveAttribute("aria-pressed", "true");

    act(() => {
      vi.advanceTimersByTime(11000);
    });
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Press Play resumes
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => {
      vi.advanceTimersByTime(5500);
    });
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("supports keyboard ArrowRight and ArrowLeft navigation", () => {
    const ads = [makeAd("one", 1), makeAd("two", 2), makeAd("three", 3)];
    render(<AdStrip ads={ads} />);
    const region = screen.getByRole("region", { name: "Featured events" });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(screen.getByRole("button", { name: "Go to slide 3" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("disables autoplay under prefers-reduced-motion", () => {
    mockMatchMedia(true);
    const ads = [makeAd("one", 1), makeAd("two", 2)];
    render(<AdStrip ads={ads} />);

    act(() => {
      vi.advanceTimersByTime(12000);
    });
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("tracks impression once after 1s visible and tracks click on slide link", () => {
    const impressionSpy = vi.spyOn(tracking, "trackAdImpressionOnce");
    const clickSpy = vi.spyOn(tracking, "trackAdClick");

    const ads = [makeAd("tracked-1", 1)];
    render(<AdStrip ads={ads} />);

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(impressionSpy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(impressionSpy).toHaveBeenCalledTimes(1);
    expect(impressionSpy).toHaveBeenCalledWith("tracked-1");

    const slideLink = screen.getByRole("link");
    fireEvent.click(slideLink);
    expect(clickSpy).toHaveBeenCalledWith("tracked-1");
  });

  it("falls back to yellow title block if banner image fails to load", () => {
    render(<AdStrip ads={[makeAd("broken", 1, { title: "[Fallback Event]" })]} />);
    const img = screen.getByAltText("Banner for [Event broken]");
    fireEvent.error(img);
    expect(screen.getByText("[Fallback Event]")).toBeInTheDocument();
  });

  it("passes axe accessibility checks", async () => {
    vi.useRealTimers();
    const { container } = render(<AdStrip ads={[makeAd("a11y-1", 1), makeAd("a11y-2", 2)]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports horizontal touch swipe gestures to change slides and ignores vertical scroll gestures", () => {
    const ads = [makeAd("one", 1), makeAd("two", 2)];
    const { container } = render(<AdStrip ads={ads} />);
    const track = container.querySelector(".will-change-transform")!;

    // Horizontal left swipe (> 40px) advances to slide 2
    fireEvent.touchStart(track, { touches: [{ clientX: 200, clientY: 50 }] });
    fireEvent.touchMove(track, { touches: [{ clientX: 130, clientY: 52 }] });
    fireEvent.touchEnd(track);
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Vertical swipe is ignored and stays on slide 2
    fireEvent.touchStart(track, { touches: [{ clientX: 200, clientY: 50 }] });
    fireEvent.touchMove(track, { touches: [{ clientX: 202, clientY: 140 }] });
    fireEvent.touchEnd(track);
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Horizontal right swipe returns to slide 1
    fireEvent.touchStart(track, { touches: [{ clientX: 100, clientY: 50 }] });
    fireEvent.touchMove(track, { touches: [{ clientX: 180, clientY: 52 }] });
    fireEvent.touchEnd(track);
    expect(screen.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("renders non-clickable slide container if an unsafe linkUrl reaches AdSlide", () => {
    render(
      <AdStrip
        ads={[makeAd("unsafe", 1, { linkUrl: "javascript:alert(1)" })]}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

