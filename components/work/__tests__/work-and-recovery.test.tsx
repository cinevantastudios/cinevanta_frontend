import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";
import { NotifyForm } from "@/components/events/NotifyForm";
import { HeroMedia } from "@/components/home/HeroMedia";
import { SafeImage } from "@/components/ui";
import { WorkDialog, toPrivacyEmbedUrl } from "@/components/work/WorkDialog";
import { WorkGrid } from "@/components/work/WorkGrid";
import * as analytics from "@/lib/analytics";
import * as api from "@/lib/api-client";
import type { WorkItem } from "@/types/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

function makeWorkItem(id: string, overrides: Partial<WorkItem> = {}): WorkItem {
  return {
    id,
    title: `Project ${id}`,
    category: "film",
    year: 2026,
    imageUrl: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22/%3E",
    description: "Test project description.",
    ...overrides,
  };
}

describe("WorkDialog, SafeImage, WorkGrid resilience, HeroMedia & ErrorPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates embed hostnames strictly and blocks spoofed domains", () => {
    expect(toPrivacyEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    );
    expect(toPrivacyEmbedUrl("https://vimeo.com/12345678")).toBe(
      "https://player.vimeo.com/video/12345678?dnt=1&autoplay=1",
    );
    expect(toPrivacyEmbedUrl("https://evil-youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(toPrivacyEmbedUrl("javascript:alert(1)")).toBeNull();
  });

  it("mounts WorkDialog video iframe only after pressing Play and resets when switching items", async () => {
    const user = userEvent.setup();
    const itemWithVideo = makeWorkItem("vid-1", {
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
    });

    const { rerender } = render(<WorkDialog item={itemWithVideo} onClose={vi.fn()} />);

    expect(screen.queryByTitle("Project vid-1")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Play video" }));
    expect(screen.getByTitle("Project vid-1")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    );

    // Switching to another item resets playback via key={item.id}
    rerender(
      <WorkDialog
        item={makeWorkItem("vid-2", { videoUrl: "https://youtu.be/dQw4w9WgXcQ" })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByTitle("Project vid-2")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play video" })).toBeInTheDocument();
  });

  it("renders Placeholder fallback and logs error when SafeImage fails to load", () => {
    const reportSpy = vi.spyOn(analytics, "reportError").mockImplementation(() => {});

    render(
      <div className="relative h-40 w-40">
        <SafeImage
          src="https://example.com/missing.jpg"
          alt="Broken poster"
          fill
          fallbackLabel="[POSTER UNAVAILABLE]"
        />
      </div>,
    );

    const img = screen.getByAltText("Broken poster");
    fireEvent.error(img);

    expect(screen.getByText("[POSTER UNAVAILABLE]")).toBeInTheDocument();
    expect(reportSpy).toHaveBeenCalledTimes(1);
  });

  it("preserves existing WorkGrid items and shows retry banner when Load more fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(api, "fetchWorkPage").mockResolvedValueOnce({
      ok: false,
      aborted: false,
      error: "We could not reach the server. Check your internet connection and try again.",
    });

    render(
      <WorkGrid
        initialCategory="all"
        initialItems={[makeWorkItem("w-1")]}
        initialTotal={5}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not reach the server. Check your internet connection and try again.",
    );
    expect(screen.getByText("Project w-1")).toBeInTheDocument();
  });

  it("ignores stale earlier WorkGrid responses when user switches filters rapidly", async () => {
    const user = userEvent.setup();

    let resolveFirst!: (val: Awaited<ReturnType<typeof api.fetchWorkPage>>) => void;
    const firstPromise = new Promise<Awaited<ReturnType<typeof api.fetchWorkPage>>>((resolve) => {
      resolveFirst = resolve;
    });

    const spy = vi
      .spyOn(api, "fetchWorkPage")
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        ok: true,
        data: { items: [makeWorkItem("adv-1", { category: "advertising" })], total: 1 },
      });

    render(
      <WorkGrid
        initialCategory="all"
        initialItems={[makeWorkItem("all-1")]}
        initialTotal={1}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Film" }));
    await user.click(screen.getByRole("button", { name: "Advertising" }));

    await waitFor(() => {
      expect(screen.getByText("Project adv-1")).toBeInTheDocument();
    });

    // Resolve the slower first request after the second request already updated UI
    resolveFirst({
      ok: true,
      data: { items: [makeWorkItem("stale-film")], total: 1 },
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
    expect(screen.getByText("Project adv-1")).toBeInTheDocument();
    expect(screen.queryByText("Project stale-film")).not.toBeInTheDocument();
  });

  it("toggles HeroMedia mute button and renders video attributes properly", async () => {
    const user = userEvent.setup();
    render(
      <HeroMedia
        showreel={{
          videoUrl: "https://example.com/reel.mp4",
          posterUrl: "https://example.com/poster.jpg",
        }}
      />,
    );

    const muteBtn = screen.getByRole("button", { name: "Unmute video" });
    expect(muteBtn).toHaveAttribute("aria-pressed", "false");
    await user.click(muteBtn);
    expect(screen.getByRole("button", { name: "Mute video" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("logs route errors silently and exposes actionable recovery links on ErrorPage", async () => {
    const reportSpy = vi.spyOn(analytics, "reportError").mockImplementation(() => {});
    const resetFn = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <ErrorPage error={new Error("Secret DB crash")} reset={resetFn} />,
    );

    expect(reportSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Secret DB crash/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(resetFn).toHaveBeenCalledTimes(1);

    expect(await axe(container)).toHaveNoViolations();
  });

  it("deduplicates paginated WorkGrid items and recovers when retry button is clicked", async () => {
    const user = userEvent.setup();
    vi.spyOn(api, "fetchWorkPage")
      .mockResolvedValueOnce({
        ok: false,
        aborted: false,
        error: "Temporary failure loading more projects.",
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          items: [makeWorkItem("w-1"), makeWorkItem("w-2")],
          total: 2,
        },
      });

    render(
      <WorkGrid
        initialCategory="all"
        initialItems={[makeWorkItem("w-1")]}
        initialTotal={2}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Temporary failure loading more projects.",
    );

    // Click Try again on the alert banner -> succeeds and deduplicates w-1
    await user.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => {
      expect(screen.getByText("Project w-2")).toBeInTheDocument();
    });
    expect(screen.getAllByText("Project w-1")).toHaveLength(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("submits inline NotifyForm and maps server field errors on rejection", async () => {
    const user = userEvent.setup();
    const postSpy = vi
      .spyOn(api, "postSubscriber")
      .mockResolvedValueOnce({
        ok: false,
        error: "Please check your details.",
        fields: { email: "This email is already subscribed." },
      })
      .mockResolvedValueOnce({ ok: true });

    render(<NotifyForm source="events-section" mode="inline" surface="ink" />);

    await user.type(screen.getByLabelText("Email"), "fan@cinevanta.in");
    await user.click(screen.getByRole("button", { name: "Notify me" }));

    expect(await screen.findByText("This email is already subscribed.")).toBeInTheDocument();
    expect(postSpy).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Notify me" }));
    expect(await screen.findByText("Done. We will be in touch.")).toBeInTheDocument();
  });
});
