"use client";

import { useEffect } from "react";
import { Button, Container, Section } from "@/components/ui";
import { reportError } from "@/lib/analytics";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";

/**
 * Route-level error boundary.
 * Logs the full error for diagnostics while showing a calm, actionable recovery screen
 * without exposing any technical details to the user.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError("ErrorPage", error, { digest: error.digest });
  }, [error]);

  return (
    <main id="main-content">
      <Section tone="cream" className="py-20 md:py-28">
        <Container className="space-y-6">
          <h1 className="font-display-expanded text-h2 text-ink">
            {content.errors.errorTitle}
          </h1>
          <p className="max-w-[52ch] text-[1.125rem] text-muted">
            {content.errors.errorDescription}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button type="button" variant="yellow" onClick={() => reset()}>
              {content.errors.errorCta}
            </Button>
            <Button href={routes.home} variant="ink" withArrow>
              {content.errors.errorHomeCta}
            </Button>
            <Button href={routes.contact} variant="outline">
              {content.errors.errorContactCta}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
