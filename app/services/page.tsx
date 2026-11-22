import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Container,
  Placeholder,
  Section,
  SectionHeading,
  Sticker,
} from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Marquee } from "@/components/home/Marquee";
import { content, type ServiceCardTone, type ServiceProcessStep } from "@/lib/content";
import { routes } from "@/lib/site";
import { cn, createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.services.pageTitle,
  description: content.services.pageLead,
  path: routes.services,
});

const unitBlockToneClasses: Record<ServiceCardTone, string> = {
  yellow: "bg-yellow text-ink",
  sand: "bg-sand text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-cream",
};

const processStepToneClasses: Record<ServiceProcessStep["tone"], string> = {
  yellow: "bg-yellow text-ink",
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-cream",
};

/**
 * Dedicated Services page (/services).
 * Showcases all five Cinevanta Studios production units withposter-framed visuals,
 * deliverables chips, direct category-filtered Work & Contact deep links,
 * a four-stage production pipeline, and partner engagement pathways.
 */
export default function ServicesPage() {
  return (
    <main id="main-content">
      {/* Page Header & Discipline Jump Bar */}
      <Section tone="cream" className="pt-12 pb-14 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[52rem] space-y-5">
            <div>
              <Sticker rotation={-3}>{content.services.sticker}</Sticker>
            </div>
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.services.pageTitle}
            </h1>
            <p className="max-w-[60ch] text-[1.125rem] leading-[1.6] text-muted md:text-[1.25rem]">
              {content.services.pageLead}
            </p>
          </div>

          {/* Quick-jump pills to each production discipline */}
          <nav
            aria-label={content.services.jumpNavLabel}
            className="flex flex-wrap items-center gap-2.5"
          >
            {content.services.items.map((service) => (
              <Link
                key={service.id}
                href={routes.serviceAnchor(service.id)}
                className={cn(
                  "inline-flex min-h-[2.75rem] items-center rounded-pill border-2 border-ink bg-white px-5 py-2 text-[0.875rem] font-semibold text-ink",
                  "transition-[background-color,transform] duration-200 ease-[var(--ease-move)]",
                  "hover:-translate-y-0.5 hover:rotate-[0.6deg] hover:bg-yellow",
                  "focus-visible:-translate-y-0.5 focus-visible:rotate-[0.6deg]",
                  "motion-reduce:transform-none",
                )}
              >
                {service.title}
              </Link>
            ))}
          </nav>
        </Container>
      </Section>

      <Marquee />

      {/* Five Production Units — Alternating Poster Showcases */}
      <Section tone="cream" aria-label={content.services.heading}>
        <Container className="space-y-12 md:space-y-16">
          {content.services.items.map((service, index) => {
            const isInk = service.tone === "ink";
            const isReversed = index % 2 === 1;
            const frameRotation =
              index % 2 === 0 ? "xs:-rotate-[1.5deg]" : "xs:rotate-[1.5deg]";
            const categoryLabel = content.work.categoryLabels[service.id];

            return (
              <article
                key={service.id}
                id={service.id}
                data-surface={isInk ? "ink" : undefined}
                className={cn(
                  "scroll-mt-24 rounded-block border-2 border-ink p-7 md:p-10 lg:p-12",
                  unitBlockToneClasses[service.tone],
                )}
              >
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  {/* Poster Still Frame */}
                  <div
                    className={cn(
                      "lg:col-span-5",
                      isReversed && "lg:order-2",
                    )}
                  >
                    <div
                      className={cn(
                        "overflow-hidden rounded-frame border-2 bg-white p-3",
                        isInk ? "border-cream" : "border-ink",
                        frameRotation,
                      )}
                    >
                      <div className="overflow-hidden rounded-[14px] border-2 border-ink">
                        <Placeholder
                          tone={isInk ? "yellow" : "ink"}
                          ratio="4/3"
                          label={service.placeholderLabel}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Discipline Copy, Deliverables & Deep-Link CTAs */}
                  <div
                    className={cn(
                      "space-y-6 lg:col-span-7",
                      isReversed && "lg:order-1",
                    )}
                  >
                    <div className="space-y-3">
                      <span
                        className={cn(
                          "font-meta inline-block",
                          isInk ? "text-yellow" : "text-ink/80",
                        )}
                      >
                        {categoryLabel}
                      </span>
                      <h2 className="font-display-expanded text-h2">
                        {service.title}
                      </h2>
                      <p
                        className={cn(
                          "max-w-[58ch] text-[1.125rem] leading-[1.55] font-medium",
                          isInk ? "text-cream" : "text-ink",
                        )}
                      >
                        {service.description}
                      </p>
                      <p
                        className={cn(
                          "max-w-[60ch] text-[1rem] leading-[1.6]",
                          isInk ? "text-muted-on-ink" : "text-ink/80",
                        )}
                      >
                        {service.detail}
                      </p>
                    </div>

                    {/* Deliverables Pill List */}
                    <div className="space-y-3 pt-1">
                      <p
                        className={cn(
                          "font-meta",
                          isInk ? "text-muted-on-ink" : "text-ink/75",
                        )}
                      >
                        {content.services.deliverablesLabel}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {service.deliverables.map((deliverable) => (
                          <li
                            key={deliverable}
                            className={cn(
                              "rounded-pill border-2 px-3.5 py-1.5 text-[0.8125rem] font-semibold",
                              isInk
                                ? "border-cream/70 bg-ink text-cream"
                                : "border-ink bg-cream text-ink",
                            )}
                          >
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions: Pre-selected Contact Enquiry & Filtered Work Portfolio */}
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                      <Button
                        href={service.enquiryHref}
                        variant={isInk ? "yellow" : "ink"}
                        withArrow
                        className={cn(
                          "w-full sm:w-auto",
                          isInk && "hover:border-cream",
                        )}
                      >
                        {content.services.enquireCta}
                      </Button>
                      <Button
                        href={service.href}
                        variant={isInk ? "yellow" : "outline"}
                        className={cn(
                          "w-full sm:w-auto",
                          isInk &&
                            "border-2 border-cream bg-transparent text-cream hover:bg-cream hover:text-ink",
                        )}
                      >
                        {content.services.viewWorkCta}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </Container>
      </Section>

      {/* How a Production Runs — 4-Stage Pipeline */}
      <Section tone="sand" bordered aria-labelledby="services-process-heading">
        <Container className="space-y-10 md:space-y-12">
          <SectionHeading
            id="services-process-heading"
            title={content.services.processHeading}
            sticker={content.services.processSticker}
          />

          <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.services.processSteps.map((step) => {
              const isInkStep = step.tone === "ink";

              return (
                <li
                  key={step.stage}
                  data-surface={isInkStep ? "ink" : undefined}
                  className={cn(
                    "flex flex-col justify-between gap-8 rounded-card border-2 border-ink p-7",
                    processStepToneClasses[step.tone],
                  )}
                >
                  <div className="flex items-center justify-between border-b-2 border-dashed border-current/30 pb-4">
                    <span
                      className={cn(
                        "font-meta",
                        isInkStep ? "text-yellow" : "text-ink",
                      )}
                    >
                      {step.stage}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-block h-3 w-3 rounded-full border-2",
                        isInkStep
                          ? "border-cream bg-yellow"
                          : "border-ink bg-cream",
                      )}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-display-expanded text-h3">{step.title}</h3>
                    <p
                      className={cn(
                        "text-[0.9375rem] leading-relaxed",
                        isInkStep ? "text-muted-on-ink" : "text-ink/85",
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      {/* Who We Build With — Collaboration Pathways */}
      <Section tone="ink" aria-labelledby="services-collaborate-heading">
        <Container className="space-y-10 md:space-y-12">
          <SectionHeading
            id="services-collaborate-heading"
            title={content.services.collaborateHeading}
            sticker={content.services.collaborateSticker}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {content.services.collaborateGroups.map((group, index) => {
              const isHighlighted = index === 0;

              return (
                <article
                  key={group.title}
                  data-surface={isHighlighted ? undefined : "ink"}
                  className={cn(
                    "flex flex-col justify-between gap-8 rounded-card border-2 p-7 md:p-8",
                    isHighlighted
                      ? "border-ink bg-yellow text-ink"
                      : "border-cream bg-ink text-cream",
                  )}
                >
                  <div className="space-y-3">
                    <span
                      className={cn(
                        "font-meta inline-block",
                        isHighlighted ? "text-ink/80" : "text-yellow",
                      )}
                    >
                      {group.tag}
                    </span>
                    <h3 className="font-display-expanded text-h3">{group.title}</h3>
                    <p
                      className={cn(
                        "text-[0.9375rem] leading-relaxed",
                        isHighlighted ? "text-ink/85" : "text-muted-on-ink",
                      )}
                    >
                      {group.description}
                    </p>
                  </div>

                  <div>
                    <Button
                      href={group.href}
                      variant={isHighlighted ? "ink" : "yellow"}
                      withArrow
                      className={cn(!isHighlighted && "hover:border-cream")}
                    >
                      {group.ctaLabel}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <CtaBlock />
    </main>
  );
}
