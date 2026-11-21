import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.legal.termsTitle,
  description: `Terms of use for ${site.name}.`,
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="max-w-[65ch] space-y-6">
          <h1 className="font-display-expanded text-h1 text-ink">
            {content.legal.termsTitle}
          </h1>
          <div className="space-y-4 rounded-card border-2 border-ink bg-white p-7 text-[16px] leading-relaxed text-ink">
            <p className="font-semibold">{content.legal.placeholder}</p>
            <p className="text-muted">
              Published by {site.name}, {site.city}. Contact {site.email} for enquiries regarding
              these terms.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}

