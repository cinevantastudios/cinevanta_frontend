import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  Button,
  Container,
  Placeholder,
  Section,
  SectionHeading,
  Sticker,
} from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Partners } from "@/components/home/Partners";
import { RotatingBadge } from "@/components/home/RotatingBadge";
import { content, type AboutCraftPillar } from "@/lib/content";
import { routes } from "@/lib/site";
import { cn, createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.about.pageTitle,
  description: content.about.lead,
  path: routes.about,
});

const pillarToneClasses: Record<AboutCraftPillar["tone"], string> = {
  yellow: "border-cream bg-yellow text-ink",
  cream: "border-cream bg-cream text-ink",
  ink: "border-cream bg-ink text-cream",
};

/**
 * Dedicated About page for Cinevanta Studios.
 * Presents the studio overview, proprietor statement poster, editorial breakdown of all five
 * production units, craft approach from script to stage, leadership & studio fact sheet,
 * partner strip, and primary conversion banner.
 */
export default function AboutPage() {
  return (
    <main id="main-content">
      {/* Studio Hero & Proprietor Statement Collage */}
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Left column: kicker, h1, lead, proprietor quote card, CTAs */}
            <div className="space-y-8 lg:col-span-7">
              <div className="space-y-5">
                <div>
                  <Sticker rotation={-3}>{content.about.kicker}</Sticker>
                </div>

                <h1 className="font-display-expanded text-h1 text-ink">
                  {content.about.pageTitle}
                </h1>

                <p className="max-w-[56ch] text-[1.125rem] leading-[1.6] text-muted md:text-[1.25rem]">
                  {content.about.lead}
                </p>
              </div>

              {/* Proprietor's statement framed as a tilted yellow poster note */}
              <blockquote className="space-y-4 rounded-card border-2 border-ink bg-yellow p-7 text-ink xs:-rotate-[0.75deg] md:p-9">
                <p className="font-display-expanded text-[1.375rem] leading-[1.15] text-ink md:text-[1.75rem]">
                  {content.about.statement}
                </p>
                <footer className="font-meta text-ink/80">
                  {content.about.statementCaption}
                </footer>
              </blockquote>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  href={content.about.primaryCta.href}
                  variant="ink"
                  withArrow
                  className="w-full sm:w-auto"
                >
                  {content.about.primaryCta.label}
                </Button>
                <Button
                  href={content.about.secondaryCta.href}
                  variant="outline"
                  withArrow
                  className="w-full sm:w-auto"
                >
                  {content.about.secondaryCta.label}
                </Button>
              </div>
            </div>

            {/* Right column: tilted poster frame with rotating studio stamp */}
            <div className="relative lg:col-span-5 lg:pt-4">
              <div className="absolute -top-6 right-3 z-[2] sm:-top-8 sm:right-4">
                <RotatingBadge />
              </div>

              <div className="overflow-hidden rounded-frame border-2 border-ink bg-white p-3 transition-transform duration-[250ms] ease-[var(--ease-move)] xs:rotate-[1.5deg] hover:rotate-0 motion-reduce:transform-none">
                <div className="overflow-hidden rounded-[14px] border-2 border-ink">
                  <Placeholder
                    tone="ink"
                    ratio="4/5"
                    label={content.about.studioStillLabel}
                  />
                </div>
                <div className="flex items-center justify-between px-2 pt-3 pb-1">
                  <span className="font-meta text-ink">{content.about.studioStillMeta}</span>
                  <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink bg-yellow" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What we make — plain editorial list with format tags and direct unit links */}
      <Section tone="sand" bordered aria-labelledby="what-we-make-heading">
        <Container className="space-y-10">
          <SectionHeading
            id="what-we-make-heading"
            title={content.about.whatWeMakeHeading}
            sticker={content.about.whatWeMakeSticker}
            action={
              <Link
                href={routes.services}
                className="inline-flex min-h-[2.75rem] items-center text-[0.9375rem] font-semibold text-ink underline decoration-2 underline-offset-[6px] transition-opacity duration-150 hover:opacity-75"
              >
                {content.about.whatWeMakeAction}
              </Link>
            }
          />

          <dl className="divide-y-2 divide-ink border-y-2 border-ink">
            {content.services.items.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 gap-4 py-7 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <dt className="font-display-expanded text-[1.5rem] text-ink md:col-span-4 md:text-[1.75rem]">
                  <Link
                    href={routes.serviceAnchor(service.id)}
                    className="inline-flex items-center gap-3 hover:underline hover:decoration-2 hover:underline-offset-4"
                  >
                    <span>{service.title}</span>
                  </Link>
                </dt>

                <dd className="space-y-3 md:col-span-6">
                  <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed font-medium text-ink">
                    {service.description}
                  </p>
                  <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink/80">
                    {service.detail}
                  </p>
                </dd>

                <dd className="md:col-span-2 md:flex md:justify-end">
                  <Link
                    href={routes.serviceAnchor(service.id)}
                    className="group inline-flex min-h-[2.75rem] items-center gap-2 text-[0.875rem] font-semibold text-ink"
                  >
                    <span className="underline decoration-2 underline-offset-4">
                      {content.about.exploreServiceLabel}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink transition-colors duration-200 group-hover:bg-yellow"
                    >
                      <ArrowRightIcon />
                    </span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Studio Craft Approach — high-contrast dark ink section */}
      <Section tone="ink" aria-labelledby="about-approach-heading">
        <Container className="space-y-10 md:space-y-12">
          <SectionHeading
            id="about-approach-heading"
            title={content.about.approachHeading}
            sticker={content.about.approachSticker}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {content.about.pillars.map((pillar, index) => {
              const isInkCard = pillar.tone === "ink";
              const tiltClass =
                index === 0
                  ? "lg:-rotate-[0.75deg]"
                  : index === 1
                    ? "lg:rotate-[0.75deg]"
                    : "lg:-rotate-[0.5deg]";

              return (
                <article
                  key={pillar.title}
                  data-surface={isInkCard ? "ink" : undefined}
                  className={cn(
                    "flex flex-col justify-between gap-8 rounded-card border-2 p-7 md:p-8",
                    pillarToneClasses[pillar.tone],
                    tiltClass,
                  )}
                >
                  <span
                    className={cn(
                      "font-meta inline-block",
                      isInkCard ? "text-yellow" : "text-ink/80",
                    )}
                  >
                    {pillar.meta}
                  </span>

                  <div className="space-y-3">
                    <h3 className="font-display-expanded text-h3">{pillar.title}</h3>
                    <p
                      className={cn(
                        "text-[0.9375rem] leading-relaxed",
                        isInkCard ? "text-muted-on-ink" : "text-ink/85",
                      )}
                    >
                      {pillar.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Proprietor / Leadership Block & Studio Fact Sheet */}
      <Section tone="cream" aria-labelledby="proprietor-heading">
        <Container className="space-y-10 md:space-y-12">
          <SectionHeading
            id="proprietor-heading"
            title={content.about.proprietorHeading}
            sticker={content.about.proprietorSticker}
          />

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Proprietor Portrait Frame */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-frame border-2 border-ink bg-white p-3 xs:-rotate-[1.25deg]">
                <div className="overflow-hidden rounded-[14px] border-2 border-ink">
                  <Placeholder
                    tone="sand"
                    ratio="4/5"
                    label={content.about.proprietorPortraitLabel}
                  />
                </div>
              </div>
            </div>

            {/* Bio & Studio Fact Sheet */}
            <div className="space-y-8 lg:col-span-7">
              <div className="space-y-3">
                <p className="font-meta text-muted">{content.about.proprietorRole}</p>
                <h3 className="font-display-expanded text-h2 text-ink">
                  {content.about.proprietorName}
                </h3>
                <p className="max-w-[58ch] text-[1.125rem] leading-[1.6] text-muted">
                  {content.about.proprietorBio}
                </p>
              </div>

              {/* Studio Sheet Card */}
              <div className="space-y-6 rounded-card border-2 border-ink bg-sand p-7 text-ink md:p-8">
                <h4 className="font-display-expanded text-[1.375rem] text-ink">
                  {content.about.factSheetHeading}
                </h4>

                <dl className="grid grid-cols-1 gap-5 border-y border-ink/25 py-5 sm:grid-cols-2">
                  {content.about.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-meta text-muted">{fact.label}</dt>
                      <dd className="mt-1 text-[1rem] font-semibold text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Button href={routes.contact} variant="ink" withArrow>
                    {content.about.connectCta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Partners />
      <CtaBlock />
    </main>
  );
}
