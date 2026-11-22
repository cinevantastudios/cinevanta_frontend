import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import AboutLoading from "@/app/about/loading";
import AboutPage from "@/app/about/page";
import ContactLoading from "@/app/contact/loading";
import ContactPage from "@/app/contact/page";
import EventsLoading from "@/app/events/loading";
import EventsPage from "@/app/events/page";
import GlobalError from "@/app/global-error";
import RootLoading from "@/app/loading";
import manifest from "@/app/manifest";
import HomePage from "@/app/page";
import robots from "@/app/robots";
import ServicesLoading from "@/app/services/loading";
import ServicesPage from "@/app/services/page";
import sitemap from "@/app/sitemap";
import StyleguidePage from "@/app/styleguide/page";
import WorkLoading from "@/app/work/loading";
import WorkPage from "@/app/work/page";
import { JsonLd } from "@/components/seo/JsonLd";
import * as analytics from "@/lib/analytics";
import * as api from "@/lib/api-client";

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/",
  notFound: () => notFoundMock(),
}));

describe("App Router pages, loading boundaries, metadata routes & JSON-LD security", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    notFoundMock.mockClear();
  });

  it("escapes '<' in JsonLd to prevent script-tag breakout XSS", () => {
    const { container } = render(
      <JsonLd
        data={{
          "@context": "https://schema.org",
          name: "</script><script>alert('xss')</script>",
        }}
      />,
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script?.textContent).not.toContain("</script>");
    expect(script?.textContent).toContain("\\u003c/script>");
  });

  it("generates manifest, robots, and sitemap (gracefully handling malformed event dates)", async () => {
    const manifestData = manifest();
    expect(manifestData.name).toBe("Cinevanta Studios");
    expect(manifestData.start_url).toBe("/");

    const robotsData = robots();
    expect(robotsData.sitemap).toContain("/sitemap.xml");

    vi.spyOn(api, "getEvents").mockResolvedValueOnce([
      {
        id: "evt-bad-date",
        slug: "bad-date-event",
        title: "[Bad Date Event]",
        date: "not-an-iso-date",
        venue: "[Venue]",
        city: "Delhi",
        status: "upcoming",
      },
    ]);

    const sitemapEntries = await sitemap();
    expect(sitemapEntries.length).toBeGreaterThanOrEqual(8);
    for (const entry of sitemapEntries) {
      expect(entry.lastModified instanceof Date).toBe(true);
      expect(Number.isNaN((entry.lastModified as Date).getTime())).toBe(false);
    }
  });

  it("renders HomePage, EventsPage, WorkPage, and ContactPage with server searchParams", async () => {
    const homeJsx = await HomePage();
    const { unmount: unmountHome } = render(homeJsx);
    expect(screen.getByText(/What we do/i)).toBeInTheDocument();
    unmountHome();

    // EventsPage with status=past searchParam
    const eventsJsx = await EventsPage({
      searchParams: Promise.resolve({ status: "past" }),
    });
    const { unmount: unmountEvents } = render(eventsJsx);
    expect(screen.getByRole("tab", { name: "Past" })).toHaveAttribute("aria-selected", "true");
    unmountEvents();

    // WorkPage with category=film searchParam and fallback on invalid category
    const workJsx = await WorkPage({
      searchParams: Promise.resolve({ category: ["film"] }),
    });
    const { unmount: unmountWork } = render(workJsx);
    expect(screen.getByRole("button", { name: "Film" })).toHaveAttribute("aria-pressed", "true");
    unmountWork();

    // ContactPage with type=corporate searchParam
    const contactJsx = await ContactPage({
      searchParams: Promise.resolve({ type: "corporate" }),
    });
    const { unmount: unmountContact } = render(contactJsx);
    expect(screen.getByLabelText("Enquiry type")).toHaveValue("corporate");
    unmountContact();

    // AboutPage & ServicesPage render full themed sections with zero axe violations
    const { container: aboutContainer, unmount: unmountAbout } = render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
    expect(screen.getByText("From script to stage")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
    expect(await axe(aboutContainer)).toHaveNoViolations();
    unmountAbout();

    const { container: servicesContainer, unmount: unmountServices } = render(<ServicesPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Services" })).toBeInTheDocument();
    expect(screen.getByText("How a production runs")).toBeInTheDocument();
    expect(screen.getByText("Who we build with")).toBeInTheDocument();
    expect(await axe(servicesContainer)).toHaveNoViolations();
    unmountServices();
  });

  it("renders all route loading skeleton boundaries without accessibility violations", async () => {
    for (const LoadingComponent of [
      RootLoading,
      AboutLoading,
      ServicesLoading,
      EventsLoading,
      WorkLoading,
      ContactLoading,
    ]) {
      const { container, unmount } = render(<LoadingComponent />);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });

  it("renders StyleguidePage in development and calls notFound() in production", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const { unmount } = render(<StyleguidePage />);
    expect(screen.getByText(/Design tokens, typography, and UI primitives/i)).toBeInTheDocument();
    unmount();

    vi.stubEnv("NODE_ENV", "production");
    expect(() => StyleguidePage()).toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    vi.stubEnv("NODE_ENV", originalNodeEnv);
  });

  it("logs root errors in GlobalError and triggers reset", async () => {
    const user = userEvent.setup();
    const reportSpy = vi.spyOn(analytics, "reportError").mockImplementation(() => {});
    const resetFn = vi.fn();

    render(<GlobalError error={new Error("Root layout crash")} reset={resetFn} />, {
      container: document.documentElement,
    });

    expect(reportSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Root layout crash/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(resetFn).toHaveBeenCalledTimes(1);
  });
});
