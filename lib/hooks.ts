"use client";

import { useCallback, useEffect, useState } from "react";
import { postSubscriber } from "@/lib/api-client";
import { content } from "@/lib/content";
import type { SubscriberPayload } from "@/types/api";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe hook for tracking the user's `prefers-reduced-motion` OS preference.
 * Always returns `false` on SSR and initial hydration pass so server and client DOM structures
 * match (e.g., HeroMedia `<video>` vs poster and AdControls progress bar), then syncs on mount.
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    setReducedMotion(mediaQuery.matches);

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
}

/**
 * Hydration-safe hook that reports whether the browser tab is currently hidden.
 * Initializes to `false` for deterministic SSR hydration and syncs via `visibilitychange`.
 */
export function useDocumentHidden(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    function handleVisibilityChange() {
      setHidden(document.visibilityState === "hidden");
    }

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return hidden;
}

export interface SubscriberSubmitOutcome {
  ok: boolean;
  fields?: Record<string, string>;
  error?: string;
}

/**
 * Shared subscriber submission state hook used by NotifyForm and FooterNotifyForm.
 * Enforces a double-submit lock, surfaces field errors and plain-language failures,
 * and invokes `onSuccess` once saved.
 */
export function useSubscriberSubmission(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitSubscriber = useCallback(
    async (payload: SubscriberPayload): Promise<SubscriberSubmitOutcome> => {
      if (submitting) {
        return { ok: false };
      }

      setSubmitError(null);
      setSubmitting(true);

      const result = await postSubscriber(payload);

      setSubmitting(false);

      if (!result.ok) {
        const message = result.error || content.notify.errorMessage;
        setSubmitError(message);
        return { ok: false, fields: result.fields, error: message };
      }

      setSucceeded(true);
      onSuccess?.();
      return { ok: true };
    },
    [onSuccess, submitting],
  );

  return {
    submitting,
    succeeded,
    submitError,
    setSubmitError,
    submitSubscriber,
  };
}
