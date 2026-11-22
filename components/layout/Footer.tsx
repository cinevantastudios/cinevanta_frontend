import Link from "next/link";
import { Container } from "@/components/ui";
import { FooterNotifyForm } from "@/components/layout/FooterNotifyForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Wordmark } from "@/components/layout/Wordmark";
import { content } from "@/lib/content";
import { routes, site } from "@/lib/site";

/**
 * Global site footer with navigation links, studio contact placeholders, SocialLinks,
 * FooterNotifyForm, legal links, and the cropped outlined display wordmark.
 */
export function Footer() {
  return (
    <footer
      data-surface="ink"
      className="bg-ink pt-14 text-cream md:pt-[4.5rem] lg:pt-[5.5rem]"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-4">
            <Link href={routes.home} aria-label={content.nav.homeAriaLabel} className="inline-block">
              <Wordmark size="md" tone="cream" />
            </Link>
            <p className="max-w-[34ch] text-[0.9375rem] text-muted-on-ink">
              {content.footer.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="space-y-3 lg:col-span-2">
            <h2 className="text-[0.875rem] font-semibold text-cream">
              {content.footer.navHeading}
            </h2>
            <ul className="space-y-2">
              {content.footer.navLinks.map((link) => (
                <li key={link.href}>
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
          <div className="space-y-3 lg:col-span-3">
            <h2 className="text-[0.875rem] font-semibold text-cream">
              {content.footer.contactHeading}
            </h2>
            <ul className="space-y-1.5 text-[0.9375rem] text-muted-on-ink">
              <li>{site.email}</li>
              <li>{site.phone}</li>
              <li>{site.city}</li>
            </ul>
            <SocialLinks socials={site.socials} surface="ink" className="pt-2" />
          </div>

          {/* Notify form */}
          <div className="lg:col-span-3">
            <FooterNotifyForm />
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="flex flex-col gap-3 border-t border-line-on-ink py-6 text-[0.875rem] text-muted-on-ink sm:flex-row sm:items-center sm:justify-between">
          <p>{site.copyright}</p>
          <div className="flex items-center gap-6">
            <Link
              href={routes.privacy}
              className="inline-flex min-h-[2.25rem] items-center transition-colors duration-150 hover:text-yellow"
            >
              {content.footer.privacyLabel}
            </Link>
            <Link
              href={routes.terms}
              className="inline-flex min-h-[2.25rem] items-center transition-colors duration-150 hover:text-yellow"
            >
              {content.footer.termsLabel}
            </Link>
          </div>
        </div>
      </Container>

      {/* Giant cropped outlined wordmark */}
      <div
        aria-hidden="true"
        className="text-wordmark-giant w-full overflow-hidden text-center"
        style={{ height: "0.8em" }}
      >
        <Wordmark
          size="giant"
          tone="cream"
          withAsterisk={false}
          outlined
          className="leading-[0.92]"
        />
      </div>
    </footer>
  );
}
