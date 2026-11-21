import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { enquiryTypeSchema, type EnquiryType } from "@/types/api";

export const metadata: Metadata = {
  title: content.contact.pageTitle,
  description: content.contact.pageLead,
  openGraph: {
    title: `${content.contact.pageTitle} | Cinevanta Studios`,
    description: content.contact.pageLead,
    url: "/contact",
  },
};

interface ContactPageProps {
  searchParams: Promise<{ type?: string | string[] }>;
}

function parseEnquiryType(raw: string | string[] | undefined): EnquiryType {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = enquiryTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : "film";
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const initialType = parseEnquiryType(params.type);
  const activeSocials = site.socials.filter((social) => social.href.trim().length > 0);

  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="max-w-[65ch] space-y-4">
            <h1 className="font-display-expanded text-h1 text-ink">
              {content.contact.pageTitle}
            </h1>
            <p className="text-[18px] leading-[1.6] text-muted">{content.contact.pageLead}</p>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Form column (~60%) */}
            <div className="lg:col-span-7">
              <EnquiryForm initialType={initialType} />
            </div>

            {/* Studio details column (~40%) */}
            <aside className="space-y-6 rounded-card border-2 border-ink bg-sand p-7 text-ink lg:col-span-5 lg:p-8">
              <h2 className="font-display-expanded text-[24px]">
                {content.contact.detailsHeading}
              </h2>

              <dl className="space-y-4 text-[16px]">
                <div>
                  <dt className="font-meta text-muted">Email</dt>
                  <dd className="mt-1 font-medium text-ink">{site.email}</dd>
                </div>
                <div>
                  <dt className="font-meta text-muted">Phone</dt>
                  <dd className="mt-1 font-medium text-ink">{site.phone}</dd>
                </div>
                <div>
                  <dt className="font-meta text-muted">Location</dt>
                  <dd className="mt-1 font-medium text-ink">{site.city}</dd>
                </div>
              </dl>

              {activeSocials.length > 0 ? (
                <div className="border-t border-ink/20 pt-5">
                  <p className="font-meta text-muted">Social</p>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                    {activeSocials.map((social) => {
                      const isExternal = /^https?:\/\//.test(social.href);
                      return (
                        <li key={social.label}>
                          <a
                            href={social.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-ink underline decoration-2 underline-offset-4 transition-opacity duration-150 hover:opacity-75"
                          >
                            {social.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <p className="border-t border-ink/20 pt-5 text-[14px] text-muted">
                {site.responseTime}
              </p>
            </aside>
          </div>
        </Container>
      </Section>
    </main>
  );
}

