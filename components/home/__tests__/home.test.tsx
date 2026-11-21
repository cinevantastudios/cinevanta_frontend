import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { CtaBlock } from "@/components/home/CtaBlock";
import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Partners } from "@/components/home/Partners";
import { Services } from "@/components/home/Services";
import { WorkPreview } from "@/components/home/WorkPreview";
import { getMockEvents, getMockWork } from "@/lib/mocks";

describe("Home page sections", () => {
  it("renders Hero, Marquee, Services, WorkPreview, EventsSection, Partners, and CtaBlock with mock data and passes axe", async () => {
    const work = getMockWork(undefined, 1, 3);
    const upcoming = getMockEvents("upcoming");
    const past = getMockEvents("past");

    const { container } = render(
      <main id="main-content">
        <Hero showreel={null} />
        <Marquee />
        <Services />
        <WorkPreview items={work.items} />
        <EventsSection upcomingEvents={upcoming} pastEvents={past} />
        <Partners />
        <CtaBlock />
      </main>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Films,\s*brands &\s*live moments\./,
    );
    expect(screen.getByText("[SHOWREEL OR HERO STILL]")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Film & Content/ })).toHaveAttribute(
      "href",
      "/work?category=film",
    );
    expect(screen.getByRole("link", { name: /Corporate Events/ })).toHaveAttribute(
      "href",
      "/work?category=corporate",
    );
    expect(screen.getByText("[Event Name 1]")).toBeInTheDocument();
    expect(screen.getByText("Got a story, a brand or a stage?")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("opens WorkDialog when clicking a WorkFrame", async () => {
    const user = userEvent.setup();
    const work = getMockWork(undefined, 1, 3);
    render(<WorkPreview items={work.items} />);

    await user.click(screen.getByRole("button", { name: /\[Project Title 1\]/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("[Project description placeholder]")).toBeInTheDocument();
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

