"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Button,
  Checkbox,
  Field,
  Input,
  getFieldDescribedBy,
} from "@/components/ui";
import { postSubscriber } from "@/lib/api";
import { content } from "@/lib/content";
import {
  inlineNotifySchema,
  normalizePhone,
  notifyFormSchema,
} from "@/lib/validators";
import { cn } from "@/lib/utils";
import type { SubscriberSource } from "@/types/api";

export interface NotifyFormProps {
  eventId?: string;
  source: SubscriberSource;
  mode?: "dialog" | "inline";
  surface?: "light" | "ink";
  idPrefix?: string;
  onSuccess?: () => void;
  className?: string;
}

interface FieldErrors {
  email?: string;
  phone?: string;
  consent?: string;
}

export function NotifyForm({
  eventId,
  source,
  mode = "dialog",
  surface = "light",
  idPrefix = "notify",
  onSuccess,
  className,
}: NotifyFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const isInk = surface === "ink";
  const emailId = `${idPrefix}-email`;
  const phoneId = `${idPrefix}-phone`;
  const consentId = `${idPrefix}-consent`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const trimmedEmail = email.trim();
    const normalizedPhone = normalizePhone(phone);

    const parsed =
      mode === "dialog"
        ? notifyFormSchema.safeParse({
            email: trimmedEmail,
            phone: normalizedPhone,
            consent,
          })
        : inlineNotifySchema.safeParse({
            email: trimmedEmail,
            phone: normalizedPhone,
          });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" && !nextErrors.email) nextErrors.email = issue.message;
        if (key === "phone" && !nextErrors.phone) nextErrors.phone = issue.message;
        if (key === "consent" && !nextErrors.consent) nextErrors.consent = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const result = await postSubscriber({
      email: trimmedEmail || undefined,
      phone: normalizedPhone || undefined,
      eventId,
      source,
    });

    setSubmitting(false);

    if (!result.ok) {
      if (result.fields) {
        setErrors({
          email: result.fields.email,
          phone: result.fields.phone,
        });
      }
      setSubmitError(result.error || content.notify.errorMessage);
      return;
    }

    setSucceeded(true);
    onSuccess?.();
  }

  if (succeeded) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-start gap-3 rounded-card border-2 p-5",
          isInk
            ? "border-yellow bg-ink text-cream"
            : "border-ink bg-yellow text-ink",
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-[16px] font-semibold">{content.notify.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-4", className)}>
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          mode === "inline" && "sm:grid-cols-2",
        )}
      >
        <Field
          id={emailId}
          label={content.notify.emailLabel}
          error={errors.email}
          surface={surface}
        >
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={content.notify.emailPlaceholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            hasError={Boolean(errors.email)}
            aria-describedby={getFieldDescribedBy(emailId, {
              hasError: Boolean(errors.email),
            })}
          />
        </Field>

        <Field
          id={phoneId}
          label={content.notify.phoneLabel}
          error={errors.phone}
          surface={surface}
        >
          <Input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={content.notify.phonePlaceholder}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            hasError={Boolean(errors.phone)}
            aria-describedby={getFieldDescribedBy(phoneId, {
              hasError: Boolean(errors.phone),
            })}
          />
        </Field>
      </div>

      {mode === "dialog" ? (
        <Checkbox
          id={consentId}
          name="consent"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
          }}
          error={errors.consent}
          surface={surface}
          label={
            <span>
              {content.notify.consentLabel}.{" "}
              <Link
                href="/privacy"
                className="underline decoration-2 underline-offset-4 hover:opacity-80"
              >
                {content.footer.privacyLabel}
              </Link>
              .
            </span>
          }
        />
      ) : (
        <p className={cn("text-[14px]", isInk ? "text-muted-on-ink" : "text-muted")}>
          {content.notify.helperText}{" "}
          <Link
            href="/privacy"
            className="underline decoration-1 underline-offset-4 hover:opacity-80"
          >
            {content.footer.privacyLabel}
          </Link>
          .
        </p>
      )}

      {submitError ? (
        <p
          role="alert"
          aria-live="polite"
          className={cn(
            "flex items-start gap-2 rounded-input border-2 p-3 text-[14px] font-medium",
            isInk
              ? "border-yellow bg-ink text-yellow"
              : "border-ink bg-sand text-ink",
          )}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </p>
      ) : null}

      <div className="pt-1">
        <Button
          type="submit"
          variant={isInk ? "yellow" : "ink"}
          loading={submitting}
          fullWidth={mode === "dialog"}
        >
          {submitting ? content.notify.submittingLabel : content.notify.submitLabel}
        </Button>
      </div>
    </form>
  );
}

