import { z } from "zod";

/** Centralized form field length and format constraints shared across schemas, copy, and UI counters. */
export const formConstraints = {
  nameMin: 2,
  nameMax: 80,
  messageMin: 10,
  messageMax: 1000,
  indianPhoneRegex: /^(?:\+91[\s-]?)?[6-9]\d{9}$/,
} as const;

/** Canonical list of studio production categories — single source of truth for work filters and enquiry types. */
export const WORK_CATEGORIES = [
  "film",
  "advertising",
  "live_event",
  "fashion",
  "corporate",
] as const;

/** Validates that a link URL is either an app-relative path ("/...") or an http(s) URL, blocking javascript: and protocol-relative "//" URLs. */
export const safeLinkUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => /^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value),
    { message: "Link URL must be a relative path or an http(s) URL." },
  );

export const adSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  imageDesktop: z.string().min(1),
  imageMobile: z.string().min(1),
  alt: z.string(),
  linkUrl: safeLinkUrlSchema,
  label: z.string().min(1).optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  priority: z.number(),
});

export const adListSchema = z.array(adSchema);

export type Ad = z.infer<typeof adSchema>;

export const adTrackEventSchema = z.enum(["impression", "click"]);
export type AdTrackEvent = z.infer<typeof adTrackEventSchema>;

export const eventStatusSchema = z.enum(["upcoming", "past"]);
export type EventStatus = z.infer<typeof eventStatusSchema>;

export const eventSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  venue: z.string().min(1),
  city: z.string().min(1),
  posterUrl: z.string().min(1).optional(),
  summary: z.string().optional(),
  status: eventStatusSchema,
});

export const eventListSchema = z.array(eventSchema);

export type EventItem = z.infer<typeof eventSchema>;

export const workCategorySchema = z.enum(WORK_CATEGORIES);

export type WorkCategory = z.infer<typeof workCategorySchema>;

export const workItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: workCategorySchema,
  year: z.number().int(),
  imageUrl: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
});

export type WorkItem = z.infer<typeof workItemSchema>;

export const workResponseSchema = z.object({
  items: z.array(workItemSchema),
  total: z.number().int().nonnegative(),
});

export type WorkResponse = z.infer<typeof workResponseSchema>;

export const ENQUIRY_TYPES = [...WORK_CATEGORIES, "other"] as const;

export const enquiryTypeSchema = z.enum(ENQUIRY_TYPES);

export type EnquiryType = z.infer<typeof enquiryTypeSchema>;

export const enquiryPayloadSchema = z.object({
  name: z.string().min(formConstraints.nameMin).max(formConstraints.nameMax),
  email: z.string().email(),
  phone: z.string().optional(),
  type: enquiryTypeSchema,
  message: z.string().min(formConstraints.messageMin).max(formConstraints.messageMax),
  website: z.string(),
  startedAt: z.number(),
});

export type EnquiryPayload = z.infer<typeof enquiryPayloadSchema>;

export const subscriberSourceSchema = z.enum(["events-section", "notify-dialog", "footer"]);
export type SubscriberSource = z.infer<typeof subscriberSourceSchema>;

export const subscriberPayloadSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    eventId: z.string().min(1).optional(),
    source: subscriberSourceSchema,
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Provide an email address or a phone number.",
  });

export type SubscriberPayload = z.infer<typeof subscriberPayloadSchema>;

export const apiErrorSchema = z.object({
  error: z.string(),
  fields: z.record(z.string(), z.string()).optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;

export type ApiMutationResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string>; rateLimited?: boolean };

/** Result wrapper for paginated work fetches so callers can distinguish errors/aborts from empty categories. */
export type WorkFetchResult =
  | { ok: true; data: WorkResponse }
  | { ok: false; aborted: boolean; error: string };
