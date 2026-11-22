import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { content } from "@/lib/content";
import { routes, site } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";
import { enquiryTypeSchema, type EnquiryType } from "@/types/api";

export const metadata: Metadata = createPageMetadata({
  title: content.contact.pageTitle,
  description: content.contact.pageLead,
  path: routes.contact,
});

interface ContactPageProps {
  searchParams?: Promise<{ type?: string | string[] }>;
}

/** Validates the ?type= query param on the server so the enquiry category is preselected on first paint. */
function parseEnquiryType(raw: string | string[] | undefined): EnquiryType {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = enquiryTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : "film";
}

/**
 * Contact and enquiry page.
 * Preselects the requested enquiry type on the server with zero hydration flash.
 */
export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialType = parseEnquiryType(params.type);

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

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Form column (~60%) */}
            <div className="lg:col-span-7">
              <EnquiryForm initialType={initialType} />
            </div>

            {/* Studio details column (~40%) */}
            <aside className="space-y-6 rounded-card border-2 border-ink bg-sand p-7 text-ink lg:col-span-5 lg:p-8">
              <h2 className="font-display-expanded text-[1.5rem]">
                {content.contact.detailsHeading}
              </h2>

              <dl className="space-y-4 text-[1rem]">
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
          </div>
        </Container>
      </Section>
    </main>
  );
}
