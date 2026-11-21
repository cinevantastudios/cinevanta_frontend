# Cinevanta Studios — Frontend

Marketing website frontend for **Cinevanta Studios** (Delhi, India), built with Next.js (App Router), React, TypeScript (strict), Tailwind CSS v4, Framer Motion (`LazyMotion`), Radix UI Dialog, Zod, React Hook Form, and Vitest + Testing Library + `jest-axe`.

Everything runs out of the box on typed mock data and switches to the real backend API by changing one environment variable.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. In development, a design system showcase is available at [http://localhost:3000/styleguide](http://localhost:3000/styleguide) (automatically returns 404 in production).

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server with Turbopack Fast Refresh |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint across the repository |
| `npm run typecheck` | Run TypeScript strict type-checking (`tsc --noEmit`) |
| `npm test` | Run Vitest + Testing Library + `jest-axe` test suite |
| `npm run test:watch` | Run Vitest in watch mode |

## Environment variables

Copy `.env.example` to `.env.local` if you want to override defaults locally:

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | Base URL for the backend API (no trailing slash needed) |
| `NEXT_PUBLIC_USE_MOCKS` | `true` | `"true"` uses `lib/mocks.ts`; `"false"` calls the real API |
| `NEXT_PUBLIC_MOCK_ADS` | `3` | Mock ad count (`"0"` or `"3"`) for testing the ad-strip empty state |
| `NEXT_PUBLIC_MOCK_EVENTS` | `some` | Mock events toggle (`"none"` or `"some"`) for testing event empty states |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical site URL for metadata, OG tags, sitemap, and robots |
| `NEXT_PUBLIC_IMAGE_HOSTS` | *(empty)* | Comma-separated remote image hostnames allowed in `next/image` and CSP (e.g. `cdn.cinevanta.in`) |

### Testing the empty-state matrix

Set `NEXT_PUBLIC_USE_MOCKS=true` and toggle the four combinations:
- `(no ads, no events)`: `NEXT_PUBLIC_MOCK_ADS=0`, `NEXT_PUBLIC_MOCK_EVENTS=none`
- `(ads, no events)`: `NEXT_PUBLIC_MOCK_ADS=3`, `NEXT_PUBLIC_MOCK_EVENTS=none`
- `(no ads, events)`: `NEXT_PUBLIC_MOCK_ADS=0`, `NEXT_PUBLIC_MOCK_EVENTS=some`
- `(ads, events)`: `NEXT_PUBLIC_MOCK_ADS=3`, `NEXT_PUBLIC_MOCK_EVENTS=some`

## Switching from mocks to the real API

1. Set `NEXT_PUBLIC_USE_MOCKS=false` and point `NEXT_PUBLIC_API_BASE_URL` to your backend origin.
2. Add your media/CDN hostname(s) to `NEXT_PUBLIC_IMAGE_HOSTS`.
3. Ensure your backend implements the contract defined in `types/api.ts`:
   - `GET /api/ads` → `Ad[]`
   - `POST /api/ads/{id}/impression` & `POST /api/ads/{id}/click` → `204`
   - `GET /api/events?status=upcoming|past` → `EventItem[]`
   - `GET /api/work?category=&page=&pageSize=` → `{ items: WorkItem[], total: number }`
   - `POST /api/enquiries` → `201`
   - `POST /api/subscribers` → `201`
   - Error responses: `{ error: string, fields?: Record<string, string> }`

Public read endpoints use `next: { revalidate: 60 }`, validate every response with Zod, and fall back to empty lists rather than crashing public pages.

## Editing copy & studio details

All user-facing copy lives in two files:
- `lib/site.ts` — Studio name, contact details, showreel video/poster, social links (empty `href` entries are hidden automatically), and partners list (empty array hides the Partners strip).
- `lib/content.ts` — All page headings, descriptions, button labels, placeholders, and validation messages.

## Swapping `RegisterButton` when registration pages are built

Every "Register" CTA across the Navbar, MobileMenu, TicketCard, and `/events` EventCard renders `components/events/RegisterButton.tsx`.

Currently, `RegisterButton` opens `NotifyDialog` (or links to `/events` when no upcoming event exists in the Navbar). When dedicated event detail and registration pages are built:
1. Open `components/events/RegisterButton.tsx`.
2. Replace the `NotifyDialog` trigger with a `<Button href={...}>` pointing to `/events/${eventSlug}/register` (or `/events/${eventId}/register`).
3. No other components need changes.

## Assumptions made

1. **Tailwind CSS v4:** Configured via `@tailwindcss/postcss` and `@theme inline` in `app/globals.css` so all CSS variables from Section 4 map directly to Tailwind utilities.
2. **Remote image host allowlist:** Added `NEXT_PUBLIC_IMAGE_HOSTS` to configure both `next.config.ts` `images.remotePatterns` and CSP `img-src`/`media-src`.
3. **Dev vs. production CSP:** In development mode (`NODE_ENV !== "production"`), CSP allows `'unsafe-eval'` and `ws:`/`wss:` so Next.js Fast Refresh works cleanly without restarts; production builds keep strict CSP headers.
4. **Zero extra libraries:** Implemented `cn` (`lib/utils.ts`) and a typed `react-hook-form` Zod resolver (`components/forms/EnquiryForm.tsx`) directly instead of adding dependencies outside Section 3.
5. **Safe JSON-LD without `dangerouslySetInnerHTML`:** `components/seo/JsonLd.tsx` renders `<script type="application/ld+json">` as a React text child (escaping `<` as `\u003c`), complying with both Section 9.8 and Section 12.
6. **Footer navigation includes `/about`:** Included `About` in the footer links so `/about` is reachable globally while keeping the desktop navbar strictly to the four specified links (`Services`, `Work`, `Events`, `Contact`).
7. **IST timezone for event formatting:** Event day, month/year, and time formatters use `Asia/Kolkata` (`en-IN`) for Cinevanta Studios in Delhi.
8. **Error indicator without box-shadow:** Field error states render a dedicated 4px yellow vertical bar beside the 2px ink border to satisfy the "no box-shadows anywhere" rule.

