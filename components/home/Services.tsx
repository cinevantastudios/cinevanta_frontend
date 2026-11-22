import Link from "next/link";
import { ArrowRightIcon, Container, Section, SectionHeading } from "@/components/ui";
import { content, type ServiceCardTone } from "@/lib/content";
import { cn } from "@/lib/utils";

const cardToneClasses: Record<ServiceCardTone, string> = {
  yellow: "bg-yellow text-ink",
  sand: "bg-sand text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-cream",
};

const arrowCircleClasses: Record<ServiceCardTone, string> = {
  yellow: "border-ink bg-cream text-ink group-hover:bg-yellow group-focus-visible:bg-yellow",
  sand: "border-ink bg-cream text-ink group-hover:bg-yellow group-focus-visible:bg-yellow",
  white: "border-ink bg-cream text-ink group-hover:bg-yellow group-focus-visible:bg-yellow",
  ink: "border-cream bg-yellow text-ink group-hover:bg-ink group-hover:text-yellow group-focus-visible:bg-ink group-focus-visible:text-yellow",
};

export function Services() {
  return (
    <Section id="services" tone="cream" aria-labelledby="services-heading">
      <Container className="space-y-10 md:space-y-12">
        <SectionHeading
          id="services-heading"
          title={content.services.heading}
          sticker={content.services.sticker}
        />

        {/* Mobile: horizontal scroll-snap row; Tablet (768-1199): 3 + 2 spanning equally; Desktop (1200+): 5 in one row */}
        <div
          className={cn(
            "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2",
            "md:mx-0 md:grid md:grid-cols-6 md:gap-5 md:overflow-visible md:px-0 md:pb-0",
            "min-[1200px]:grid-cols-5",
          )}
        >
          {content.services.items.map((service, index) => {
            const isInk = service.tone === "ink";
            const tabletSpan =
              index < 3
                ? "md:col-span-2 min-[1200px]:col-span-1"
                : "md:col-span-3 min-[1200px]:col-span-1";

            return (
              <Link
                key={service.id}
                href={service.href}
                data-surface={isInk ? "ink" : undefined}
                className={cn(
                  "group flex min-h-[16.875rem] w-[80%] shrink-0 snap-start flex-col justify-between rounded-card border-2 border-ink p-[1.625rem]",
                  "transition-transform duration-200 ease-[var(--ease-move)]",
                  "hover:-translate-y-1.5 hover:rotate-[0.6deg] focus-visible:-translate-y-1.5 focus-visible:rotate-[0.6deg]",
                  "motion-reduce:transform-none",
                  "md:w-auto",
                  tabletSpan,
                  cardToneClasses[service.tone],
                )}
              >
                <div className="flex justify-end">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200",
                      arrowCircleClasses[service.tone],
                    )}
                  >
                    <ArrowRightIcon />
                  </span>
                </div>

                <div className="space-y-2.5 pt-8">
                  <h3 className="font-display-expanded text-h3">{service.title}</h3>
                  <p
                    className={cn(
                      "text-[0.875rem] leading-relaxed",
                      isInk ? "text-muted-on-ink" : "text-ink/80",
                    )}
                  >
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

