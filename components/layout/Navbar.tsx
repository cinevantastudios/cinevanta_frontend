"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Container } from "@/components/ui";
import { Wordmark } from "@/components/layout/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NotifyDialog } from "@/components/events/NotifyDialog";
import { RegisterButton } from "@/components/events/RegisterButton";
import { content } from "@/lib/content";
import { routes, uiConfig } from "@/lib/site";
import { cn, isNavRouteActive } from "@/lib/utils";

export interface NavbarProps {
  nextEvent?: { id: string; title: string } | null;
}

export function Navbar({ nextEvent = null }: NavbarProps) {
  const pathname = usePathname() ?? routes.home;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNotifyOpen, setMobileNotifyOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Track scroll direction while skipping redundant React state updates on unchanged frames.
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function handleScroll() {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - lastScrollYRef.current;

      let nextHidden = hiddenRef.current;
      if (menuOpen || currentY <= uiConfig.navScrollBorderThresholdPx) {
        nextHidden = false;
      } else if (delta > uiConfig.navScrollDeltaPx && currentY > uiConfig.navHideThresholdPx) {
        nextHidden = true;
      } else if (delta < -uiConfig.navScrollDeltaPx) {
        nextHidden = false;
      }

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setHidden(nextHidden);
      }

      lastScrollYRef.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Persistent 3px ink bottom border keeps the header divider visible across every route. */}
      <header
        data-hidden={hidden && !menuOpen ? "true" : "false"}
        className={cn(
          "sticky top-0 z-[var(--z-navbar)] h-20 w-full border-b-[3px] border-ink bg-cream",
          "transition-transform duration-200 ease-[var(--ease-move)]",
          "motion-reduce:transition-none",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <Container className="flex h-full items-center justify-between gap-6">
          <Link
            href={routes.home}
            aria-label={content.nav.homeAriaLabel}
            className="inline-flex min-h-[40px] items-center"
          >
            <Wordmark size="sm" tone="ink" />
          </Link>

          {/* Primary desktop links: subtle lift/tilt on hover matching Services cards, slight size bump on active route. */}
          <nav aria-label={content.nav.primaryNavLabel} className="hidden items-center gap-8 md:flex">
            {content.nav.links.map((item) => {
              const isActive = isNavRouteActive(pathname, item.href, item.matchActive);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-[40px] items-center text-ink",
                    "transition-transform duration-200 ease-[var(--ease-move)]",
                    "hover:-translate-y-0.5 hover:rotate-[1deg]",
                    "focus-visible:-translate-y-0.5 focus-visible:rotate-[1deg]",
                    "motion-reduce:transform-none",
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

          <div className="hidden md:block">
            <RegisterButton
              eventId={nextEvent?.id}
              eventTitle={nextEvent?.title}
              hrefFallback={routes.events}
              variant="yellow"
              label={content.nav.registerLabel}
            />
          </div>

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
        onRegister={() => setMobileNotifyOpen(true)}
        pathname={pathname}
        nextEvent={nextEvent}
        triggerRef={menuTriggerRef}
      />

      {nextEvent ? (
        <NotifyDialog
          open={mobileNotifyOpen}
          onOpenChange={setMobileNotifyOpen}
          eventId={nextEvent.id}
          eventTitle={nextEvent.title}
        />
      ) : null}
    </>
  );
}
