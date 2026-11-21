import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { AdStrip } from "@/components/ads/AdStrip";
import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { getMockAds, getMockEvents } from "@/lib/mocks";

describe("Empty-state matrix (Spec section 15)", () => {
  const cases = [
    { name: "no ads, no events", hasAds: false, hasEvents: false },
    { name: "ads, no events", hasAds: true, hasEvents: false },
    { name: "no ads, events", hasAds: false, hasEvents: true },
    { name: "ads, events", hasAds: true, hasEvents: true },
  ] as const;

  for (const scenario of cases) {
    it(`renders cleanly and passes axe for (${scenario.name})`, async () => {
      const ads = scenario.hasAds ? getMockAds() : [];
      const upcoming = scenario.hasEvents ? getMockEvents("upcoming") : [];
      const past = scenario.hasEvents ? getMockEvents("past") : [];

      const { container } = render(
        <div>
          <AdStrip ads={ads} />
          <main id="main-content">
            <Hero showreel={null} />
            <EventsSection upcomingEvents={upcoming} pastEvents={past} />
          </main>
        </div>,
      );

      // Hero media always renders whether or not ads exist
      expect(screen.getByText("[SHOWREEL OR HERO STILL]")).toBeInTheDocument();

      if (scenario.hasAds) {
        expect(screen.getByRole("region", { name: "Featured events" })).toBeInTheDocument();
      } else {
        expect(screen.queryByRole("region", { name: "Featured events" })).not.toBeInTheDocument();
      }

      if (scenario.hasEvents) {
        expect(screen.getByText("[Event Name 1]")).toBeInTheDocument();
      } else {
        expect(
          screen.getByText(
            "No events announced right now. Leave your details and we will message you when the next one opens.",
          ),
        ).toBeInTheDocument();
      }

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  }
});

