# Frontend Production Engineering & Vibe-Coding Guide (`agent.md`)

> **CRITICAL PRODUCTION MANDATE:**
> **10,000 people at once will use this website — a small mistake can cost real dollars to the client, and everything must be production-grade.**
> Every architectural decision, component, state transition, and edge case must be built to withstand real high-concurrency traffic without breaking.

This guide defines the **general engineering principles and rules** for working in this repository. Never hardcode project constants inside documentation or duplicate values across files — keep the codebase dynamic and driven by single sources of truth.

---

## 1. Single Source of Truth & Dynamic Codebase (Never Duplicate Values)
- **Change Once, Reflect Everywhere:** Never hardcode the same value, string, color, route path, brand detail, or threshold in multiple places.
- **Centralized Registries & Modular Architecture:**
  - **Environment Getters (`lib/env.ts`):** Every `process.env.NEXT_PUBLIC_*` lookup must go through typed getters in `lib/env.ts` — no other module may read `process.env.NEXT_PUBLIC_*` directly.
  - **Cache Logic (`cache_logics/`):** All server-side ISR/Data Cache revalidation intervals, cache tag builders, `fetch` cache option builders (`cache_logics/revalidation-cache.ts`), and client-side session/memory caches (`cache_logics/ad-impression-cache.ts`) must live inside the dedicated `cache_logics/` folder.
  - **API Endpoints, Timeouts & Client Functions (`lib/api-client.ts`):** All backend API endpoint paths (`apiEndpoints`), network timeout settings (`networkConfig`), and fetch/mutation functions live together in one single file (`lib/api-client.ts`). When adding or modifying an API, do it in `lib/api-client.ts` (and its payload/response contract in `types/api.ts`).
  - **Brand, Location, Theme, Routes & UI Config (`lib/site.ts`):** Define studio identity, locale/timezone, contact metadata, canonical frontend route paths (`routes`), pagination/slice limits (`displayLimits`), UI interaction thresholds (`uiConfig`), responsive media presets (`mediaConfig`), and JS theme tokens (`themeColors`) in `lib/site.ts`.
  - **CSS Design Tokens (`app/globals.css`):** Define all visual tokens (colors, fonts, radii, z-index layers, easings, breakpoints, and typography rules) in the global stylesheet and reference them via CSS variables or semantic utility classes.
  - **User-Facing Copy (`lib/content.ts`):** Store all headings, button labels, form helpers, validation messages, legal copy, and recovery text in `lib/content.ts`, interpolating values from `site` and `formConstraints` rather than repeating literal strings.
  - **Data Contracts, Categories & Form Constraints (`types/api.ts` & `lib/validators.ts`):** Define canonical category tuples, field length/format limits (`formConstraints`), API schemas, and TypeScript types in `types/api.ts`, and form validation rules in `lib/validators.ts`.
  - **SEO & Metadata Factories (`lib/utils.ts` & `components/seo/JsonLd.tsx`):** Generate page metadata via `createPageMetadata(...)` and Schema.org structured data via `buildOrganizationJsonLd()` / `buildEventJsonLd(...)`.
- **Dynamic Composition:** Derive lists, navigation menus, filter options, and UI states programmatically from these single sources of truth instead of maintaining parallel arrays in individual components.

## 2. Thorough Code Comments & Self-Documenting Structure
- **Comment Almost Every Part of the Code:** Add clear, concise JSDoc and inline comments for modules, exported functions, components, hooks, state groups, effects, and non-trivial JSX sections explaining **what** the code does and **why**.
- **Keep Comments Synchronized:** Update comments immediately whenever the underlying logic changes.
- **Unique, Work-Specific Filenames:** Every non-framework file must have a unique, descriptive filename across the entire repository that reflects its exact responsibility so file lookups are never ambiguous.
- **Reuse Shared UI Primitives & Hooks First:** Compose existing primitives from `components/ui/` (including `<SafeImage />` with built-in error placeholders) and shared hooks in `lib/hooks.ts` before creating new markup, image wrappers, or form state machines.

## 3. Zero Defaults or Fallbacks for Environment & Configuration
- **No Silent Fallbacks:** Never provide default or fallback values for environment variables (`process.env.*`) or required configuration (never use `||` or `??` to supply a backup value in application or build config code).
- **Fail Fast on Misconfiguration:** Read all required environment variables through the strict environment helper (`lib/env.ts`). If anything is missing or invalid in the environment, let it throw immediately so misconfiguration is exposed right away rather than hidden behind a fallback.

## 4. Never Stop the Website — Log Errors Silently, Hide Technical Details
- **Zero On-Screen Crashes:** Once running, the website must never stop rendering or crash on screen when a network call fails, times out, returns invalid data, or throws an unexpected runtime error.
- **Always Log for Developers:** Catch errors at the boundary (API client, route error boundaries, root error boundary, and media/embed parsers) and route them through the centralized error reporter (`reportError` in `lib/analytics.ts`), which logs full diagnostics and serves as the single integration point for production error monitoring.
- **Never Expose Technical Details:** Never show stack traces, HTTP status codes, raw server error payloads, schema paths, or internal code details to the user.

## 5. Actionable User Notifications & Dedicated Recovery Pages
- **Tell the User What to Do Next:** Every notification, toast, validation error, or failure alert shown to the user must be written in plain, non-technical language and clearly explain **what to do next** (retry, check connection, wait before retrying on rate limits, fix a specific form field, return home, or contact support).
- **Keep Errors Distinct from Empty States:** Never replace already-loaded data with an empty-state message when a filter or pagination request fails; preserve current content on screen and offer a retry action.
- **Preserve User Input:** Never clear a user's form inputs when a submission fails.
- **Complete System Pages:** Maintain helpful, branded recovery pages for missing routes (`app/not-found.tsx`), route-level failures (`app/error.tsx`), root-level failures (`app/global-error.tsx` with self-contained styling and hard-navigation recovery), and loading states (`loading.tsx` skeletons).

## 6. High-Concurrency & Performance Standards (10,000 Concurrent Users)
- **Mandatory Fetch Timeouts:** Every network request must enforce a strict timeout via `AbortController` so a slow or stalled backend can never hang server workers or exhaust concurrency pools.
- **Data & Route Caching (ISR / Next.js Data Cache):**
  - Configure revalidation (`next: { revalidate }`) on server data fetches, static routes, and sitemaps so high-traffic bursts reuse cached upstream API data rather than hammering the backend on every request.
  - When a page accepts deep-linked query parameters (`searchParams`), validate them on the server to render the exact requested initial state on first paint (avoiding client-side tab/category flashes) while relying on the Next.js Data Cache to keep backend calls cached.
- **Lean Production Bundles:**
  - Keep Server Components as the default; only add `"use client"` to interactive leaf components.
  - Never statically import mock data or development-only modules into files bundled for the browser; load mock modules dynamically only when mock mode is active.
- **Hot-Path Efficiency:**
  - Cache expensive formatters (such as `Intl.DateTimeFormat`) at module scope rather than re-instantiating them on every render.
  - Guard high-frequency event listeners (`scroll`, `resize`, `touchmove`) with refs so React state only updates when a threshold actually changes.
  - Reserve aspect-ratio boxes for media and use proper priority/lazy-loading attributes to prevent layout shift (CLS).

## 7. Race Conditions, Hydration & State Safety
- **Cancel Superseded Requests:** Interactive filtering, tab switching, and pagination must cancel previous in-flight requests (`AbortController`) and track request sequence IDs so slow responses from earlier clicks never overwrite newer selections.
- **Deduplicate Appended Data:** When paginating ("Load more"), deduplicate items by unique ID before appending to state.
- **Double-Submit Protection:** Every form submission handler must guard against rapid duplicate submissions while a request is already in flight.
- **Deterministic SSR & Hydration:** Never call non-deterministic functions (`new Date()`, `Math.random()`) during initial client render if they affect rendered DOM output; pass deterministic server timestamps as props so SSR HTML and client hydration always match regardless of user device clock skew.
- **Defensive Parsing:** Validate all external API payloads against schemas and verify parsed dates (`!Number.isNaN(date.getTime())`) before formatting or generating metadata/sitemaps.

## 8. Security, Privacy & Abuse Prevention
- **Strict URL Allowlists:** Validate all dynamic link URLs at both the schema layer and the component layer to allow only safe app-relative paths or `http(s)://` URLs — blocking executable protocols (`javascript:`, `data:`) and protocol-relative (`//`) URLs. Always pair external links with `rel="noopener noreferrer"`.
- **Exact Hostname Validation for Embeds:** Validate third-party embed URLs against exact hostnames or subdomain suffixes (never substring `.includes(...)`), use privacy-enhanced embed domains, and defer mounting iframes until explicit user interaction.
- **XSS-Safe Structured Data & Headers:** Never use `dangerouslySetInnerHTML`; escape `<` characters in serialized JSON-LD and maintain strict security headers (CSP, HSTS, frame protection, `nosniff`, and referrer policy) in the Next.js config.
- **Anti-Spam & Rate-Limit Resilience:** Include bot honeypot protections on public forms and handle rate-limit responses (`HTTP 429`) with a clear cooldown message.

## 9. Accessibility, Content Integrity & Verification Gates
- **Universal Accessibility:** Maintain semantic landmarks, a single `<h1>` per page, keyboard reachability, focus trapping and restoration on modals/menus, visible focus rings on both light and dark surfaces, icon-paired form error messages linked via `aria-describedby`, minimum touch target sizing, polite live-region announcements, and full `prefers-reduced-motion` support.
- **Content Integrity & Empty-State Resilience:** Never invent fake business facts or placeholder copy outside the centralized content modules; use explicit bracketed placeholders where client data is still pending, and ensure every view renders cleanly across all combinations of empty and populated data.
- **Mandatory Testing for Every Feature & Edge Case:** Whenever you add or modify any functionality, component, hook, validator, or API method, you **must** write or update automated tests covering it — including happy paths, error/recovery states, accessibility (`jest-axe`), and edge cases (boundary inputs, race conditions, malformed data, timeouts, and security rejections).
- **Mandatory Definition of Done:** Every change must pass typechecking (`npm run typecheck`), linting (`npm run lint`), and the automated test + accessibility suite (`npm test`) with zero errors before completion.
