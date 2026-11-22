import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RegisterButton } from "@/components/events/RegisterButton";
import * as api from "@/lib/api-client";

vi.mock("next/navigation", () => ({
  usePathname: () => "/work",
}));

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value,
  });
  fireEvent.scroll(window);
}

describe("Global layout & registration flow", () => {
  beforeEach(() => {
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("hides Navbar on scroll down and shows it again on scroll up", () => {
    render(<Navbar nextEvent={{ id: "evt-1", title: "[Event Name 1]" }} />);
    const header = screen.getByRole("banner");

    expect(header).toHaveAttribute("data-hidden", "false");
    expect(header.className).toContain("border-b-[3px]");
    expect(header.className).toContain("border-ink");

    setScrollY(150);
    expect(header).toHaveAttribute("data-hidden", "true");

    setScrollY(100);
    expect(header).toHaveAttribute("data-hidden", "false");
    expect(header.className).toContain("border-b-[3px]");
    expect(header.className).toContain("border-ink");

    setScrollY(0);
    expect(header).toHaveAttribute("data-hidden", "false");
    expect(header.className).toContain("border-b-[3px]");
    expect(header.className).toContain("border-ink");
  });

  it("marks active route link and falls back to /events link when no upcoming event exists", () => {
    render(<Navbar nextEvent={null} />);

    const workLink = screen.getByRole("link", { name: "Work" });
    expect(workLink).toHaveAttribute("aria-current", "page");
    expect(workLink.className).not.toContain("underline");
    expect(workLink.className).not.toContain("shadow");
    expect(workLink.className).toContain("text-[15.5px]");

    const registerLink = screen.getByRole("link", { name: "Register" });
    expect(registerLink).toHaveAttribute("href", "/events");

    const homeLinks = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinks).toHaveLength(1);
    expect(homeLinks[0]).toHaveAttribute("href", "/");
    expect(homeLinks[0]?.className).not.toContain("text-ink/");

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/about");

    const servicesLink = screen.getByRole("link", { name: "Services" });
    expect(servicesLink).toHaveAttribute("href", "/services");
  });

  it("opens MobileMenu, locks body scroll, never hides Navbar, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Navbar nextEvent={{ id: "evt-1", title: "[Event Name 1]" }} />);

    const openBtn = screen.getByRole("button", { name: "Open menu" });
    await user.click(openBtn);

    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("dialog", { name: "Site navigation" })).toHaveAttribute(
      "aria-hidden",
      "false",
    );

    setScrollY(240);
    expect(screen.getByRole("banner")).toHaveAttribute("data-hidden", "false");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
    expect(openBtn).toHaveFocus();
  });

  it("opens NotifyDialog via RegisterButton, validates contact + consent, posts payload, and returns focus", async () => {
    const user = userEvent.setup();
    const postSpy = vi.spyOn(api, "postSubscriber").mockResolvedValue({ ok: true });

    render(
      <RegisterButton
        eventId="evt-upcoming-1"
        eventTitle="[Event Name 1]"
        label="Register"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Register" });
    await user.click(trigger);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Leave your details and we will message you when registration for [Event Name 1] opens.",
      ),
    ).toBeInTheDocument();

    // Submitting empty shows contact + consent errors
    await user.click(screen.getByRole("button", { name: "Notify me" }));
    expect(screen.getByText("Enter an email address or a phone number.")).toBeInTheDocument();
    expect(
      screen.getByText("Confirm that we can contact you about Cinevanta events."),
    ).toBeInTheDocument();
    expect(postSpy).not.toHaveBeenCalled();

    // Fill phone only + consent -> succeeds
    await user.type(screen.getByLabelText("Phone"), "9876543210");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Notify me" }));

    await waitFor(() => {
      expect(screen.getByText("Done. We will be in touch.")).toBeInTheDocument();
    });
    expect(postSpy).toHaveBeenCalledWith({
      email: undefined,
      phone: "9876543210",
      eventId: "evt-upcoming-1",
      source: "notify-dialog",
    });

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("submits Footer notify form with source=footer and passes axe checks for Navbar + Footer", async () => {
    const user = userEvent.setup();
    const postSpy = vi.spyOn(api, "postSubscriber").mockResolvedValue({ ok: true });

    const { container } = render(
      <div>
        <Navbar nextEvent={{ id: "evt-1", title: "[Event Name 1]" }} />
        <main id="main-content">
          <h1>Home</h1>
        </main>
        <Footer />
      </div>,
    );

    const emailInput = screen.getByLabelText("Email address");
    await user.type(emailInput, "fan@example.com");
    await user.click(screen.getByRole("button", { name: "Notify me" }));

    await waitFor(() => {
      expect(screen.getByText("Done. We will be in touch.")).toBeInTheDocument();
    });
    expect(postSpy).toHaveBeenCalledWith({
      email: "fan@example.com",
      source: "footer",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Footer with social icons, full-bleed legal divider, and unclipped giant wordmark", () => {
    const { container } = render(<Footer />);

    for (const platform of ["Instagram", "YouTube", "LinkedIn", "X"]) {
      const link = screen.getByRole("link", { name: platform });
      expect(link.querySelector("svg")).toBeInTheDocument();
    }

    const divider = container.querySelector("footer > div.border-t");
    expect(divider).toBeInTheDocument();

    const giantWordmarkWrapper = container.querySelector("footer > div[aria-hidden='true']");
    expect(giantWordmarkWrapper).toBeInTheDocument();
    expect(giantWordmarkWrapper).not.toHaveStyle({ height: "0.8em" });
  });
});

