import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// Register jest-axe accessibility matchers for all component tests.
expect.extend(toHaveNoViolations);

// Provide a no-op IntersectionObserver in jsdom so Next.js <Link> prefetch observers
// do not fall back to out-of-band setTimeout updates that trigger noisy act() warnings.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class NoopIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    disconnect(): void {}
    observe(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve(): void {}
  }

  globalThis.IntersectionObserver = NoopIntersectionObserver;
}

// Provide explicit test environment variables because application code forbids env fallbacks.
process.env.NEXT_PUBLIC_USE_MOCKS ??= "true";
process.env.NEXT_PUBLIC_API_BASE_URL ??= "http://localhost:8000";
process.env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";
process.env.NEXT_PUBLIC_MOCK_ADS ??= "3";
process.env.NEXT_PUBLIC_MOCK_EVENTS ??= "some";
process.env.NEXT_PUBLIC_IMAGE_HOSTS ??= "";
