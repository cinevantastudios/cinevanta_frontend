import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { CtaBlock } from "@/components/home/CtaBlock";
import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { WorkPreview } from "@/components/home/WorkPreview";
import { getMockEvents, getMockWork } from "@/lib/mocks";
import { routes } from "@/lib/site";

describe("Home page sections (one-page scroll fast-track version)", () => {
  it("renders Hero, Services, WorkPreview, EventsSection, and CtaBlock with mock data and passes axe", async () => {
    const work = getMockWork(undefined, 1, 3);
    const upcoming = getMockEvents("upcoming");
    const past = getMockEvents("past");

    const { container } = render(
      <main id="main-content">
        <Hero showreel={null} />
        <Services />
        <WorkPreview items={work.items} />
        <EventsSection upcomingEvents={upcoming} pastEvents={past} />
        <CtaBlock />
      </main>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Films,\s*brands &\s*live moments\./,
    );
    expect(screen.getByText("[SHOWREEL OR HERO STILL]")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Film & Content/ })).toHaveAttribute(
      "href",
      routes.contact,
    );
    expect(screen.getByRole("link", { name: /Corporate Events/ })).toHaveAttribute(
      "href",
      routes.contact,
    );
    expect(screen.getByText("[Event Name 1]")).toBeInTheDocument();
    expect(screen.getByText("Got a story, a brand or a stage?")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("links featured work cards directly to their verified video or contact route", () => {
    const work = getMockWork(undefined, 1, 3);
    render(<WorkPreview items={work.items} />);

    const firstCard = screen.getByRole("link", { name: /Kutumb: The Family/ });
    expect(firstCard).toHaveAttribute("href", "https://www.youtube.com/watch?v=PUoXll37KB4");
  });

  it("renders empty states for zero work items and zero upcoming/past events", () => {
    render(
      <div>
        <WorkPreview items={[]} />
        <EventsSection upcomingEvents={[]} pastEvents={[]} />
      </div>,
    );

    expect(screen.getByText("Projects will appear here soon.")).toBeInTheDocument();
    expect(screen.getByText("[FILM POSTER OR STILL]")).toBeInTheDocument();
    expect(
      screen.getByText(
        "No events announced right now. Leave your details and we will message you when the next one opens.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Past events will be listed here.")).toBeInTheDocument();
  });
});
