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
import { cn } from "@/lib/utils";

export interface NavbarProps {
  nextEvent?: { id: string; title: string } | null;
}

export function Navbar({ nextEvent = null }: NavbarProps) {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNotifyOpen, setMobileNotifyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function handleScroll() {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - lastScrollYRef.current;

      setScrolled(currentY > 8);

      if (menuOpen || currentY <= 8) {
        setHidden(false);
      } else if (delta > 6 && currentY > 80) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
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
      <header
        data-hidden={hidden && !menuOpen ? "true" : "false"}
        className={cn(
          "sticky top-0 z-[50] h-20 w-full bg-cream",
          "transition-[transform,border-color] duration-200 ease-[var(--ease-move)]",
          "motion-reduce:transition-none",
          scrolled ? "border-b border-ink" : "border-b border-transparent",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <Container className="flex h-full items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Cinevanta Studios home"
            className="inline-flex min-h-[44px] items-center"
          >
            <Wordmark size="sm" tone="ink" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {content.nav.links.map((item) => {
              const isActive =
                item.href !== "/#services" &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-[44px] items-center text-[15px] font-medium text-ink transition-opacity duration-150 hover:opacity-75",
                    isActive && "underline decoration-ink decoration-2 underline-offset-[6px]",
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
              hrefFallback="/events"
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
