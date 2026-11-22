import { z } from "zod";
import { content } from "@/lib/content";
import { enquiryTypeSchema, formConstraints } from "@/types/api";

/** Matches Indian 10-digit mobile numbers starting with 6–9, with optional +91 prefix. */
export const INDIAN_PHONE_REGEX = formConstraints.indianPhoneRegex;

/** Collapses repeated whitespace/hyphens in phone numbers before validation or submission. */
export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.replace(/[\s-]+/g, " ");
}

/** Validates an Indian mobile number after stripping spaces and hyphens. */
export function isValidIndianPhone(value: string): boolean {
  const compact = value.trim().replace(/[\s-]+/g, "");
  return INDIAN_PHONE_REGEX.test(compact);
}

/**
 * Extracts the first validation message per field from Zod issues for safe inline form display.
 */
export function mapZodFieldErrors<T extends string>(
  issues: readonly z.ZodIssue[],
  allowedFields: readonly T[],
): Partial<Record<T, string>> {
  const allowed = new Set<string>(allowedFields);
  const errors: Partial<Record<T, string>> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && allowed.has(key)) {
      const typedKey = key as T;
      if (!errors[typedKey]) {
        errors[typedKey] = issue.message;
      }
    }
  }

  return errors;
}

/** Validation schema for the contact page enquiry form, driven by `formConstraints`. */
export const enquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(formConstraints.nameMin, content.validation.nameRequired)
    .max(formConstraints.nameMax, content.validation.nameTooLong),
  email: z.string().trim().email(content.validation.emailInvalid),
  phone: z
    .string()
    .trim()
    .refine((val) => val === "" || isValidIndianPhone(val), {
      message: content.validation.phoneInvalid,
    }),
  type: enquiryTypeSchema,
  message: z
    .string()
    .trim()
    .min(formConstraints.messageMin, content.validation.messageShort)
    .max(formConstraints.messageMax, content.validation.messageTooLong),
  website: z.string(),
  startedAt: z.number(),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

/** Shared optional email + phone fields for event notification forms (at least one required via refine). */
const baseNotifyFields = {
  email: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: content.validation.emailInvalid,
    }),
  phone: z
    .string()
    .trim()
    .refine((val) => val === "" || isValidIndianPhone(val), {
      message: content.validation.phoneInvalid,
    }),
};

/** Attaches the shared "email or phone required" refinement to a notification form schema. */
function withRequiredContact<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.refine(
    (data) => {
      const record = data as { email?: string; phone?: string };
      return Boolean(record.email || record.phone);
    },
    {
      message: content.validation.contactRequired,
      path: ["email"],
    },
  );
}

/** Validation schema for the NotifyDialog form (requires email or phone plus consent checkbox). */
export const notifyFormSchema = withRequiredContact(
  z.object({
    ...baseNotifyFields,
    consent: z.boolean().refine((val) => val === true, {
      message: content.validation.consentRequired,
    }),
  }),
);

export type NotifyFormValues = z.infer<typeof notifyFormSchema>;

/** Validation schema for the inline EventsSection notification form (no consent checkbox). */
export const inlineNotifySchema = withRequiredContact(z.object(baseNotifyFields));

export type InlineNotifyValues = z.infer<typeof inlineNotifySchema>;

/** Validation schema for the compact footer email notification bar. */
export const footerNotifySchema = z.object({
  email: z.string().trim().email(content.validation.emailInvalid),
});

export type FooterNotifyValues = z.infer<typeof footerNotifySchema>;
