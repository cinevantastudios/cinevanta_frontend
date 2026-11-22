import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Button,
  Card,
  Container,
  EmptyState,
  Placeholder,
  Section,
  SectionHeading,
  Skeleton,
  Sticker,
} from "@/components/ui";
import { AdStrip } from "@/components/ads/AdStrip";
import { TicketCard } from "@/components/home/TicketCard";
import { Wordmark } from "@/components/layout/Wordmark";
import { WorkFrame } from "@/components/work/WorkFrame";
import { content } from "@/lib/content";
import { getMockAds, getMockEvents, getMockWork } from "@/lib/mocks";
import { site, themeColors } from "@/lib/site";
import { StyleguideInteractive } from "./StyleguideShowcase";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const COLOR_SWATCHES = [
  { name: "cream", hex: themeColors.cream, bg: "bg-cream", text: "text-ink", note: "Page background" },
  { name: "ink", hex: themeColors.ink, bg: "bg-ink", text: "text-cream", note: "Text, borders, dark sections" },
  { name: "yellow", hex: themeColors.yellow, bg: "bg-yellow", text: "text-ink", note: "Primary accent, stickers, highlights" },
  { name: "sand", hex: themeColors.sand, bg: "bg-sand", text: "text-ink", note: "Soft section background, card tint" },
  { name: "white", hex: themeColors.white, bg: "bg-white", text: "text-ink", note: "Cards & inputs" },
  { name: "muted", hex: themeColors.muted, bg: "bg-muted", text: "text-cream", note: "Secondary text on light" },
  { name: "muted-on-ink", hex: themeColors.mutedOnInk, bg: "bg-muted-on-ink", text: "text-ink", note: "Secondary text on ink" },
  { name: "faint", hex: themeColors.faint, bg: "bg-faint", text: "text-ink", note: "Decorative only (partners)" },
  { name: "line-on-ink", hex: themeColors.lineOnInk, bg: "bg-line-on-ink", text: "text-cream", note: "Dividers on ink" },
] as const;

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main id="main-content" className="bg-cream text-ink">
      {/* Header */}
      <Section className="border-b-2 border-ink py-12 md:py-16">
        <Container className="space-y-4">
          <Sticker rotation={-3}>Dev only</Sticker>
          <h1 className="font-display-expanded text-h1">
            {site.wordmark} <span className="text-outline-ink">Styleguide</span>
          </h1>
          <p className="max-w-[60ch] text-[1.125rem] text-muted">
            Design tokens, typography, and UI primitives for {site.name}. This route returns
            404 in production.
          </p>
        </Container>
      </Section>

      {/* Colors */}
      <Section>
        <Container className="space-y-8">
          <SectionHeading title="Colors" sticker="Section 4.2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_SWATCHES.map((swatch) => (
              <div
                key={swatch.name}
                className="overflow-hidden rounded-card border-2 border-ink bg-white"
              >
                <div
                  className={`flex h-28 items-end justify-between border-b-2 border-ink p-4 ${swatch.bg} ${swatch.text}`}
                >
                  <span className="font-display-expanded text-[1.25rem]">{swatch.name}</span>
                  <span className="font-meta">{swatch.hex}</span>
                </div>
                <p className="px-4 py-3 text-[0.875rem] text-muted">{swatch.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Typography */}
      <Section tone="sand" bordered>
        <Container className="space-y-8">
          <SectionHeading title="Type scale" sticker="Section 4.3" />
          <div className="space-y-6 rounded-card border-2 border-ink bg-cream p-6 md:p-10">
            <div className="border-b border-ink/20 pb-5">
              <span className="font-meta text-muted">Display H1 — Archivo 800, wdth 125</span>
              <p className="font-display-expanded text-h1 mt-2">
                Films, brands &amp; <span className="text-outline-ink">live moments.</span>
              </p>
            </div>
            <div className="border-b border-ink/20 pb-5">
              <span className="font-meta text-muted">Display H2 — clamp(32.4px, 4.5vw, 61.2px)</span>
              <p className="font-display-expanded text-h2 mt-2">Got a story, a brand or a stage?</p>
            </div>
            <div className="border-b border-ink/20 pb-5">
              <span className="font-meta text-muted">Display H3 — 21.6px / 19.8px mobile</span>
              <p className="font-display-expanded text-h3 mt-2">Live Events &amp; Sports</p>
            </div>
            <div className="border-b border-ink/20 pb-5">
              <span className="font-meta text-muted">Ticket date — 86.4px / 57.6px mobile</span>
              <p className="font-display-expanded text-ticket-date mt-2">15</p>
            </div>
            <div className="border-b border-ink/20 pb-5">
              <span className="font-meta text-muted">Lead 1.125rem &amp; Body 1rem — Inter (90% root scale)</span>
              <p className="mt-2 max-w-[65ch] text-[1.125rem] text-muted">{content.hero.lead}</p>
              <p className="mt-2 max-w-[65ch] text-[1rem] text-ink">
                Cinevanta Studios develops, produces and presents films, advertising campaigns, live
                entertainment, fashion shows and corporate stages from Delhi.
              </p>
            </div>
            <div>
              <span className="font-meta text-muted">Meta — DM Mono 500, 10px uppercase</span>
              <p className="font-meta mt-2 text-ink">Film • 2026 • Delhi, India</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buttons & Stickers */}
      <Section>
        <Container className="space-y-10">
          <SectionHeading title="Buttons & stickers" sticker="Section 5" />

          <div className="space-y-4">
            <h3 className="font-display-expanded text-h3">Buttons</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="ink" withArrow>
                See our work
              </Button>
              <Button variant="yellow" withArrow>
                Upcoming events
              </Button>
              <Button variant="outline" withArrow>
                Learn more
              </Button>
              <Button variant="ink">Send enquiry</Button>
              <Button variant="yellow">Notify me</Button>
              <Button variant="outline">Cancel</Button>
              <Button variant="ink" loading>
                Sending...
              </Button>
              <Button variant="ink" disabled>
                Disabled
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display-expanded text-h3">Stickers</h3>
            <div className="flex flex-wrap items-center gap-6">
              <Sticker>Five ways to work with us</Sticker>
              <Sticker rotation={-3}>Film studio, Delhi</Sticker>
              <Sticker rotation={0}>Featured event</Sticker>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display-expanded text-h3">Wordmark</h3>
            <div className="flex flex-wrap items-center gap-8 rounded-card border-2 border-ink bg-white p-6">
              <Wordmark size="sm" tone="ink" />
              <Wordmark size="md" tone="ink" />
              <div className="rounded-input bg-ink px-5 py-3">
                <Wordmark size="md" tone="cream" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Cards */}
      <Section tone="sand" bordered>
        <Container className="space-y-8">
          <SectionHeading title="Cards" sticker="Five tones" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {(["yellow", "sand", "white", "ink", "cream"] as const).map((tone) => (
              <Card key={tone} tone={tone}>
                <span className="font-meta opacity-80">{tone}</span>
                <div className="space-y-2">
                  <h3 className="font-display-expanded text-h3">{tone} card</h3>
                  <p
                    className={
                      tone === "ink"
                        ? "text-[0.875rem] text-muted-on-ink"
                        : "text-[0.875rem] text-muted"
                    }
                  >
                    2px ink border, 28px radius, 26px padding, 270px min-height.
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Interactive Inputs, Dialog & Toast */}
      <Section>
        <Container className="space-y-8">
          <SectionHeading title="Forms, dialog & toast" sticker="Interactive" />
          <StyleguideInteractive />
        </Container>
      </Section>

      {/* Placeholders, Skeletons & Empty States */}
      <Section tone="ink">
        <Container className="space-y-12">
          <SectionHeading title="Placeholders & states" sticker="Zero-asset ready" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Placeholder
              tone="yellow"
              ratio="4/5"
              label="[FILM POSTER OR STILL]"
              className="rounded-frame border-2 border-cream/30"
            />
            <Placeholder
              tone="sand"
              ratio="4/5"
              label="[AD FILM FRAME]"
              className="rounded-frame border-2 border-cream/30"
            />
            <Placeholder
              tone="white"
              ratio="4/5"
              label="[EVENT PHOTO]"
              className="rounded-frame border-2 border-cream/30"
            />
            <Placeholder
              tone="ink"
              ratio="4/5"
              label="[SHOWREEL OR HERO STILL]"
              className="rounded-frame border-2 border-cream/30"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-card border-2 border-line-on-ink bg-cream p-6 text-ink">
              <span className="font-meta text-muted">Skeleton pulse (1.6s)</span>
              <Skeleton rounded="frame" className="h-36 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <EmptyState
              surface="ink"
              message={content.events.emptyUpcoming}
              action={<Button variant="yellow">Notify me</Button>}
            />
          </div>

          <div className="space-y-6">
            <h3 className="font-display-expanded text-h3 text-cream">Ticket card</h3>
            {getMockEvents("upcoming")[0] ? (
              <TicketCard event={getMockEvents("upcoming")[0]!} />
            ) : null}
          </div>

          <div className="space-y-6 rounded-card border-2 border-line-on-ink bg-sand p-6 text-ink md:p-8">
            <h3 className="font-display-expanded text-h3 text-ink">Work frames</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {getMockWork(undefined, 1, 3).items.map((item, idx) => (
                <WorkFrame key={item.id} item={item} index={idx} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display-expanded text-h3 text-cream">Ad strip (mock data)</h3>
            <p className="text-[0.9375rem] text-muted-on-ink">
              Full-bleed carousel shown directly below with 3 mock slides, hover/focus controls,
              pause toggle, dots, and progress bar.
            </p>
          </div>
        </Container>
      </Section>

      <AdStrip ads={getMockAds()} />
    </main>
  );
}

