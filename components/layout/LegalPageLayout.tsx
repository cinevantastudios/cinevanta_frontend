import type { ReactNode } from "react";
import { Container, Section } from "@/components/ui";
import { content } from "@/lib/content";

export interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

/**
 * Shared layout shell for legal routes (/privacy and /terms) so typography, container
 * width, and bordered card presentation remain identical in one place.
 */
export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="max-w-[65ch] space-y-6">
          <h1 className="font-display-expanded text-h1 text-ink">{title}</h1>
          <div className="space-y-4 rounded-card border-2 border-ink bg-white p-7 text-[1rem] leading-relaxed text-ink">
            <p className="font-semibold">{content.legal.placeholder}</p>
            {children}
          </div>
        </Container>
      </Section>
    </main>
  );
}
