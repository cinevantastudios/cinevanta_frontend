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
  type WorkResponse,
} from "@/types/api";
import { getMockAds, getMockEvents, getMockWork, waitMockLatency } from "@/lib/mocks";
import { filterAndSortAds } from "@/lib/utils";

const DEFAULT_API_BASE_URL = "http://localhost:8000";

export function isMockMode(): boolean {
  return (process.env.NEXT_PUBLIC_USE_MOCKS ?? "true").toLowerCase() !== "false";
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
  return raw.replace(/\/+$/, "");
}

export async function getAds(): Promise<Ad[]> {
  if (isMockMode()) {
    return filterAndSortAds(getMockAds());
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/ads`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    const parsed = adListSchema.safeParse(data);
    if (!parsed.success) {
      return [];
    }

    return filterAndSortAds(parsed.data);
  } catch {
    return [];
  }
}

export async function getEvents(status?: EventStatus): Promise<EventItem[]> {
  if (isMockMode()) {
    return getMockEvents(status);
  }

  try {
    const params = new URLSearchParams();
    if (status) {
      params.set("status", status);
    }
    const query = params.toString();
    const url = `${getApiBaseUrl()}/api/events${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    const parsed = eventListSchema.safeParse(data);
    if (!parsed.success) {
      return [];
    }

    return parsed.data;
  } catch {
    return [];
  }
}

export async function getWork(
  category?: WorkCategory,
  page = 1,
  pageSize = 9,
): Promise<WorkResponse> {
  if (isMockMode()) {
    return getMockWork(category, page, pageSize);
  }

  try {
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    params.set("page", String(Math.max(1, page)));
    params.set("pageSize", String(Math.max(1, pageSize)));

    const response = await fetch(`${getApiBaseUrl()}/api/work?${params.toString()}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return { items: [], total: 0 };
    }

    const data: unknown = await response.json();
    const parsed = workResponseSchema.safeParse(data);
    if (!parsed.success) {
      return { items: [], total: 0 };
    }

    return parsed.data;
  } catch {
    return { items: [], total: 0 };
  }
}

async function parseErrorResponse(response: Response): Promise<ApiMutationResult> {
  try {
    const data: unknown = await response.json();
    const parsed = apiErrorSchema.safeParse(data);
    if (parsed.success) {
      return {
        ok: false,
        error: parsed.data.error,
        fields: parsed.data.fields,
      };
    }
  } catch {
    // Fall through to generic message.
  }

  return {
    ok: false,
    error: `Request failed with status ${response.status}.`,
  };
}

export async function postEnquiry(payload: EnquiryPayload): Promise<ApiMutationResult> {
  if (payload.website.trim() !== "") {
    return { ok: false, error: "Submission rejected." };
  }

  if (isMockMode()) {
    await waitMockLatency(600);
    return { ok: true };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    return await parseErrorResponse(response);
  } catch {
    return {
      ok: false,
      error: "Network error. Check your connection and try again.",
    };
  }
}

export async function postSubscriber(payload: SubscriberPayload): Promise<ApiMutationResult> {
  if (isMockMode()) {
    await waitMockLatency(600);
    return { ok: true };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    return await parseErrorResponse(response);
  } catch {
    return {
      ok: false,
      error: "Network error. Check your connection and try again.",
    };
  }
}

export function trackAd(id: string, event: AdTrackEvent): void {
  if (isMockMode()) {
    return;
  }

  const url = `${getApiBaseUrl()}/api/ads/${encodeURIComponent(id)}/${event}`;

  if (event === "click" && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      navigator.sendBeacon(url);
      return;
    } catch {
      // Fallback to fetch below.
    }
  }

  if (typeof fetch === "function") {
    void fetch(url, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Tracking failures should never disrupt navigation or UI.
    });
  }
}

