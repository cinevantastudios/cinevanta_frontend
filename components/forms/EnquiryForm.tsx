"use client";

import { useEffect, useState } from "react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import {
  Button,
  Field,
  Input,
  Select,
  StatusBanner,
  Textarea,
  getFieldDescribedBy,
} from "@/components/ui";
import { postEnquiry } from "@/lib/api-client";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import {
  enquiryFormSchema,
  mapZodFieldErrors,
  normalizePhone,
  type EnquiryFormValues,
} from "@/lib/validators";
import { formConstraints, type EnquiryType } from "@/types/api";

export interface EnquiryFormProps {
  initialType?: EnquiryType;
}

const KNOWN_ENQUIRY_FIELDS = ["name", "email", "phone", "type", "message"] as const;

const enquiryResolver: Resolver<EnquiryFormValues> = async (values) => {
  const parsed = enquiryFormSchema.safeParse(values);
  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const mapped = mapZodFieldErrors(parsed.error.issues, KNOWN_ENQUIRY_FIELDS);
  const fieldErrors: FieldErrors<EnquiryFormValues> = {};
  for (const field of KNOWN_ENQUIRY_FIELDS) {
    const message = mapped[field];
    if (message) {
      fieldErrors[field] = { type: "validation", message };
    }
  }

  return { values: {}, errors: fieldErrors };
};

export function EnquiryForm({ initialType = "film" }: EnquiryFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: enquiryResolver,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: initialType,
      message: "",
      website: "",
      startedAt: 0,
    },
  });

  // Record form mount time for bot-timing checks.
  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);

  const messageValue = watch("message") ?? "";

  async function onSubmit(values: EnquiryFormValues) {
    setSubmitError(null);

    // Block automated submissions if hidden honeypot field is filled
    if (values.website.trim() !== "") {
      setSubmitError(content.contact.errorMessage(site.email));
      return;
    }

    const result = await postEnquiry({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: normalizePhone(values.phone) || undefined,
      type: values.type,
      message: values.message.trim(),
      website: values.website,
      startedAt: values.startedAt || Date.now(),
    });

    if (!result.ok) {
      if (result.fields) {
        for (const field of KNOWN_ENQUIRY_FIELDS) {
          const message = result.fields[field];
          if (message) {
            setError(field, { type: "server", message });
          }
        }
      }
      setSubmitError(
        result.rateLimited ? result.error : content.contact.errorMessage(site.email),
      );
      return;
    }

    setSubmittedName(values.name.trim());
  }

  if (submittedName) {
    return (
      <div className="space-y-5">
        <StatusBanner
          variant="success"
          title={content.contact.successTitle}
          message={content.contact.successMessage(submittedName)}
          className="p-7 md:p-9"
          action={
            <Button
              type="button"
              variant="ink"
              onClick={() => {
                setSubmittedName(null);
                reset({
                  name: "",
                  email: "",
                  phone: "",
                  type: initialType,
                  message: "",
                  website: "",
                  startedAt: Date.now(),
                });
              }}
            >
              {content.contact.sendAnotherLabel}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-card border-2 border-ink bg-white p-6 md:p-8"
    >
      {/* Hidden honeypot field (must stay empty) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="enquiry-website">Website</label>
        <input
          id="enquiry-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {/* Hidden startedAt timestamp */}
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

      <Field id="enquiry-name" label={content.contact.fields.name.label} error={errors.name?.message}>
        <Input
          id="enquiry-name"
          autoComplete="name"
          placeholder={content.contact.fields.name.placeholder}
          hasError={Boolean(errors.name)}
          aria-describedby={getFieldDescribedBy("enquiry-name", {
            hasError: Boolean(errors.name),
          })}
          {...register("name")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id="enquiry-email"
          label={content.contact.fields.email.label}
          error={errors.email?.message}
        >
          <Input
            id="enquiry-email"
            type="email"
            autoComplete="email"
            placeholder={content.contact.fields.email.placeholder}
            hasError={Boolean(errors.email)}
            aria-describedby={getFieldDescribedBy("enquiry-email", {
              hasError: Boolean(errors.email),
            })}
            {...register("email")}
          />
        </Field>

        <Field
          id="enquiry-phone"
          label={content.contact.fields.phone.label}
          optionalText={content.contact.fields.phone.optional}
          helperText={content.contact.fields.phone.helper}
          error={errors.phone?.message}
        >
          <Input
            id="enquiry-phone"
            type="tel"
            autoComplete="tel"
            placeholder={content.contact.fields.phone.placeholder}
            hasError={Boolean(errors.phone)}
            aria-describedby={getFieldDescribedBy("enquiry-phone", {
              hasHelper: !errors.phone,
              hasError: Boolean(errors.phone),
            })}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field id="enquiry-type" label={content.contact.fields.type.label} error={errors.type?.message}>
        <Select
          id="enquiry-type"
          options={content.contact.enquiryTypes}
          hasError={Boolean(errors.type)}
          aria-describedby={getFieldDescribedBy("enquiry-type", {
            hasError: Boolean(errors.type),
          })}
          {...register("type")}
        />
      </Field>

      <Field
        id="enquiry-message"
        label={content.contact.fields.message.label}
        counter={`${messageValue.length} / ${formConstraints.messageMax}`}
        error={errors.message?.message}
      >
        <Textarea
          id="enquiry-message"
          placeholder={content.contact.fields.message.placeholder}
          hasError={Boolean(errors.message)}
          aria-describedby={getFieldDescribedBy("enquiry-message", {
            hasError: Boolean(errors.message),
          })}
          {...register("message")}
        />
      </Field>

      {submitError ? <StatusBanner variant="error" message={submitError} /> : null}

      <div className="pt-1">
        <Button type="submit" variant="ink" withArrow loading={isSubmitting}>
          {isSubmitting ? content.contact.sendingLabel : content.contact.submitLabel}
        </Button>
      </div>
    </form>
  );
}

