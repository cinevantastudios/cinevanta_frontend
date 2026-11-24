import Link from "next/link";
import { Container } from "@/components/ui";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Wordmark } from "@/components/layout/Wordmark";
import { content } from "@/lib/content";
import { routes, site } from "@/lib/site";

/**
 * Basic fast-track global site footer with brand summary, navigation links,
 * studio contact details, social links, and copyright bar.
 */
export function Footer() {
  return (
    <footer
      data-surface="ink"
      className="bg-ink pt-12 text-cream md:pt-14"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-5">
            <Link href={routes.home} aria-label={content.nav.homeAriaLabel} className="inline-block">
              <Wordmark size="md" tone="cream" />
            </Link>
            <p className="max-w-[34ch] text-[0.9375rem] text-muted-on-ink">
              {content.footer.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="space-y-3 lg:col-span-3">
            <h2 className="text-[0.875rem] font-semibold text-cream">
              {content.footer.navHeading}
            </h2>
            <ul className="space-y-2">
              {content.footer.navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[2.25rem] items-center text-[0.9375rem] text-muted-on-ink transition-colors duration-150 hover:text-yellow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + socials */}
          <div className="space-y-3 lg:col-span-4">
            <h2 className="text-[0.875rem] font-semibold text-cream">
              {content.footer.contactHeading}
            </h2>
            <ul className="space-y-1.5 text-[0.9375rem] text-muted-on-ink">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-150 hover:text-yellow"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="transition-colors duration-150 hover:text-yellow"
                >
                  {site.phone}
                </a>
              </li>
              <li>{site.address}</li>
            </ul>
            <SocialLinks socials={site.socials} surface="ink" className="pt-2" />
          </div>
        </div>
      </Container>

      {/* Bottom copyright bar */}
      <div className="border-t border-line-on-ink">
        <Container>
          <div className="py-6 text-[0.875rem] text-muted-on-ink">
            <p>{site.copyright}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
