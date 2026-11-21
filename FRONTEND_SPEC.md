# Cinevanta Studios: Frontend Build Spec

## 0. How to use this file
Put this file in the repo root and tell the agent: "Read FRONTEND_SPEC.md fully. Start with Phase 0 in section 16. Do not ask questions unless you are blocked; make reasonable choices and list your assumptions in the README."

You are a senior frontend engineer with strong visual taste. Build the FRONTEND ONLY of a marketing website. The backend does not exist yet: everything must run today on mock data and switch to the real API by changing one environment variable. No screenshots are provided; this document is the full design source. Follow the numbers in it exactly. Where a value is not given, choose deliberately and keep it consistent.

## 1. Context and goals
- **Client:** Cinevanta Studios, a sole-proprietorship production house in Delhi, India. Business: film and audio-visual production (films, web series, OTT, documentaries, shorts, music videos), advertising films and TVCs, live entertainment and sports events (celebrity cricket matches, concerts, award shows, festivals), fashion shows and talent management, corporate events.
- **Visitors:** (a) brands and companies who might hire the studio; (b) people who will attend its events; (c) artists, sponsors and collaborators.
- **Primary conversions:** click on an event promo in the ad strip, leave details to be notified about events, send an enquiry.
- **Key product fact:** the "ads" on this site are the studio's OWN upcoming-event promos. There are no third-party advertisers. There is no advertiser page, no rates, no "Advertise with us".
- **Current state:** no events exist yet. The site must look excellent with zero events and zero ads, and must be effortless to fill later.
- **Tone:** confident, warm, a little playful, professional. The look is loud and colorful but clean. It must not look like a generic template or an AI-generated page.

## 2. Non-negotiables
1. Never invent facts. No fake statistics, testimonials, awards, client logos, past projects, team members or dates. Use bracketed placeholders: [Event Name], [Venue, City], [Project Title], [email]@[domain], [Phone].
2. All user-facing copy lives in `lib/content.ts` and `lib/site.ts` so it can be edited in one place.
3. Everything works without a backend (mock mode) and with one (real mode).
4. Strict TypeScript, no `any`, no unused code, no console errors or hydration warnings.
5. No dark patterns, no popups on page load, no autoplaying sound, no cookie banner (no cookies are set).
6. Responsive from the first line of code. A separate mobile design will come later, but every screen must already work and look intentional from 320px to 2560px.

## 3. Tech stack and architecture
- Next.js (latest stable, App Router), React, TypeScript (strict), Tailwind CSS, Framer Motion (motion only where section 10 says), `next/font/google`, `@radix-ui/react-dialog` (modals only), `lucide-react` (icons; custom inline SVG for arrows and the badge), `zod` + `react-hook-form` (forms), Vitest + Testing Library (tests). No other UI kit.
- Reason for Next.js: every page needs server-rendered metadata and Open Graph tags because links will be shared on WhatsApp.
- Server Components by default; `"use client"` only for interactive pieces (carousel, nav menu, forms, modal, marquee if needed).
- Data fetching: server-side `fetch` through one typed client, with `next: { revalidate: 60 }` for ads, events and work. The ad carousel receives its slides as props from the server.
- Folder structure:
```
app/
  layout.tsx, page.tsx, not-found.tsx, error.tsx, loading.tsx
  events/page.tsx, work/page.tsx, about/page.tsx, contact/page.tsx
  privacy/page.tsx, terms/page.tsx
  styleguide/page.tsx          (dev only: notFound() in production)
  opengraph-image.tsx, sitemap.ts, robots.ts, manifest.ts
components/
  ui/        Button, Sticker, SectionHeading, Container, Section, Card, Input, Select, Textarea, Field, Checkbox, Dialog, Toast, Skeleton, EmptyState, Placeholder
  layout/    Navbar, MobileMenu, Footer, Wordmark
  home/      Hero, RotatingBadge, HeroMedia, Marquee, Services, WorkPreview, EventsSection, TicketCard, Partners, CtaBlock
  ads/       AdStrip, AdSlide, AdControls
  events/    EventCard, PastEventRow, RegisterButton, NotifyDialog, NotifyForm
  work/      WorkGrid, WorkFrame, WorkFilters, WorkDialog
  forms/     EnquiryForm
lib/  api.ts, mocks.ts, content.ts, site.ts, tracking.ts, utils.ts, validators.ts
types/ api.ts
```
- Env variables (document all in `.env.example`):
  - `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000`)
  - `NEXT_PUBLIC_USE_MOCKS` (default `true`)
  - `NEXT_PUBLIC_MOCK_ADS` = `0` | `3` (default 3)
  - `NEXT_PUBLIC_MOCK_EVENTS` = `none` | `some` (default some)
  - `NEXT_PUBLIC_SITE_URL`
- `lib/api.ts` exposes `getAds()`, `getEvents(status)`, `getWork(category?, page?)`, `postEnquiry()`, `postSubscriber()`, `trackAd(id, "impression" | "click")`. It picks mocks or real fetch from env, validates responses with zod, and on any failure returns an empty list rather than throwing on public pages.
- Image hosts for remote images are configured through an env-driven `remotePatterns` list in `next.config`.
- Path alias `@/`. ESLint and Prettier configured. Scripts: dev, build, start, lint, typecheck, test.

## 4. Design language

### 4.1 Idea
A bold, warm, poster-like identity for a studio that makes films, ads and live events: flat color blocks, thick ink outlines, big heavy type, slightly tilted elements like pinned posters and tickets, and a rotating stamp. No gradients, no glassmorphism, no soft drop shadows, no stock-icon clutter. Spend the boldness in two places: the hero headline with its outlined words and rotating badge, and the ticket-style event card. Everything else stays disciplined.

### 4.2 Colors (CSS variables and Tailwind theme)
| Token | Hex | Use |
|---|---|---|
| cream | #FFF6E3 | page background |
| ink | #15110E | text, borders, dark sections |
| yellow | #FFC93C | primary accent, buttons, stickers, highlights |
| sand | #FFE7B0 | soft section background, card tint |
| white | #FFFFFF | cards |
| muted | #5C5249 | secondary text on cream, sand and white |
| muted-on-ink | #D8CEBD | secondary text on ink |
| faint | #A39787 | decorative text only (partner names), never for reading text |
| line-on-ink | #5A5148 | dividers on ink |

Rules: ink text on cream, yellow, sand and white. Cream text on ink. Never put yellow text on cream. No blue, no pink, no orange, no purple, no gradients. Focus ring: 3px ink outline with 2px cream offset; on ink backgrounds use a yellow ring. Placeholder image blocks use sand, yellow, white and ink tones with a small label.

### 4.3 Typography
- **Display:** Archivo (variable), width axis 125 (use `axes: ["wdth"]` in `next/font` and `font-stretch: 125%`), weight 800, UPPERCASE, letter-spacing -0.03em, line-height 0.92. Fallback stack: "Arial Black", Impact, sans-serif. Use for h1, h2, card titles, the wordmark, ticket date.
- **Body:** Inter, weights 400/500/600, 16px (18px for lead paragraphs), line-height 1.6, max line length 65ch.
- **Small meta:** DM Mono weight 500, 11 to 12px, uppercase, letter-spacing 0.08em. Use ONLY for dates, times, categories, years and the showreel timecode. Do not put a mono eyebrow above every heading.
- **Scale (desktop to mobile):** h1 clamp(44px, 7.5vw, 96px); h2 clamp(36px, 5vw, 68px); h3 and card titles 24px (22px mobile); ticket date 96px (64px mobile); body 16px; lead 18px; small 14px; wordmark clamp(72px, 12.4vw, 158px).
- Outlined text (hero): `color: transparent; -webkit-text-stroke: 2.5px var(--ink)`. Provide a solid-ink fallback via `@supports not (-webkit-text-stroke: 1px black)`.
- Buttons and link labels use plain sentence-case verbs ("See our work", "Notify me", "Send enquiry"). Do not append arrow characters to labels; arrows are icons inside buttons.

### 4.4 Shape, spacing, layout
- Radii: pill 999px; card 28px; large block 36px; media 32px; work frame 24px; input 14px.
- Borders: 2px ink on cards, frames, outline buttons, inputs; 1px for list dividers.
- No box-shadows anywhere (focus rings only). Modal backdrop: ink at 60% opacity.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 40, 56, 72, 104. Section vertical padding 104 (desktop), 72 (tablet), 56 (mobile).
- Container: max-width 1440px, horizontal padding 48 (desktop), 32 (tablet), 20 (mobile). Content-heavy text blocks max 65ch.
- Alignment: left-aligned by default. Center only the CTA block text on mobile and the partners strip.
- Rotations (static): sticker -4deg, work frames -2deg / 1.5deg / -1deg, ticket card -1.5deg, rotating badge base tilt 14deg. Rotations are removed at widths under 480px for the ticket and frames if they cause overflow.
- Z-index scale: ad strip 10, navbar 50, dialog 100, toast 110.
- Breakpoints: 480, 768, 1024, 1280, 1536.

## 5. Component library (build and show on /styleguide first)
- **Button:** pill, 14px/600 label. Variants: `ink` (ink background, cream text, 2px ink border), `yellow` (yellow background, ink text), `outline` (transparent, 2px ink border). Optional trailing icon rendered inside a 28px circle (ink variant: yellow circle with ink arrow; yellow variant: ink circle with yellow arrow). Padding 14px 14px 14px 24px with icon, 14px 24px without. Hover: icon circle nudges 3px right and the background shifts to the alternate variant color over 200ms. Min touch target 44px. Renders as `<a>` or `<button>`.
- **Sticker:** yellow pill, 2px ink border, ink text, padding 7px 16px, rotated -4deg, small label (DM Mono 11px). Max one per section heading.
- **SectionHeading:** h2 plus an optional Sticker on the same row (wraps under on mobile).
- **Card:** 2px ink border, radius 28px, padding 26px, min-height 270px, flex column with space-between. Props for background color variant.
- **Placeholder:** a block with a bracketed label such as [FILM POSTER OR STILL], used wherever an image is missing. It must look intentional, not broken. Props: ratio, tone (yellow, sand, white, ink), label.
- **Wordmark:** "Cinevanta*" in display type, asterisk in ink.
- **Inputs:** 2px ink border, radius 14px, 52px height, white background, label above (14px/600), helper and error text below (14px). Error state: ink border plus a 4px yellow left bar on the field and an error message with an icon; do not rely on color alone.
- **Dialog (Radix):** centered cream panel, 2px ink border, radius 28px, max-width 480px, focus trapped, ESC and backdrop close, returns focus to trigger. Mobile: bottom sheet style (full width, radius 28px top).
- **Toast:** ink pill at bottom center, cream text, 4s, `role="status"`.
- **Skeleton:** sand blocks with a slow 1.6s opacity pulse; disabled under reduced motion.
- **EmptyState:** an invitation to act, not a mood: one sentence on what is missing plus one action.
- **Marquee, RotatingBadge, TicketCard, WorkFrame:** specified in section 8.

## 6. Global layout

### Navbar
- Height 80px. Left: wordmark (24px). Center: links Services, Work, Events, Contact in 15px/500 Inter (not mono, not uppercase). Right: yellow Button "Register" that opens the NotifyDialog (see 9.1) with the next upcoming event, or links to /events if there is none.
- Sticky. Background cream with a 1px ink bottom border that appears after 8px of scroll. Hides on scroll down and returns on scroll up (translateY 200ms). Never hides while the mobile menu is open or the page is at the top.
- Services links to `/#services`, Work to `/work`, Events to `/events`, Contact to `/contact`. Active route gets a 2px ink underline with 6px offset.
- Mobile (below 768px): wordmark left, a 44px circular menu button right. The menu opens a full-screen yellow overlay with big display-type links stacked (h2 size), the Register button at the bottom, focus trapped, ESC closes, body scroll locked. Opening animation: overlay clip-path circle reveal from the button, 450ms; reduced motion: instant.

### Footer
- Ink background, cream text. Top row: wordmark and one line ("Films, advertising and live events from Delhi."), nav links, contact details placeholders ([email]@[domain], [Phone], "Delhi, India"), social links from `site.socials` (render only entries that have a URL; mock config contains `#` so the layout is visible), a small notify-me form (email) posting to the subscribers API with source "footer".
- Bottom: copyright line "© 2026 Cinevanta Studios" and links to Privacy and Terms.
- Below everything: the giant "Cinevanta" wordmark in display type, size clamp(72px, 12.4vw, 158px), cream outlined on ink (transparent fill, 1.5px cream stroke), cropped so about 18% of the glyph height is cut off by the page bottom (container `overflow: hidden`, fixed height 0.8em).

## 7. The ad strip (flagship feature)
A full-width, short-height carousel of the studio's own event promos, directly under the navbar, like the promo banners on ticketing sites. Rendered only when at least one active ad exists; otherwise render nothing and reserve no space.

**Data per slide:** `id`, `title`, `imageDesktop`, `imageMobile`, `alt`, `linkUrl`, `label` (default "Featured event"), `startsAt`, `endsAt`, `priority`. Filter out slides outside their date range on the client too. Sort by priority. Maximum 5 slides.

**Dimensions:** full viewport width (no container padding, no side margins, no radius). Desktop creative 1920x240 (aspect 8:1); mobile creative 750x300 (aspect 5:2) shown below 768px. Use CSS `aspect-ratio` so the height is reserved before the image loads (no layout shift), with `min-height: 96px` and `max-height: 260px`. Images use `object-fit: cover`; creatives assume the key content sits in the central 1200px. Use `<picture>` with a `<source media="(max-width: 767px)">` for the mobile image. The first slide: `fetchpriority="high"`, eager. Other slides: `loading="lazy"`, `decoding="async"`. If an image fails to load, show a solid yellow block with the slide title in display type.

**Slide visuals:** the whole slide is one link (`<a>`) with a 3px ink border on top and bottom of the strip. A small "label" Sticker sits at the top-left (12px from edges). No overlay on the creative.

**Controls:**
- Prev and next: 44px circular buttons (cream fill, 2px ink border) vertically centered at the left and right edges (16px inset). On pointer devices they appear on hover or focus-within (opacity 0 to 1, 150ms) and are always visible to keyboard users on focus. Hidden on touch devices (swipe and dots instead).
- Dots: bottom center, inside a small ink pill with 70% opacity. Inactive dot 8px cream; active dot is a 24px yellow pill. Each dot is a 24px-min tappable button with `aria-label="Go to slide N"`.
- Pause and play toggle: 32px circular button bottom-right, with `aria-label` "Pause" / "Play" (required by accessibility guidance for auto-rotating content).
- Progress: a 3px yellow bar along the bottom edge animating from 0 to 100% over the autoplay interval; frozen while paused.

**Behaviour:**
- Autoplay every 5.5s; transition is a horizontal slide (translateX, 600ms, cubic-bezier(0.22, 0.8, 0.2, 1)); loops infinitely.
- Pause autoplay on pointer hover, on focus within, when the browser tab is hidden, and when the strip is scrolled out of view (IntersectionObserver). Resume when conditions clear, unless the user pressed Pause (that choice persists until they press Play).
- Swipe on touch: threshold 40px or velocity above 0.3px/ms, with drag following the finger; vertical scrolling is never blocked (use `touch-action: pan-y`).
- Keyboard: when the strip has focus, Left and Right arrows change slides; Tab reaches controls in order: slide link, prev, next, pause, dots.
- `prefers-reduced-motion`: no autoplay, no slide animation (instant change), no progress bar animation.
- One slide only: no arrows, dots, pause button or progress bar, no animation.
- Zero ads or fetch error: render nothing.
- Preload the next slide's image when the current one becomes active.

**Accessibility:** container `role="region"` with `aria-roledescription="carousel"` and `aria-label="Featured events"`; each slide `role="group"`, `aria-roledescription="slide"`, `aria-label="2 of 4"`; inactive slides `aria-hidden` and their links `tabIndex=-1`; announce slide changes through a polite live region only when autoplay is paused (otherwise `aria-live="off"`).

**Tracking (`lib/tracking.ts`):** when a slide has been at least 50% visible for 1s, send `POST /api/ads/{id}/impression` once per session per ad (remember with `sessionStorage` inside try/catch). On click, send `POST /api/ads/{id}/click` using `navigator.sendBeacon` before navigation. Both are no-ops in mock mode. No cookies, no personal data in the payload.

## 8. Home page, top to bottom

**8.1 Navbar and ad strip** as above.

**8.2 Hero**
- Padding: 56px top, 72px bottom (desktop). Left column max-width 1000px.
- A yellow Sticker "Film studio, Delhi" above the headline (rotated -3deg).
- H1: "Films, brands & live moments." Display type. The words "live moments." use the outlined-text treatment (transparent fill, 2.5px ink stroke); the rest solid ink. Break lines naturally; on desktop the line breaks after "brands &".
- Lead paragraph (18px, muted, max 46ch): "We develop, produce and present films, advertising and live entertainment."
- Buttons: ink "See our work" (to /work) and yellow "Upcoming events" (to /events).
- **RotatingBadge:** an SVG, 150px on desktop (96px mobile), a yellow circle with a 2px ink stroke, the text "FILMS ✦ ADS ✦ LIVE ✦ EST. 2026 ✦" set on a circular path (DM Mono 12px, weight 500, letter-spacing 3, ink), and a static "C*" in Archivo 900 at the center. Positioned top-right of the hero (right 56px, top 40px) with a base tilt of 14deg; the text ring rotates 360deg in 18s linear infinite while the "C*" stays still. `aria-hidden`. Mobile: smaller, positioned over the top-right corner of the hero media.
- **HeroMedia:** below the buttons, a 16:9 block, radius 32px, 2px ink border, max-width the container. Accepts `site.showreel` (video URL plus poster). With a video: muted, looping, `playsInline`, lazy-loaded poster first, with a small sound toggle button; under reduced motion show only the poster with a play button. Without a video: a Placeholder block (ink tone) labelled "[SHOWREEL OR HERO STILL]" with a small yellow REC dot and the text "Showreel" at top-left. The hero media is always shown, whether or not the ad strip exists.
- Page-load sequence (the one orchestrated moment): the three headline lines slide up from a clipped mask with 120ms stagger (700ms each), then the badge scales in (400ms), then buttons fade in. Total under 1.4s.

**8.3 Marquee band**
Ink background, yellow display text 34px (24px mobile), padding 20px 0: "Film ✦ Advertising ✦ Live events ✦ Fashion ✦ Talent ✦ Corporate ✦", repeated twice and translated -50% in a 30s linear infinite loop. Pauses on hover. Static (no animation) under reduced motion. `aria-hidden`.

**8.4 Services** (`id="services"`)
- SectionHeading: "What we do" with Sticker "Five ways to work with us".
- Five Cards in one row at 1200px and up, in this order and colors: Film & Content (yellow), Advertising (sand), Live Events & Sports (white), Fashion & Talent (ink with cream text), Corporate Events (yellow). 768 to 1199px: three columns (last row two cards, each spanning equally). Below 768px: a horizontal scroll-snap row, cards 80% wide, 16px gap, with the next card peeking.
- Each card: title (display, 24px) at the bottom, one-line description below it (14px), and a 40px circular arrow icon button top-right (decorative; the whole card is the link). No numerals. Links go to `/work?category=film`, `advertising`, `live_event`, `fashion`, `corporate`.
- Descriptions: "Films, web series, documentaries, shorts and music videos." / "Ad films, TVCs, digital ads and branded content." / "Celebrity cricket, concerts, award nights and festivals." / "Fashion shows, pageants, talent hunts and artist management." / "Launches, conferences, brand activations and summits."
- Hover or focus: card lifts 6px and rotates 0.6deg over 200ms; the arrow circle fills yellow (ink on the ink card).

**8.5 Our work**
- Sand background with 2px ink borders on top and bottom. SectionHeading "Our work" with Sticker "Selected projects", plus a text link "See all work" on the right.
- Three WorkFrames in a grid (3 columns on desktop, 2 on tablet, 1 on mobile; 40px gap). Frame: image area height 400px (aspect 4:5 on mobile), 2px ink border, radius 24px, rotated -2deg, 1.5deg (with 28px extra top margin) and -1deg. Below: a category and year line (mono 11px) and the project title (display, 28px). Hover: frame straightens to 0deg over 250ms (this is a hover affordance for a link).
- Data: first three items from `getWork()`. If fewer than three, fill the rest with Placeholder frames (tones yellow, ink, white). If there are none, show three placeholders labelled [FILM POSTER OR STILL], [AD FILM FRAME], [EVENT PHOTO] and the EmptyState sentence "Projects will appear here soon."
- Clicking a frame opens WorkDialog (section 9.3).

**8.6 Events** (`id="events"`)
- Ink background, cream text. SectionHeading "Events" with Sticker "Register to attend" (yellow sticker works on ink).
- **TicketCard (the memorable element):** the next upcoming event as a yellow ticket, radius 28px, rotated -1.5deg, overflow hidden, max-width 760px. Left part (flex 1, padding 36px, ink text): small mono line "Upcoming", the day number in display type 96px (line-height 0.85), month and year in display type 30px, event title in display 22px, venue and time at 14px. A 3px dashed ink vertical divider separates it from the right stub (150px wide, cream background) with a vertical centered ink "Register" Button. Two small circles in the page background color notch the divider at the top and bottom edges to look torn. Under 640px: stack vertically with a horizontal dashed divider and the stub's button full width; remove the rotation.
- Next to or below it (below on tablet and mobile): a "Past events" list. Each row: title (display, 24px), venue and year (muted-on-ink, 14px), a 1px line-on-ink top border, a "Gallery" text link (placeholder, goes to /events). Maximum 4 rows plus a "See all events" link.
- **Empty state (no upcoming events):** replace the ticket with a dashed-outline cream card: "No events announced right now. Leave your details and we will message you when the next one opens." and the NotifyForm inline (email or phone) with the button "Notify me".
- The ticket's Register button uses RegisterButton (section 9.1).

**8.7 Partners strip**
"Worked with" label (mono 11px) and a row of names in display type 28px, color faint, centered. Source: `site.partners` (strings). Hide the whole section when the array is empty; the mock config contains four placeholders ([Brand], [Partner], [Sponsor], [Platform]).

**8.8 CTA block**
A yellow block with a 2px ink border, radius 36px, padding 72px (40px on mobile), horizontal margin equal to the container padding. Left: h2 "Got a story, a brand or a stage?" (display, 60px, max 620px). Right: ink Button "Start a conversation" (to /contact) and a small contact line ([email]@[domain], [Phone], Delhi, India). On mobile it stacks and is center aligned.

**8.9 Footer** as in section 6.

## 9. Other pages and features

### 9.1 Registration placeholder flow (replaced later)
Event detail and registration pages are NOT built now. Build a `RegisterButton` component (props: `eventId?`, `variant`, `label`) used everywhere a Register action appears. For now it opens the NotifyDialog: title "Registration opens soon", text "Leave your details and we will message you when registration for [Event Name] opens.", fields: email, phone (at least one required), a consent checkbox "I agree to be contacted about Cinevanta events", button "Notify me". It posts `{ email?, phone?, eventId?, source }` to the subscribers API. Success state in the dialog: "Done. We will be in touch." Isolating this in one component means the later registration pages only need one swap.

### 9.2 /events
- Page header: h1 "Events" with a lead line, and a segmented control with two tabs, "Upcoming" and "Past" (2px ink border, active tab yellow). Tab state syncs to `?status=upcoming|past`.
- Upcoming: a grid of EventCards (poster area 4:5 or Placeholder, date block, title, venue, "Register" button). If none: the same empty state as the home page.
- Past: a grid of smaller cards or rows with poster, title, venue, year. Empty state: "Past events will be listed here."
- Per-page metadata and Open Graph tags.

### 9.3 /work
- Page header with h1 "Work" and filter chips: All, Film, Advertising, Live event, Fashion, Corporate (pills, 2px ink border, active chip yellow). Filter syncs to `?category=`.
- Grid of WorkFrames (alternating tilts as in 8.5), 9 per page with a "Load more" button (appends the next page; announces "N more projects loaded" via a live region).
- Item click opens WorkDialog: large image, title, category, year, optional description, and an optional video (`videoUrl`) embedded from the privacy-enhanced YouTube domain or Vimeo, loaded only after the user presses play.
- Empty state per filter: "No projects in this category yet."

### 9.4 /about
- h1 "About", a large statement paragraph placeholder ("[One or two sentences about the studio in the proprietor's own words]"), a "What we make" block that restates the five services as plain text, a proprietor block (portrait Placeholder plus "[Proprietor name]" and "[Short bio]"), and the CTA block. No invented history or numbers.

### 9.5 /contact
- Two columns on desktop (form 60%, details 40%), stacked on mobile.
- **EnquiryForm** fields: Name (required, 2 to 80 chars), Email (required, valid), Phone (optional; accepts +91 or 10 digits, 6 to 9 first digit), Enquiry type (required select: Film, Advertising, Live event, Fashion and talent, Corporate, Other; preselected from `?type=`), Message (required, 10 to 1000 chars, with a live counter). Hidden honeypot field `website` (must stay empty) and a hidden `startedAt` timestamp. Button "Send enquiry".
- Validation with zod and react-hook-form, on blur and on submit; errors are specific and tell how to fix ("Enter an email like name@example.com"). On submit: disabled button with spinner and "Sending..." label, then success card: "Thanks, [Name]. We received your enquiry and will reply by email or phone." or error banner: "We could not send your enquiry. Check your connection and try again, or email [email]@[domain]." Keep the entered values on error.
- Details column: email, phone, "Delhi, India" (all from `site`), social links, and a one-line response-time placeholder "[We reply within X working days]".

### 9.6 /privacy and /terms
Simple readable pages with clearly marked placeholder text "[Legal copy to be supplied]". Needed because forms collect personal data. Linked from the footer and from form consent text.

### 9.7 System pages
- **404:** h1 "Scene not found." line "This page is not in the script." Button "Back to home".
- **error.tsx:** "Something broke on our side. Try again." with a retry button.
- **loading.tsx:** skeletons matching each page's layout.
- **/styleguide** (development only): shows colors, type scale, buttons, stickers, cards, inputs in all states, dialog, toast, placeholder tones, ticket card, work frame, ad strip with mock data. Calls `notFound()` in production.

### 9.8 SEO and metadata
- Title template "%s | Cinevanta Studios"; default title "Cinevanta Studios | Film, advertising and live events in Delhi"; default description "Cinevanta Studios is a Delhi production house for films, advertising, live events, fashion shows and corporate events." (mark as placeholder copy to confirm).
- `opengraph-image.tsx` using `next/og`: yellow background, ink display wordmark, 1200x630.
- `sitemap.ts` (static routes plus events from the API), `robots.ts`, `manifest.ts`, favicon (yellow circle with "C*").
- JSON-LD `Organization` on the home page (name, url, city) and `Event` JSON-LD for each upcoming event on /events.

## 10. Motion
Motion is sparse and meaningful. Do NOT add fade-and-slide-up reveals to every section, and do not add hover effects to non-interactive elements.
- **Ambient (allowed):** badge ring rotation (18s linear), marquee (30s linear).
- **One orchestrated moment:** the hero load sequence in 8.2.
- **Responding to the user:** button hover and focus (200ms), service card lift, work frame straighten (250ms), ticket card hover (rotation eases to -0.5deg and lifts 4px, 250ms), tab and chip state changes, dialog open and close (opacity and scale 0.97 to 1, 200ms), mobile menu reveal (450ms), carousel slide (600ms), toast in and out (200ms).
- Easing: `cubic-bezier(0.22, 0.8, 0.2, 1)` for movement, `ease-out` for opacity. Animate only `transform` and `opacity`.
- `prefers-reduced-motion: reduce`: disable ambient loops, the hero sequence, carousel autoplay and sliding, parallax-like hover movement; keep instant state changes.

## 11. Responsive rules
- 320px minimum. No horizontal page scroll at any width.
- Wordmark, h1 and h2 sizes use `clamp()` as in 4.3.
- Hero: below 1024px the badge moves over the media block; below 768px the buttons stack full width.
- Ad strip: desktop creative at 768px and up, mobile creative below; hide arrows on touch.
- Services: 5 / 3 / scroll-snap as in 8.4. Work: 3 / 2 / 1 columns. Events: ticket and list side by side at 1024px and up, stacked below.
- Touch targets at least 44x44px. Tap targets in the carousel dots are 24px minimum with spacing.
- Test at 320, 375, 414, 768, 1024, 1280, 1440, 1920 and 2560 widths. At 2560 the container stays 1440 wide; backgrounds extend full width.

## 12. Accessibility, performance, security
- Semantic landmarks (`header`, `nav`, `main`, `footer`), one h1 per page, skip-to-content link, visible focus states everywhere, WCAG AA contrast (follow the color rules in 4.2), descriptive alt text on all content images (decorative ones `alt=""`), every control reachable and operable by keyboard, form fields linked to labels and errors via `aria-describedby`, errors announced politely.
- Performance: Lighthouse mobile target 90+ on performance, 100 on accessibility and best practices, 95+ on SEO for the home page. Fonts through `next/font` with `display: swap` and only needed weights; `next/image` with correct `sizes` for all non-ad images; route-level code splitting; no layout shift from the ad strip, fonts or images; Framer Motion loaded only in components that use it (use `LazyMotion` with `domAnimation`).
- Security: never use `dangerouslySetInnerHTML`; `rel="noopener noreferrer"` on external links; no secrets in `NEXT_PUBLIC_` variables; sanitize and validate all form input client-side (the server will validate again); security headers configured in `next.config` (X-Content-Type-Options, Referrer-Policy, X-Frame-Options or frame-ancestors, a sensible Content-Security-Policy compatible with Google Fonts and the configured image hosts).
- Privacy: no analytics and no cookies now. Add a single `lib/analytics.ts` stub so analytics can be added later in one place.

## 13. API contract and mock data
Keep all types and zod schemas in `types/api.ts`. The backend will be built to match this contract.

- `GET /api/ads` returns `Ad[]` (only currently active, sorted by priority)
  `{ id, title, imageDesktop, imageMobile, alt, linkUrl, label?, startsAt, endsAt, priority }`
- `POST /api/ads/{id}/impression` and `POST /api/ads/{id}/click` return 204
- `GET /api/events?status=upcoming|past` returns `Event[]`
  `{ id, slug, title, date (ISO), venue, city, posterUrl?, summary?, status }`
- `GET /api/work?category=&page=&pageSize=` returns `{ items: Work[], total }`
  `Work = { id, title, category: "film"|"advertising"|"live_event"|"fashion"|"corporate", year, imageUrl, description?, videoUrl? }`
- `POST /api/enquiries` with `{ name, email, phone?, type, message, website (honeypot), startedAt }` returns 201
- `POST /api/subscribers` with `{ email?, phone?, eventId?, source }` returns 201 (`source`: "events-section", "notify-dialog", "footer")
- Errors: JSON `{ error: string, fields?: Record<string,string> }`; the form maps `fields` to inline errors.

**Mock mode:** `lib/mocks.ts` provides: 3 ads (generated placeholder images as inline SVG data URIs: solid yellow, ink and sand blocks with the title in display type, one 1920x240 and one 750x300 each, `linkUrl` "/events"), 2 upcoming events and 3 past events (all text in brackets such as [Event Name 1], with obviously fake ISO dates in the future/past), 7 work items across categories (placeholder images). `NEXT_PUBLIC_MOCK_ADS=0` returns no ads; `NEXT_PUBLIC_MOCK_EVENTS=none` returns no events, so every empty state can be reviewed. POST calls in mock mode wait 600ms and succeed.

## 14. Content deck (all in `lib/content.ts`)
- Hero kicker: "Film studio, Delhi". H1: "Films, brands & live moments." Lead: "We develop, produce and present films, advertising and live entertainment."
- Services headings and descriptions as in 8.4.
- Work: "Our work", sticker "Selected projects", empty: "Projects will appear here soon."
- Events: "Events", sticker "Register to attend", empty: "No events announced right now. Leave your details and we will message you when the next one opens."
- CTA: "Got a story, a brand or a stage?" Button "Start a conversation".
- Form button "Send enquiry"; dialog button "Notify me"; success and error strings as in 9.5 and 9.1.
- 404: "Scene not found." / "This page is not in the script."
- Voice: plain verbs, sentence case, active voice, no filler, errors say what happened and how to fix it. Do not write marketing superlatives ("world-class", "cutting-edge").

## 15. Testing
- Vitest + Testing Library: AdStrip (renders nothing with zero ads; no controls with one ad; autoplay advances; pauses on hover, focus and Pause press; keyboard arrows; reduced motion disables autoplay; filters out expired ads; sends impression once and click on click), EnquiryForm (validation messages, honeypot blocks submit, success and error states), RegisterButton and NotifyDialog (opens, validates at least one contact, posts payload, closes, returns focus), Navbar (hide on scroll down and show on scroll up), api client (mock switch, schema validation failure returns empty list).
- Run `axe` (jest-axe) on each page's rendered output. Manually verify the empty-state matrix: (no ads, no events), (ads, no events), (no ads, events), (ads, events).

## 16. Build phases and definition of done
Work in phases; after each phase run typecheck, lint and tests, and summarize what was done and any assumption made.
- **Phase 0:** scaffold, Tailwind theme and CSS variables from section 4, fonts, `site.ts`, `content.ts`, env handling, mock layer, and show the file tree.
- **Phase 1:** UI kit and /styleguide.
- **Phase 2:** Navbar, MobileMenu, Footer, Wordmark.
- **Phase 3:** AdStrip with all behaviours and tests.
- **Phase 4:** Home sections in order: Hero, Marquee, Services, Work, Events, Partners, CTA.
- **Phase 5:** /events, /work (with dialog), /about, /contact, RegisterButton and NotifyDialog, /privacy, /terms, 404, error, loading.
- **Phase 6:** metadata, OG image, sitemap, robots, JSON-LD, security headers, performance and accessibility pass, README.

**Definition of done:** all pages render in mock mode and with the real API; the empty-state matrix works; no console errors; Lighthouse and axe targets met; responsive checks at all listed widths pass; README explains how to run, all environment variables, how to switch from mocks to the real API, and how the RegisterButton will be swapped when registration pages are built.

## 17. Do not
- Do not add numbered markers, eyebrow labels, arrows in link text, gradients, soft shadows, glass effects, emoji icons or stock illustrations.
- Do not make every section a grid of identical rounded cards; keep the variety specified here.
- Do not add libraries beyond section 3 without a stated reason.
- Do not build an admin area, login, payments, event detail pages or ticketing.
- Do not write lorem ipsum; use the bracketed placeholders and the copy in section 14.
