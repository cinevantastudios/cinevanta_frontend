import Link from "next/link";
import { Container } from "@/components/ui";
import { Wordmark } from "@/components/layout/Wordmark";
import { FooterNotifyForm } from "@/components/layout/FooterNotifyForm";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

const FOOTER_NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function Footer() {
  const activeSocials = site.socials.filter((social) => social.href.trim().length > 0);

  return (
    <footer
      data-surface="ink"
      className="bg-ink pt-14 text-cream md:pt-[72px] lg:pt-[88px]"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-4">
            <Link href="/" aria-label="Cinevanta Studios home" className="inline-block">
              <Wordmark size="md" tone="cream" />
            </Link>
            <p className="max-w-[34ch] text-[15px] text-muted-on-ink">
              {content.footer.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="space-y-3 lg:col-span-2">
            <h2 className="text-[14px] font-semibold text-cream">
              {content.footer.navHeading}
            </h2>
            <ul className="space-y-2">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[36px] items-center text-[15px] text-muted-on-ink transition-colors duration-150 hover:text-yellow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + socials */}
          <div className="space-y-3 lg:col-span-3">
            <h2 className="text-[14px] font-semibold text-cream">
              {content.footer.contactHeading}
            </h2>
            <ul className="space-y-1.5 text-[15px] text-muted-on-ink">
              <li>{site.email}</li>
              <li>{site.phone}</li>
              <li>{site.city}</li>
            </ul>
            {activeSocials.length > 0 ? (
              <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                {activeSocials.map((social) => {
                  const isExternal = /^https?:\/\//.test(social.href);
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex min-h-[36px] items-center text-[14px] font-medium text-cream underline decoration-line-on-ink decoration-1 underline-offset-4 transition-colors duration-150 hover:text-yellow hover:decoration-yellow"
                      >
                        {social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Notify form */}
          <div className="lg:col-span-3">
            <FooterNotifyForm />
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="flex flex-col gap-3 border-t border-line-on-ink py-6 text-[14px] text-muted-on-ink sm:flex-row sm:items-center sm:justify-between">
          <p>{site.copyright}</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="inline-flex min-h-[36px] items-center transition-colors duration-150 hover:text-yellow"
            >
              {content.footer.privacyLabel}
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-[36px] items-center transition-colors duration-150 hover:text-yellow"
            >
              {content.footer.termsLabel}
            </Link>
          </div>
        </div>
      </Container>

      {/* Giant cropped outlined wordmark (Spec 6) */}
      <div
        aria-hidden="true"
        className="w-full overflow-hidden text-center"
        style={{ height: "0.8em", fontSize: "clamp(72px, 12.4vw, 158px)" }}
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

