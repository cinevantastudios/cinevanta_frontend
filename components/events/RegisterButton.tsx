"use client";

import { useState } from "react";
import { Button, type ButtonVariant } from "@/components/ui";
import { NotifyDialog } from "@/components/events/NotifyDialog";
import { content } from "@/lib/content";

export interface RegisterButtonProps {
  eventId?: string;
  eventTitle?: string;
  variant?: ButtonVariant;
  label?: string;
  withArrow?: boolean;
  fullWidth?: boolean;
  hrefFallback?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Isolated registration entry point (Spec 9.1).
 * Currently opens NotifyDialog (or links to hrefFallback when no event exists).
 * Swap this single component when dedicated registration pages are built.
 */
export function RegisterButton({
  eventId,
  eventTitle,
  variant = "yellow",
  label = content.events.registerLabel,
  withArrow = false,
  fullWidth = false,
  hrefFallback,
  onAction,
  className,
}: RegisterButtonProps) {
  const [open, setOpen] = useState(false);

  if (!eventId && hrefFallback) {
    return (
      <Button
        href={hrefFallback}
        variant={variant}
        withArrow={withArrow}
        fullWidth={fullWidth}
        onClick={onAction}
        className={className}
      >
        {label}
      </Button>
    );
  }

  return (
    <NotifyDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          onAction?.();
        }
        setOpen(nextOpen);
      }}
      eventId={eventId}
      eventTitle={eventTitle}
      trigger={
        <Button
          type="button"
          variant={variant}
          withArrow={withArrow}
          fullWidth={fullWidth}
          className={className}
        >
          {label}
        </Button>
      }
    />
  );
}
