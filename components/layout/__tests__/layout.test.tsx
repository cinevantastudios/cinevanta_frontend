import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RegisterButton } from "@/components/events/RegisterButton";
import * as api from "@/lib/api-client";
import { routes, site } from "@/lib/site";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Global layout & registration flow (one-page scroll fast-track version)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("renders static sticky Navbar with one-page scroll anchor links and border divider", () => {
    render(<Navbar nextEvent={{ id: "evt-1", title: "[Event Name 1]" }} />);
    const header = screen.getByRole("banner");

    expect(header).toHaveAttribute("data-hidden", "false");
    expect(header.className).toContain("border-b-[3px]");
    expect(header.className).toContain("border-ink");

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");
    expect(homeLink.className).toContain("text-[15.5px]");

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", routes.about);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", routes.services);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", routes.work);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", routes.contact);
    expect(screen.queryByRole("link", { name: "Events" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Register" })).not.toBeInTheDocument();
  });

  it("opens MobileMenu, locks body scroll, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Navbar nextEvent={{ id: "evt-1", title: "[Event Name 1]" }} />);

    const openBtn = screen.getByRole("button", { name: "Open menu" });
    await user.click(openBtn);

    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("dialog", { name: "Site navigation" })).toHaveAttribute(
      "aria-hidden",
      "false",
    );

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

  it("renders Footer with studio address, social icons, legal divider, and passes axe checks", async () => {
    const { container } = render(
      <div>
        <Navbar nextEvent={{ id: "evt-1", title: "[Event Name 1]" }} />
        <main id="main-content">
          <h1>Home</h1>
        </main>
        <Footer />
      </div>,
    );

    expect(screen.getByText(site.address)).toBeInTheDocument();

    for (const platform of ["Instagram", "YouTube", "LinkedIn", "X"]) {
      expect(screen.queryByRole("link", { name: platform })).not.toBeInTheDocument();
    }

    const divider = container.querySelector("footer > div.border-t");
    expect(divider).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Privacy" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Terms" })).not.toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
