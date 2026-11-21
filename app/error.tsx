"use client";

import { Button, Container, Section } from "@/components/ui";
import { content } from "@/lib/content";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content">
      <Section tone="cream" className="py-20 md:py-28">
        <Container className="space-y-6">
          <h1 className="font-display-expanded text-h2 text-ink">
            {content.errors.errorTitle}
          </h1>
          <div className="pt-2">
            <Button type="button" variant="yellow" onClick={() => reset()}>
              {content.errors.errorCta}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}

