import { Button, Container } from "@/components/ui";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export function CtaBlock() {
  return (
    <section className="bg-cream py-14 md:py-[72px] lg:py-[104px]">
      <Container>
        <div className="flex flex-col items-center gap-8 rounded-block border-2 border-ink bg-yellow p-10 text-center text-ink md:p-14 lg:flex-row lg:items-center lg:justify-between lg:p-[72px] lg:text-left">
          <h2 className="font-display-expanded max-w-[620px] text-[36px] leading-[0.94] md:text-[48px] lg:text-[60px]">
            {content.cta.heading}
          </h2>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <Button href={content.cta.href} variant="ink" withArrow>
              {content.cta.button}
            </Button>
            <p className="text-[14px] font-medium text-ink/85">
              {site.email} • {site.phone} • {site.city}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

