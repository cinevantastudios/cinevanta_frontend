import Link from "next/link";
import { ArrowRightIcon, Container, Section, SectionHeading } from "@/components/ui";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";

/**
 * Basic fast-track Services section (#services) on the single-page scroll website.
 * Displays the five studio production units in a clean card grid scrolling to #contact.
 */
export function Services() {
  return (
    <Section
      id="services"
      tone="cream"
      className="scroll-mt-20"
      aria-labelledby="services-heading"
    >
      <Container className="space-y-10">
        <SectionHeading
          id="services-heading"
          title={content.services.heading}
          sticker={content.services.sticker}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.services.items.map((service) => (
            <Link
              key={service.id}
              id={service.id}
              href={routes.contact}
              className="group flex scroll-mt-24 flex-col justify-between gap-6 rounded-card border-2 border-ink bg-white p-6 text-ink transition-colors duration-150 hover:bg-sand"
            >
              <div className="space-y-3">
                <span className="font-meta text-muted">
                  {content.work.categoryLabels[service.id]}
                </span>
                <h3 className="font-display-expanded text-h3 text-ink">{service.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted">
                  {service.description}
                </p>
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {service.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="rounded-pill border border-ink/40 bg-cream px-2.5 py-0.5 text-[0.75rem] font-medium text-ink"
                    >
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-ink/15 pt-4 text-[0.875rem] font-semibold text-ink">
                <span>{content.services.enquireCta}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-yellow text-ink"
                >
                  <ArrowRightIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
