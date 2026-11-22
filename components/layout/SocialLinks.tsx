import type { SocialLink } from "@/lib/site";
import { cn, isExternalHref, isSafeHref } from "@/lib/utils";

export interface SocialLinksProps {
  socials: SocialLink[];
  /** Visual surface determines link and underline contrast styling. */
  surface?: "light" | "ink";
  className?: string;
}

/**
 * Shared social media link list reused by Footer and ContactPage.
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
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}>
      {activeSocials.map((social) => {
        const isExternal = isExternalHref(social.href);
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "inline-flex items-center transition-colors duration-150",
                surface === "ink"
                  ? "min-h-[2.25rem] text-[0.875rem] font-medium text-cream underline decoration-line-on-ink decoration-1 underline-offset-4 hover:text-yellow hover:decoration-yellow"
                  : "min-h-[2.75rem] text-[0.9375rem] font-semibold text-ink underline decoration-2 underline-offset-4 hover:opacity-75",
              )}
            >
              {social.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
