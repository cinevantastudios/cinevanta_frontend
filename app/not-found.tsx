import { Button, Container, Section } from "@/components/ui";
import { content } from "@/lib/content";

/**
 * Custom 404 page shown when a route does not exist.
 * Provides clear next-step navigation so visitors are never stranded.
 */
export default function NotFound() {
  return (
    <main id="main-content">
      <Section tone="cream" className="py-20 md:py-28">
        <Container className="space-y-6">
          <h1 className="font-display-expanded text-h1 text-ink">
            {content.errors.notFoundTitle}
          </h1>
          <p className="max-w-[46ch] text-[1.125rem] text-muted">
            {content.errors.notFoundDescription}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href="/" variant="ink" withArrow>
              {content.errors.notFoundCta}
            </Button>
            {content.errors.notFoundLinks.map((link) => (
              <Button key={link.href} href={link.href} variant="outline">
                {link.label}
              </Button>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
