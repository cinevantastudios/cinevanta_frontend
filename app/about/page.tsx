import type { Metadata } from "next";
import { Container, Placeholder, Section } from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: content.about.pageTitle,
  description: content.meta.defaultDescription,
  openGraph: {
    title: `${content.about.pageTitle} | Cinevanta Studios`,
    description: content.meta.defaultDescription,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-14 md:pt-16 lg:pt-20">
        <Container className="space-y-12">
          <div className="max-w-[900px] space-y-6">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.about.pageTitle}
            </h1>
            <p className="max-w-[42ch] text-[22px] leading-[1.45] font-medium text-ink md:text-[28px]">
              {content.about.statement}
            </p>
          </div>
        </Container>
      </Section>

      {/* What we make (plain editorial list, no identical card grid) */}
      <Section tone="sand" bordered aria-labelledby="what-we-make-heading">
        <Container className="space-y-8">
          <h2 id="what-we-make-heading" className="font-display-expanded text-h2 text-ink">
            {content.about.whatWeMakeHeading}
          </h2>
          <dl className="divide-y divide-ink/25 border-t border-ink/25">
            {content.services.items.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <dt className="font-display-expanded text-[22px] text-ink md:col-span-4 md:text-[24px]">
                  {service.title}
                </dt>
                <dd className="max-w-[60ch] text-[16px] leading-relaxed text-ink/85 md:col-span-8">
                  {service.description}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Proprietor block */}
      <Section tone="cream" aria-labelledby="proprietor-heading">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <div className="overflow-hidden rounded-frame border-2 border-ink">
                <Placeholder
                  tone="sand"
                  ratio="4/5"
                  label={content.about.proprietorPortraitLabel}
                />
              </div>
            </div>
            <div className="space-y-4 md:col-span-7">
              <h2
                id="proprietor-heading"
                className="font-display-expanded text-h2 text-ink"
              >
                {content.about.proprietorName}
              </h2>
              <p className="max-w-[56ch] text-[18px] leading-[1.6] text-muted">
                {content.about.proprietorBio}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBlock />
    </main>
  );
}

