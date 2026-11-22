import { Button, Container } from "@/components/ui";
import { content } from "@/lib/content";
import { formatStudioContactSummary } from "@/lib/site";

/** Bottom-of-page conversion banner with primary CTA button and studio contact summary line. */
export function CtaBlock() {
  return (
    <section className="bg-cream py-14 md:py-[4.5rem] lg:py-[6.5rem]">
      <Container>
        <div className="flex flex-col items-center gap-8 rounded-block border-2 border-ink bg-yellow p-10 text-center text-ink md:p-14 lg:flex-row lg:items-center lg:justify-between lg:p-[4.5rem] lg:text-left">
          <h2 className="font-display-expanded max-w-[38.75rem] text-[2.25rem] leading-[0.94] md:text-[3rem] lg:text-[3.75rem]">
            {content.cta.heading}
          </h2>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <Button href={content.cta.href} variant="ink" withArrow>
              {content.cta.button}
            </Button>
            <p className="text-[0.875rem] font-medium text-ink/85">
              {formatStudioContactSummary()}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

