import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { content } from "@/lib/content";
import { routes, site } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.contact.pageTitle,
  description: content.contact.pageLead,
  path: routes.contact,
});

export interface ContactPageProps {
  searchParams?: Promise<{ type?: string | string[] }>;
}

/**
 * Basic fast-track Contact page displaying studio contact details only (no form).
 */
export default async function ContactPage(_props: ContactPageProps) {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.contact.pageTitle}
            </h1>
            <p className="text-[1.125rem] leading-[1.6] text-muted">{content.contact.pageLead}</p>
          </div>

          <aside className="space-y-6 rounded-card border-2 border-ink bg-sand p-7 text-ink lg:p-8">
            <h2 className="font-display-expanded text-[1.5rem]">
              {content.contact.detailsHeading}
            </h2>

            <dl className="grid grid-cols-1 gap-6 text-[1rem] md:grid-cols-3">
              <div>
                <dt className="font-meta text-muted">Email</dt>
                <dd className="mt-1 font-medium text-ink">{site.email}</dd>
              </div>
              <div>
                <dt className="font-meta text-muted">Phone</dt>
                <dd className="mt-1 font-medium text-ink">{site.phone}</dd>
              </div>
              <div>
                <dt className="font-meta text-muted">Address</dt>
                <dd className="mt-1 font-medium text-ink">{site.address}</dd>
              </div>
            </dl>

            {site.socials.length > 0 ? (
              <div className="border-t border-ink/20 pt-5">
                <p className="font-meta text-muted">Social</p>
                <SocialLinks socials={site.socials} surface="light" className="mt-2 gap-x-5" />
              </div>
            ) : null}

            <p className="border-t border-ink/20 pt-5 text-[0.875rem] text-muted">
              {site.responseTime}
            </p>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
