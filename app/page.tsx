import { Container, Section, SectionHeading } from "@/components/ui";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { WorkPreview } from "@/components/home/WorkPreview";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { JsonLd, buildOrganizationJsonLd } from "@/components/seo/JsonLd";
import { getWork } from "@/lib/api-client";
import { content } from "@/lib/content";
import { displayLimits, site } from "@/lib/site";

/** Revalidate home page every 60s (matches PAGE_REVALIDATE_SECONDS in cache_logics/revalidation-cache.ts). */
export const revalidate = 60;

/**
 * Cinevanta Studios one-page scroll-based fast-track website.
 * Combines Hero, About, Services, Work, and Studio Contact Details into a single smooth-scrolling page.
 */
export default async function HomePage() {
  const work = await getWork(undefined, 1, displayLimits.homeWorkPreviewCount);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <main id="main-content">
        {/* 1. Hero */}
        <Hero showreel={site.showreel} />

        {/* 2. About Section (#about) */}
        <Section
          id="about"
          tone="sand"
          bordered
          className="scroll-mt-20"
          aria-labelledby="about-heading"
        >
          <Container className="space-y-10">
            <SectionHeading
              id="about-heading"
              title={content.about.pageTitle}
              sticker={content.about.kicker}
            />

            <p className="max-w-[62ch] text-[1.125rem] leading-[1.6] text-ink/85 md:text-[1.25rem]">
              {content.about.lead}
            </p>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Proprietor statement & leadership */}
              <div className="space-y-5 rounded-card border-2 border-ink bg-yellow p-7 text-ink lg:col-span-6 md:p-8">
                <span className="font-meta text-ink/80">{content.about.proprietorHeading}</span>
                <blockquote className="space-y-2">
                  <p className="font-display-expanded text-[1.375rem] leading-[1.2] text-ink md:text-[1.5rem]">
                    {content.about.statement}
                  </p>
                  <footer className="font-meta text-ink/80">
                    {content.about.statementCaption}
                  </footer>
                </blockquote>

                <div className="space-y-1.5 border-t-2 border-ink/20 pt-4">
                  <p className="font-meta text-ink/75">{content.about.proprietorRole}</p>
                  <h3 className="font-display-expanded text-[1.5rem] text-ink">
                    {content.about.proprietorName}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-ink/85">
                    {content.about.proprietorBio}
                  </p>
                </div>
              </div>

              {/* Studio Fact Sheet */}
              <div className="space-y-5 rounded-card border-2 border-ink bg-white p-7 text-ink lg:col-span-6 md:p-8">
                <h3 className="font-display-expanded text-[1.375rem] text-ink">
                  {content.about.factSheetHeading}
                </h3>

                <dl className="grid grid-cols-1 gap-5 border-t border-ink/20 pt-5 sm:grid-cols-2">
                  {content.about.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-meta text-muted">{fact.label}</dt>
                      <dd className="mt-1 text-[0.9375rem] font-semibold text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Container>
        </Section>

        {/* 3. Services Section (#services) */}
        <Services />

        {/* 4. Work Section (#work) */}
        <WorkPreview items={work.items} />

        {/* 5. Contact Details Section (#contact) — direct studio contact details only */}
        <Section
          id="contact"
          tone="cream"
          className="scroll-mt-20"
          aria-labelledby="contact-heading"
        >
          <Container className="space-y-10">
            <div className="max-w-[65ch] space-y-3">
              <SectionHeading
                id="contact-heading"
                title={content.contact.pageTitle}
                sticker={content.contact.detailsHeading}
              />
              <p className="text-[1.0625rem] leading-[1.6] text-muted">
                {content.contact.pageLead}
              </p>
            </div>

            <div className="rounded-card border-2 border-ink bg-sand p-7 text-ink md:p-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div>
                  <p className="font-meta text-muted">Email</p>
                  <p className="mt-2 text-[1.125rem] font-semibold text-ink">
                    <a
                      href={`mailto:${site.email}`}
                      className="underline decoration-2 underline-offset-4 transition-opacity duration-150 hover:opacity-75"
                    >
                      {site.email}
                    </a>
                  </p>
                </div>

                <div>
                  <p className="font-meta text-muted">Phone</p>
                  <p className="mt-2 text-[1.125rem] font-semibold text-ink">
                    <a
                      href={`tel:${site.phone}`}
                      className="underline decoration-2 underline-offset-4 transition-opacity duration-150 hover:opacity-75"
                    >
                      {site.phone}
                    </a>
                  </p>
                </div>

                <div>
                  <p className="font-meta text-muted">Address</p>
                  <p className="mt-2 text-[1.125rem] font-semibold text-ink">{site.address}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-between gap-6 border-t border-ink/20 pt-6 sm:flex-row sm:items-center">
                {site.socials.length > 0 ? (
                  <div>
                    <p className="font-meta text-muted">Social</p>
                    <SocialLinks socials={site.socials} surface="light" className="mt-2 gap-x-5" />
                  </div>
                ) : null}

                <p className="text-[0.9375rem] font-medium text-muted">
                  {site.responseTime}
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
