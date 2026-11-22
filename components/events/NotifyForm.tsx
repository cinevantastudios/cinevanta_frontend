"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Button,
  Checkbox,
  Field,
  Input,
  StatusBanner,
  getFieldDescribedBy,
} from "@/components/ui";
import { content } from "@/lib/content";
import { useSubscriberSubmission } from "@/lib/hooks";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  inlineNotifySchema,
  mapZodFieldErrors,
  normalizePhone,
  notifyFormSchema,
} from "@/lib/validators";
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

/**
 * Reusable event notification signup form rendered either inside NotifyDialog (with consent checkbox)
 * or inline inside EventsSection when no upcoming events are listed.
 */
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

  const { submitting, succeeded, submitError, setSubmitError, submitSubscriber } =
    useSubscriberSubmission(onSuccess);

  const isInk = surface === "ink";
  const emailId = `${idPrefix}-email`;
  const phoneId = `${idPrefix}-phone`;
  const consentId = `${idPrefix}-consent`;

  /** Validates inputs against dialog/inline Zod rules and submits via shared subscriber hook. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
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
      setErrors(mapZodFieldErrors(parsed.error.issues, ["email", "phone", "consent"]));
      return;
    }

    setErrors({});
    const outcome = await submitSubscriber({
      email: trimmedEmail || undefined,
      phone: normalizedPhone || undefined,
      eventId,
      source,
    });

    if (!outcome.ok && outcome.fields) {
      setErrors({
        email: outcome.fields.email,
        phone: outcome.fields.phone,
      });
    }
  }

  if (succeeded) {
    return (
      <StatusBanner
        variant="success"
        surface={surface}
        message={content.notify.successMessage}
        className={className}
      />
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
                href={routes.privacy}
                className="underline decoration-2 underline-offset-4 hover:opacity-80"
              >
                {content.footer.privacyLabel}
              </Link>
              .
            </span>
          }
        />
      ) : (
        <p className={cn("text-[0.875rem]", isInk ? "text-muted-on-ink" : "text-muted")}>
          {content.notify.helperText}{" "}
          <Link
            href={routes.privacy}
            className="underline decoration-1 underline-offset-4 hover:opacity-80"
          >
            {content.footer.privacyLabel}
          </Link>
          .
        </p>
      )}

      {submitError ? (
        <StatusBanner variant="error" surface={surface} message={submitError} />
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
