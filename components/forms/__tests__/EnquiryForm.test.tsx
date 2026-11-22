import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { EventsView } from "@/components/events/EventsView";
import { WorkGrid } from "@/components/work/WorkGrid";
import AboutPage from "@/app/about/page";
import NotFound from "@/app/not-found";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import * as api from "@/lib/api-client";
import { getMockEvents, getMockWork } from "@/lib/mocks";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("EnquiryForm & Phase 5 pages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows specific validation messages on submit and passes axe checks", async () => {
    const user = userEvent.setup();
    const { container } = render(<EnquiryForm initialType="advertising" />);

    expect(screen.getByLabelText("Enquiry type")).toHaveValue("advertising");

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByText("Enter your name (at least 2 characters).")).toBeInTheDocument();
    expect(screen.getByText("Enter an email like name@example.com.")).toBeInTheDocument();
    expect(
      screen.getByText("Write at least 10 characters so we know how to help."),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("blocks submission when hidden honeypot field is filled", async () => {
    const user = userEvent.setup();
    const postSpy = vi.spyOn(api, "postEnquiry").mockResolvedValue({ ok: true });

    render(<EnquiryForm />);

    await user.type(screen.getByLabelText("Name"), "Rohan Kapoor");
    await user.type(screen.getByLabelText("Email"), "rohan@example.com");
    await user.type(screen.getByLabelText("Message"), "Planning an ad shoot in Delhi next month.");
    fireEvent.change(screen.getByLabelText("Website"), {
      target: { value: "https://bot.example.com" },
    });

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /We could not send your enquiry/,
    );
    expect(postSpy).not.toHaveBeenCalled();
  });

  it("submits valid enquiry and renders personalized success card", async () => {
    const user = userEvent.setup();
    const postSpy = vi.spyOn(api, "postEnquiry").mockResolvedValue({ ok: true });

    render(<EnquiryForm />);

    await user.type(screen.getByLabelText("Name"), "Asha Verma");
    await user.type(screen.getByLabelText("Email"), "asha@example.com");
    await user.type(screen.getByLabelText(/Phone/), "+91 9876543210");
    await user.type(
      screen.getByLabelText("Message"),
      "Looking to produce a brand film and launch event.",
    );

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(
      await screen.findByText(
        "Thanks, Asha Verma. We received your enquiry and will reply by email or phone.",
      ),
    ).toBeInTheDocument();
    expect(postSpy).toHaveBeenCalledTimes(1);
  });

  it("preserves entered values and shows error banner on failed submit", async () => {
    const user = userEvent.setup();
    vi.spyOn(api, "postEnquiry").mockResolvedValue({
      ok: false,
      error: "Server error",
      fields: { email: "Please check your email address." },
    });

    render(<EnquiryForm />);

    await user.type(screen.getByLabelText("Name"), "Kabir Mehta");
    await user.type(screen.getByLabelText("Email"), "kabir@example.com");
    await user.type(screen.getByLabelText("Message"), "Corporate summit production enquiry.");

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByText("Please check your email address.")).toBeInTheDocument();
    expect(screen.getByText(/We could not send your enquiry/)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Kabir Mehta");
    expect(screen.getByLabelText("Message")).toHaveValue("Corporate summit production enquiry.");
  });

  it("switches /events tabs and filters /work categories cleanly", async () => {
    const user = userEvent.setup();
    const upcoming = getMockEvents("upcoming");
    const past = getMockEvents("past");

    const { container: eventsContainer } = render(
      <EventsView initialStatus="upcoming" upcomingEvents={upcoming} pastEvents={past} />,
    );

    expect(screen.getByText("[Event Name 1]")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Past" }));
    expect(screen.getByText("[Past Event Name 1]")).toBeInTheDocument();
    expect(await axe(eventsContainer)).toHaveNoViolations();

    const initialWork = getMockWork(undefined, 1, 9);
    const { container: workContainer } = render(
      <WorkGrid
        initialCategory="all"
        initialItems={initialWork.items}
        initialTotal={initialWork.total}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Film" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Film" })).toHaveAttribute("aria-pressed", "true");
    });
    expect(await axe(workContainer)).toHaveNoViolations();
  });

  it("renders About, Privacy, Terms, and 404 pages with zero axe violations", async () => {
    const aboutRes = render(<AboutPage />);
    expect(await axe(aboutRes.container)).toHaveNoViolations();
    aboutRes.unmount();

    const privacyRes = render(<PrivacyPage />);
    expect(await axe(privacyRes.container)).toHaveNoViolations();
    privacyRes.unmount();

    const termsRes = render(<TermsPage />);
    expect(await axe(termsRes.container)).toHaveNoViolations();
    termsRes.unmount();

    const notFoundRes = render(<NotFound />);
    expect(screen.getByText("Scene not found.")).toBeInTheDocument();
    expect(await axe(notFoundRes.container)).toHaveNoViolations();
  });
});

