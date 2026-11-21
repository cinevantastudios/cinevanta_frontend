"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { Wordmark } from "@/components/layout/Wordmark";
import { content } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onRegister?: () => void;
  pathname: string;
  nextEvent?: { id: string; title: string } | null;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  open,
  onClose,
  onRegister,
  pathname,
  nextEvent,
  triggerRef,
}: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        triggerRef?.current?.focus();
      }
      return;
    }

    wasOpenRef.current = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;

      const focusables = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, triggerRef]);

  return (
    <div
      id="mobile-menu"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[60] flex flex-col justify-between bg-yellow text-ink md:hidden",
        "transition-[clip-path,visibility] duration-[450ms] ease-[var(--ease-move)]",
        "motion-reduce:transition-none",
        open
          ? "visible [clip-path:circle(150%_at_calc(100%-42px)_40px)]"
          : "pointer-events-none invisible [clip-path:circle(0%_at_calc(100%-42px)_40px)]",
      )}
    >
      <div className="flex h-20 items-center justify-between px-5">
        <Link
          href="/"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          aria-label="Cinevanta Studios home"
        >
          <Wordmark size="sm" tone="ink" />
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          aria-label={content.nav.closeMenuLabel}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink transition-colors duration-200 hover:bg-ink hover:text-cream"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile navigation" className="flex flex-1 flex-col justify-center px-5">
        <ul className="space-y-4">
          {content.nav.links.map((item) => {
            const isActive =
              item.href !== "/#services" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "font-display-expanded text-h2 inline-block py-1 text-ink",
                    isActive && "underline decoration-4 underline-offset-8",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-5 pb-8">
        {nextEvent ? (
          <Button
            type="button"
            variant="ink"
            withArrow
            fullWidth
            tabIndex={open ? 0 : -1}
            onClick={() => {
              onClose();
              onRegister?.();
            }}
          >
            {content.nav.registerLabel}
          </Button>
        ) : (
          <Button
            href="/events"
            variant="ink"
            withArrow
            fullWidth
            tabIndex={open ? 0 : -1}
            onClick={onClose}
          >
            {content.nav.registerLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
