"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { postSubscriber } from "@/lib/api";
import { content } from "@/lib/content";
import { footerNotifySchema } from "@/lib/validators";

export function FooterNotifyForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = footerNotifySchema.safeParse({ email });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? content.validation.emailInvalid);
      return;
    }

    setError(null);
    setSubmitting(true);

    const result = await postSubscriber({
      email: parsed.data.email,
      source: "footer",
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.fields?.email || result.error || content.notify.errorMessage);
      return;
    }

    setEmail("");
    setSucceeded(true);
  }

  if (succeeded) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-[14px] font-medium text-yellow"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{content.notify.successMessage}</span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
      <label htmlFor="footer-notify-email" className="block text-[14px] font-semibold text-cream">
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
              if (error) setError(null);
            }}
            hasError={Boolean(error)}
            aria-label={content.footer.notifyLabel}
            aria-describedby={error ? "footer-notify-error" : undefined}
          />
        </div>
        <Button type="submit" variant="yellow" loading={submitting} className="shrink-0">
          {submitting ? content.notify.submittingLabel : content.footer.notifyButton}
        </Button>
      </div>
      {error ? (
        <p
          id="footer-notify-error"
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 text-[14px] font-medium text-yellow"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </form>
  );
}

