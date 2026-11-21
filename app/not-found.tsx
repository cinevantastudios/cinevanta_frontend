import { Button, Container, Section } from "@/components/ui";
import { content } from "@/lib/content";

export default function NotFound() {
  return (
    <main id="main-content">
      <Section tone="cream" className="py-20 md:py-28">
        <Container className="space-y-6">
          <h1 className="font-display-expanded text-h1 text-ink">
            {content.errors.notFoundTitle}
          </h1>
          <p className="max-w-[46ch] text-[18px] text-muted">
            {content.errors.notFoundDescription}
          </p>
          <div className="pt-2">
            <Button href="/" variant="ink" withArrow>
              {content.errors.notFoundCta}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}

