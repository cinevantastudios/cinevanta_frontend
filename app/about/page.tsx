import type { Metadata } from "next";
import { Button, Container, Section, Sticker } from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.about.pageTitle,
  description: content.about.lead,
  path: routes.about,
});

/**
 * Basic fast-track About page for Cinevanta Studios.
 * Presents the studio overview, proprietor statement, leadership profile, and studio fact sheet.
 */
export default function AboutPage() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16">
        <Container className="space-y-12">
          {/* Studio overview */}
          <div className="max-w-[48rem] space-y-5">
            <div>
              <Sticker rotation={0}>{content.about.kicker}</Sticker>
            </div>

            <h1 className="font-display-expanded text-h1 text-ink">
              {content.about.pageTitle}
            </h1>

            <p className="text-[1.125rem] leading-[1.6] text-muted md:text-[1.25rem]">
              {content.about.lead}
            </p>
          </div>

          {/* Proprietor quote + Leadership & Studio Sheet */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 rounded-card border-2 border-ink bg-yellow p-7 text-ink lg:col-span-6 md:p-8">
              <span className="font-meta text-ink/80">{content.about.proprietorHeading}</span>
              <blockquote className="space-y-3">
                <p className="font-display-expanded text-[1.375rem] leading-[1.2] text-ink md:text-[1.625rem]">
                  {content.about.statement}
                </p>
                <footer className="font-meta text-ink/80">
                  {content.about.statementCaption}
                </footer>
              </blockquote>

              <div className="space-y-2 border-t-2 border-ink/20 pt-5">
                <p className="font-meta text-ink/75">{content.about.proprietorRole}</p>
                <h2 className="font-display-expanded text-[1.75rem] text-ink">
                  {content.about.proprietorName}
                </h2>
                <p className="text-[0.9375rem] leading-relaxed text-ink/85">
                  {content.about.proprietorBio}
                </p>
              </div>
            </div>

            {/* Studio Fact Sheet */}
            <div className="flex flex-col justify-between space-y-6 rounded-card border-2 border-ink bg-sand p-7 text-ink lg:col-span-6 md:p-8">
              <div className="space-y-5">
                <h2 className="font-display-expanded text-[1.5rem] text-ink">
                  {content.about.factSheetHeading}
                </h2>

                <dl className="grid grid-cols-1 gap-5 border-y border-ink/25 py-5 sm:grid-cols-2">
                  {content.about.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-meta text-muted">{fact.label}</dt>
                      <dd className="mt-1 text-[1rem] font-semibold text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button href={routes.contact} variant="ink" withArrow>
                  {content.about.connectCta}
                </Button>
                <Button href={routes.services} variant="outline">
                  {content.about.secondaryCta.label}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBlock />
    </main>
  );
}
