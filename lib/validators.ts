import { z } from "zod";
import { content } from "@/lib/content";
import { enquiryTypeSchema } from "@/types/api";

export const INDIAN_PHONE_REGEX = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.replace(/[\s-]+/g, " ");
}

export function isValidIndianPhone(value: string): boolean {
  const compact = value.trim().replace(/[\s-]+/g, "");
  return INDIAN_PHONE_REGEX.test(compact);
}

export const enquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, content.validation.nameRequired)
    .max(80, content.validation.nameTooLong),
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
    .min(10, content.validation.messageShort)
    .max(1000, content.validation.messageTooLong),
  website: z.string(),
  startedAt: z.number(),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

export const notifyFormSchema = z
  .object({
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
    consent: z.boolean().refine((val) => val === true, {
      message: content.validation.consentRequired,
    }),
  })
  .refine((data) => data.email !== "" || data.phone !== "", {
    message: content.validation.contactRequired,
    path: ["email"],
  });

export type NotifyFormValues = z.infer<typeof notifyFormSchema>;

export const inlineNotifySchema = z
  .object({
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
  })
  .refine((data) => data.email !== "" || data.phone !== "", {
    message: content.validation.contactRequired,
    path: ["email"],
  });

export type InlineNotifyValues = z.infer<typeof inlineNotifySchema>;

export const footerNotifySchema = z.object({
  email: z.string().trim().email(content.validation.emailInvalid),
});

export type FooterNotifyValues = z.infer<typeof footerNotifySchema>;

