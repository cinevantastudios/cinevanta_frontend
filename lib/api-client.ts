import {
  PAGE_REVALIDATE_SECONDS,
  SITEMAP_REVALIDATE_SECONDS,
  buildNextCacheOptions,
  cacheTags,
} from "@/cache_logics/revalidation-cache";
import { reportError } from "@/lib/analytics";
import { getEnvApiBaseUrl, getEnvUseMocks } from "@/lib/env";
import { displayLimits } from "@/lib/site";
import { filterAndSortAds } from "@/lib/utils";
import {
  adListSchema,
  apiErrorSchema,
  eventListSchema,
  workResponseSchema,
  type Ad,
  type AdTrackEvent,
  type ApiMutationResult,
  type EnquiryPayload,
  type EventItem,
  type EventStatus,
  type SubscriberPayload,
  type WorkCategory,
  type WorkFetchResult,
  type WorkResponse,
} from "@/types/api";

/**
 * Single registry of all backend API endpoint paths and builders.
 * Add or update any backend route path right here in `lib/api-client.ts`.
 */
export const apiEndpoints = {
  ads: "/api/ads",
  events: "/api/events",
  work: "/api/work",
  enquiries: "/api/enquiries",
  subscribers: "/api/subscribers",
  adTrack: (id: string, event: AdTrackEvent) =>
    `/api/ads/${encodeURIComponent(id)}/${event}`,
} as const;

/**
 * Centralized API timeouts, mock latency, and cache revalidation intervals.
 */
export const networkConfig = {
  readTimeoutMs: 4000,
  mutationTimeoutMs: 10000,
  mockLatencyMs: 600,
  revalidateSeconds: PAGE_REVALIDATE_SECONDS,
  sitemapRevalidateSeconds: SITEMAP_REVALIDATE_SECONDS,
} as const;

/**
 * Determines whether the frontend should serve local mock data instead of calling the backend.
 * Delegates environment validation to `getEnvUseMocks()` in `lib/env.ts`.
 */
export function isMockMode(): boolean {
  return getEnvUseMocks();
}

/**
 * Reads and normalizes the backend API base URL via `getEnvApiBaseUrl()` in `lib/env.ts`.
 */
export function getApiBaseUrl(): string {
  return getEnvApiBaseUrl();
}

/**
 * Wraps fetch with a strict timeout and optional external AbortSignal for request cancellation.
 * Prevents slow or hanging upstream connections from blocking SSR concurrency pools.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

/**
 * Fetches active banner advertisements.
 * Uses `buildNextCacheOptions` from `cache_logics/revalidation-cache` for Data Cache revalidation.
 */
export async function getAds(): Promise<Ad[]> {
  if (isMockMode()) {
    const { getMockAds } = await import("@/lib/mocks");
    return filterAndSortAds(getMockAds());
  }

  try {
    const response = await fetchWithTimeout(
      `${getApiBaseUrl()}${apiEndpoints.ads}`,
      {
        next: buildNextCacheOptions([cacheTags.ads()]),
        headers: { Accept: "application/json" },
      },
      networkConfig.readTimeoutMs,
    );

    if (!response.ok) {
      reportError("api-client", new Error("Failed to fetch ads"), { status: response.status });
      return [];
    }

    const data: unknown = await response.json();
    const parsed = adListSchema.safeParse(data);
    if (!parsed.success) {
      reportError("api-client", new Error("Invalid ads response shape"), parsed.error.flatten());
      return [];
    }

    return filterAndSortAds(parsed.data);
  } catch (error) {
    reportError("api-client", error, { operation: "getAds" });
    return [];
  }
}

/**
 * Fetches studio events, optionally filtered by status.
 * Uses `buildNextCacheOptions` from `cache_logics/revalidation-cache` for Data Cache revalidation.
 */
export async function getEvents(status?: EventStatus): Promise<EventItem[]> {
  if (isMockMode()) {
    const { getMockEvents } = await import("@/lib/mocks");
    return getMockEvents(status);
  }

  try {
    const params = new URLSearchParams();
    if (status) {
      params.set("status", status);
    }
    const query = params.toString();
    const url = `${getApiBaseUrl()}${apiEndpoints.events}${query ? `?${query}` : ""}`;

    const response = await fetchWithTimeout(
      url,
      {
        next: buildNextCacheOptions([cacheTags.events(status)]),
        headers: { Accept: "application/json" },
      },
      networkConfig.readTimeoutMs,
    );

    if (!response.ok) {
      reportError("api-client", new Error("Failed to fetch events"), {
        status: response.status,
        statusFilter: status,
      });
      return [];
    }

    const data: unknown = await response.json();
    const parsed = eventListSchema.safeParse(data);
    if (!parsed.success) {
      reportError("api-client", new Error("Invalid events response shape"), parsed.error.flatten());
      return [];
    }

    return parsed.data;
  } catch (error) {
    reportError("api-client", error, { operation: "getEvents", status });
    return [];
  }
}

/**
 * Fetches a paginated portfolio page with explicit ok/error/aborted status so interactive
 * client views (like WorkGrid) can cancel stale requests and offer a retry UI on failure.
 */
export async function fetchWorkPage(
  category?: WorkCategory,
  page = 1,
  pageSize: number = displayLimits.workPageSize,
  signal?: AbortSignal,
): Promise<WorkFetchResult> {
  if (isMockMode()) {
    const { getMockWork } = await import("@/lib/mocks");
    return { ok: true, data: getMockWork(category, page, pageSize) };
  }

  try {
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    params.set("page", String(Math.max(1, page)));
    params.set("pageSize", String(Math.max(1, pageSize)));

    const response = await fetchWithTimeout(
      `${getApiBaseUrl()}${apiEndpoints.work}?${params.toString()}`,
      {
        next: buildNextCacheOptions([cacheTags.work(category, page)]),
        headers: { Accept: "application/json" },
      },
      networkConfig.readTimeoutMs,
      signal,
    );

    if (!response.ok) {
      reportError("api-client", new Error("Failed to fetch work items"), {
        status: response.status,
        category,
        page,
      });
      return {
        ok: false,
        aborted: false,
        error: "We could not load projects right now. Please try again in a moment.",
      };
    }

    const data: unknown = await response.json();
    const parsed = workResponseSchema.safeParse(data);
    if (!parsed.success) {
      reportError("api-client", new Error("Invalid work response shape"), parsed.error.flatten());
      return {
        ok: false,
        aborted: false,
        error: "We could not load projects right now. Please try again in a moment.",
      };
    }

    return { ok: true, data: parsed.data };
  } catch (error) {
    if (signal?.aborted) {
      return { ok: false, aborted: true, error: "" };
    }
    reportError("api-client", error, { operation: "fetchWorkPage", category, page });
    return {
      ok: false,
      aborted: false,
      error: "We could not reach the server. Check your internet connection and try again.",
    };
  }
}

/**
 * Fetches paginated portfolio work items, returning an empty page on error so SSR never crashes.
 */
export async function getWork(
  category?: WorkCategory,
  page = 1,
  pageSize: number = displayLimits.workPageSize,
): Promise<WorkResponse> {
  const result = await fetchWorkPage(category, page, pageSize);
  if (!result.ok) {
    return { items: [], total: 0 };
  }
  return result.data;
}

/**
 * Extracts field validation messages from a failed API response while logging technical details
 * and returning a safe, actionable message to the user without exposing HTTP status codes.
 */
async function parseErrorResponse(response: Response): Promise<ApiMutationResult> {
  if (response.status === 429) {
    reportError("api-client", new Error("Rate limit exceeded"), { status: response.status });
    return {
      ok: false,
      rateLimited: true,
      error: "You have sent several requests in a short time. Please wait a minute and try again.",
    };
  }

  try {
    const data: unknown = await response.json();
    const parsed = apiErrorSchema.safeParse(data);
    if (parsed.success) {
      reportError("api-client", new Error("Mutation rejected by server"), {
        status: response.status,
        error: parsed.data.error,
        fields: parsed.data.fields,
      });
      return {
        ok: false,
        error: parsed.data.error,
        fields: parsed.data.fields,
      };
    }
  } catch (error) {
    reportError("api-client", error, {
      operation: "parseErrorResponse",
      status: response.status,
    });
  }

  reportError("api-client", new Error("Mutation failed"), { status: response.status });
  return {
    ok: false,
    error: "We could not process your request right now. Please try again in a moment.",
  };
}

/**
 * Shared JSON POST helper for public mutation endpoints with mock-mode simulation,
 * timeout enforcement, structured error logging, and actionable network failure feedback.
 */
async function postJsonMutation(
  endpoint: string,
  payload: unknown,
  operation: string,
): Promise<ApiMutationResult> {
  if (isMockMode()) {
    const { waitMockLatency } = await import("@/lib/mocks");
    await waitMockLatency(networkConfig.mockLatencyMs);
    return { ok: true };
  }

  try {
    const response = await fetchWithTimeout(
      `${getApiBaseUrl()}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
      networkConfig.mutationTimeoutMs,
    );

    if (response.ok) {
      return { ok: true };
    }

    return await parseErrorResponse(response);
  } catch (error) {
    reportError("api-client", error, { operation });
    return {
      ok: false,
      error: "We could not reach the server. Check your internet connection and try again.",
    };
  }
}

/**
 * Submits a project/contact enquiry to the backend (or simulates latency in mock mode).
 * Rejects bot submissions caught by the hidden honeypot field.
 */
export async function postEnquiry(payload: EnquiryPayload): Promise<ApiMutationResult> {
  if (payload.website.trim() !== "") {
    reportError("api-client", new Error("Blocked enquiry submission due to honeypot field"));
    return {
      ok: false,
      error: "We could not send your enquiry. Please refresh the page and try again.",
    };
  }

  return postJsonMutation(apiEndpoints.enquiries, payload, "postEnquiry");
}

/**
 * Submits an event/newsletter subscriber to the backend (or simulates latency in mock mode).
 */
export async function postSubscriber(payload: SubscriberPayload): Promise<ApiMutationResult> {
  return postJsonMutation(apiEndpoints.subscribers, payload, "postSubscriber");
}

/**
 * Fires a non-blocking ad impression or click tracking event.
 * Logs any failure via reportError without interrupting navigation or UI.
 */
export function trackAd(id: string, event: AdTrackEvent): void {
  if (isMockMode()) {
    return;
  }

  const url = `${getApiBaseUrl()}${apiEndpoints.adTrack(id, event)}`;

  if (
    event === "click" &&
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    try {
      navigator.sendBeacon(url);
      return;
    } catch (error) {
      reportError("api-client", error, { operation: "trackAd.sendBeacon", id, event });
    }
  }

  if (typeof fetch === "function") {
    void fetch(url, {
      method: "POST",
      keepalive: true,
    }).catch((error) => {
      reportError("api-client", error, { operation: "trackAd.fetch", id, event });
    });
  }
}
