"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, StatusBanner } from "@/components/ui";
import { content } from "@/lib/content";
import { useSubscriberSubmission } from "@/lib/hooks";
import { footerNotifySchema } from "@/lib/validators";

/**
 * Compact email signup bar rendered in the global footer.
 * Shares submission state, double-submit protection, and error handling with NotifyForm via useSubscriberSubmission.
 */
export function FooterNotifyForm() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { submitting, succeeded, submitError, setSubmitError, submitSubscriber } =
    useSubscriberSubmission(() => setEmail(""));

  const displayError = validationError ?? submitError;

  /** Validates the email address and submits a footer subscription request. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const parsed = footerNotifySchema.safeParse({ email });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? content.validation.emailInvalid);
      return;
    }

    setValidationError(null);
    const outcome = await submitSubscriber({
      email: parsed.data.email,
      source: "footer",
    });

    if (!outcome.ok && outcome.fields?.email) {
      setValidationError(outcome.fields.email);
    }
  }

  if (succeeded) {
    return (
      <StatusBanner
        variant="success"
        surface="ink"
        compact
        message={content.notify.successMessage}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
      <label htmlFor="footer-notify-email" className="block text-[0.875rem] font-semibold text-cream">
        {content.footer.notifyHeading}
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Input
            id="footer-notify-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={content.footer.notifyPlaceholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError(null);
              if (submitError) setSubmitError(null);
            }}
            hasError={Boolean(displayError)}
            aria-label={content.footer.notifyLabel}
            aria-describedby={displayError ? "footer-notify-error" : undefined}
          />
        </div>
        <Button type="submit" variant="yellow" loading={submitting} className="shrink-0">
          {submitting ? content.notify.submittingLabel : content.footer.notifyButton}
        </Button>
      </div>
      {displayError ? (
        <StatusBanner
          id="footer-notify-error"
          variant="error"
          surface="ink"
          compact
          message={displayError}
        />
      ) : null}
    </form>
  );
}
