import { Instagram, Linkedin, Youtube } from "lucide-react";
import type { ReactNode } from "react";
import type { SocialLink } from "@/lib/site";
import { cn, isExternalHref, isSafeHref } from "@/lib/utils";

export interface SocialLinksProps {
  socials: SocialLink[];
  /** Visual surface determines icon contrast and hover styling. */
  surface?: "light" | "ink";
  className?: string;
}

/** Brand icon size classes shared across all social links. */
const SOCIAL_ICON_CLASS = "h-5 w-5 shrink-0";

/**
 * Resolves a social platform label to its corresponding icon element.
 * Returns `null` for unrecognised labels so the caller can fall back to text.
 */
function renderSocialIcon(label: string): ReactNode | null {
  switch (label.trim().toLowerCase()) {
    case "instagram":
      return <Instagram className={SOCIAL_ICON_CLASS} aria-hidden="true" />;
    case "youtube":
      return <Youtube className={SOCIAL_ICON_CLASS} aria-hidden="true" />;
    case "linkedin":
      return <Linkedin className={SOCIAL_ICON_CLASS} aria-hidden="true" />;
    case "x":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={SOCIAL_ICON_CLASS}
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Shared social media icon link list reused by Footer and ContactPage.
 * Filters out blank or unsafe URLs and applies `rel="noopener noreferrer"` on external destinations.
 */
export function SocialLinks({ socials, surface = "light", className }: SocialLinksProps) {
  const activeSocials = socials.filter((social) => {
    const trimmed = social.href.trim();
    return trimmed.length > 0 && (trimmed === "#" || isSafeHref(trimmed));
  });

  if (activeSocials.length === 0) {
    return null;
  }

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {activeSocials.map((social) => {
        const isExternal = isExternalHref(social.href);
        const icon = renderSocialIcon(social.label);
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={social.label}
              title={social.label}
              className={cn(
                "inline-flex items-center justify-center rounded-sm transition-colors duration-150",
                surface === "ink"
                  ? "min-h-[2.25rem] min-w-[2.25rem] text-cream hover:text-yellow"
                  : "min-h-[2.75rem] min-w-[2.75rem] text-ink hover:opacity-75",
              )}
            >
              {icon ?? <span className="text-[0.875rem] font-medium">{social.label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
