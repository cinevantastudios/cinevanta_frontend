import type { Metadata } from "next";
import { Button, Container, Section, Sticker } from "@/components/ui";
import { CtaBlock } from "@/components/home/CtaBlock";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.services.pageTitle,
  description: content.services.pageLead,
  path: routes.services,
});

/**
 * Basic fast-track Services page (/services).
 * Lists all five Cinevanta Studios production disciplines in a clean 2-column card grid
 * with deliverables pills and direct contact links.
 */
export default function ServicesPage() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16">
        <Container className="space-y-10">
          <div className="max-w-[52rem] space-y-5">
            <div>
              <Sticker rotation={0}>{content.services.sticker}</Sticker>
            </div>
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.services.pageTitle}
            </h1>
            <p className="max-w-[60ch] text-[1.125rem] leading-[1.6] text-muted md:text-[1.25rem]">
              {content.services.pageLead}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {content.services.items.map((service) => {
              const categoryLabel = content.work.categoryLabels[service.id];

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="flex flex-col justify-between gap-6 rounded-card border-2 border-ink bg-white p-7 text-ink md:p-8"
                >
                  <div className="space-y-4">
                    <span className="font-meta text-muted">{categoryLabel}</span>
                    <h2 className="font-display-expanded text-h2 text-ink">{service.title}</h2>
                    <p className="text-[1.0625rem] font-medium text-ink">
                      {service.description}
                    </p>
                    <p className="text-[0.9375rem] leading-relaxed text-muted">
                      {service.detail}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      <p className="font-meta text-muted">{content.services.deliverablesLabel}</p>
                      <ul className="flex flex-wrap gap-2">
                        {service.deliverables.map((deliverable) => (
                          <li
                            key={deliverable}
                            className="rounded-pill border border-ink bg-sand px-3 py-1 text-[0.8125rem] font-medium text-ink"
                          >
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-ink/15 pt-5">
                    <Button href={service.enquiryHref} variant="ink" withArrow>
                      {content.services.enquireCta}
                    </Button>
                    <Button href={service.href} variant="outline">
                      {content.services.viewWorkCta}
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
