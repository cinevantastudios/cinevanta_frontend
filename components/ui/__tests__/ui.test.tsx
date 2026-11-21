import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  EmptyState,
  Field,
  Input,
  Placeholder,
  Section,
  SectionHeading,
  Select,
  Skeleton,
  Sticker,
  Textarea,
  Toast,
  getFieldDescribedBy,
} from "@/components/ui";
import { StyleguideInteractive } from "@/app/styleguide/StyleguideShowcase";

describe("UI Kit components", () => {
  it("renders Button as <button> or <a> with arrow circle and loading state", () => {
    const { rerender } = render(
      <Button variant="ink" withArrow>
        See our work
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "See our work" });
    expect(btn).toBeEnabled();

    rerender(
      <Button variant="yellow" href="/events" withArrow>
        Upcoming events
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Upcoming events" });
    expect(link).toHaveAttribute("href", "/events");

    rerender(
      <Button variant="outline" href="https://example.com" target="_blank">
        External
      </Button>,
    );
    const external = screen.getByRole("link", { name: "External" });
    expect(external).toHaveAttribute("rel", "noopener noreferrer");

    rerender(
      <Button variant="ink" loading>
        Sending...
      </Button>,
    );
    const loadingBtn = screen.getByRole("button", { name: "Sending..." });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute("aria-busy", "true");
  });

  it("renders Field with linked helper and error descriptions", () => {
    render(
      <Field
        id="email-field"
        label="Email"
        error="Enter an email like name@example.com."
      >
        <Input
          id="email-field"
          hasError
          aria-describedby={getFieldDescribedBy("email-field", { hasError: true })}
        />
      </Field>,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-field-error");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter an email like name@example.com.",
    );
  });

  it("opens Dialog from trigger, closes on ESC, and returns focus to trigger", async () => {
    const user = userEvent.setup();
    render(<StyleguideInteractive />);

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Registration opens soon")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("renders Toast with role=status and auto-dismisses after duration", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast open message="Done. We will be in touch." onClose={onClose} duration={4000} />);

    expect(screen.getByRole("status")).toHaveTextContent("Done. We will be in touch.");

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("passes axe accessibility checks across UI kit primitives", async () => {
    const { container } = render(
      <main>
        <Section>
          <SectionHeading title="What we do" sticker="Five ways to work with us" />
          <Sticker>Film studio, Delhi</Sticker>
          <Card tone="yellow">
            <h3>Film &amp; Content</h3>
            <p>Films, web series, documentaries, shorts and music videos.</p>
          </Card>
          <Placeholder label="[FILM POSTER OR STILL]" tone="sand" ratio="4/5" />
          <Skeleton className="h-10 w-32" />
          <EmptyState
            message="Projects will appear here soon."
            action={<Button variant="ink">See all work</Button>}
          />
          <Field id="a11y-select" label="Enquiry type">
            <Select
              id="a11y-select"
              defaultValue="film"
              options={[{ value: "film", label: "Film" }]}
            />
          </Field>
          <Field id="a11y-msg" label="Message">
            <Textarea id="a11y-msg" defaultValue="Hello studio" />
          </Field>
          <Checkbox id="a11y-check" label="I agree to be contacted about Cinevanta events" />
          <Dialog open={false} onOpenChange={() => undefined} title="Hidden dialog">
            <p>Content</p>
          </Dialog>
        </Section>
      </main>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

