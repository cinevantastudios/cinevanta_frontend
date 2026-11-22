"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui";
import { Wordmark } from "@/components/layout/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { cn, isNavRouteActive } from "@/lib/utils";

export interface NavbarProps {
  nextEvent?: { id: string; title: string } | null;
}

/**
 * Basic fast-track sticky Navbar without header CTA/Register button.
 * Provides primary one-page scroll links and the mobile navigation drawer.
 */
export function Navbar(_props: NavbarProps) {
  const pathname = usePathname() ?? routes.home;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <header
        data-hidden="false"
        className="sticky top-0 z-[var(--z-navbar)] h-20 w-full border-b-[3px] border-ink bg-cream"
      >
        <Container className="flex h-full items-center justify-between gap-6">
          <Link
            href={routes.home}
            aria-label={content.nav.homeAriaLabel}
            className="inline-flex min-h-[40px] items-center"
          >
            <Wordmark size="sm" tone="ink" />
          </Link>

          <nav aria-label={content.nav.primaryNavLabel} className="hidden items-center gap-7 md:flex">
            {content.nav.links.map((item) => {
              const isActive = isNavRouteActive(pathname, item.href, item.matchActive);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-[40px] items-center text-ink transition-opacity duration-150 hover:opacity-75",
                    isActive
                      ? "text-[15.5px] font-semibold"
                      : "text-[13.5px] font-medium",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={content.nav.openMenuLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-yellow text-ink transition-colors duration-200 hover:bg-ink hover:text-cream md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        pathname={pathname}
        triggerRef={menuTriggerRef}
      />
    </>
  );
}
