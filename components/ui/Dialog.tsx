"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel?: string;
  size?: "sm" | "lg";
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "md:max-w-[480px]",
  lg: "md:max-w-[760px]",
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = "Close",
  size = "sm",
  trigger,
  children,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            "fixed inset-0 z-[100] bg-ink/60",
            "data-[state=open]:animate-[dialog-overlay-in_200ms_ease-out]",
            "data-[state=closed]:animate-[dialog-overlay-out_150ms_ease-out]",
            "motion-reduce:animate-none",
          )}
        />
        <RadixDialog.Content
          className={cn(
            "fixed z-[100] flex max-h-[90vh] w-full flex-col overflow-y-auto bg-cream text-ink",
            // Mobile bottom sheet
            "right-0 bottom-0 left-0 rounded-t-[28px] rounded-b-none border-x-2 border-t-2 border-b-0 border-ink p-6",
            // Desktop centered modal
            "md:top-1/2 md:right-auto md:bottom-auto md:left-1/2 md:w-[calc(100%-32px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-card md:border-2 md:p-8",
            "data-[state=open]:animate-[dialog-content-in_200ms_cubic-bezier(0.22,0.8,0.2,1)]",
            "data-[state=closed]:animate-[dialog-content-out_150ms_ease-out]",
            "motion-reduce:animate-none",
            sizeClasses[size],
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <RadixDialog.Title className="font-display-expanded text-[24px] leading-tight text-ink">
                {title}
              </RadixDialog.Title>
              {description ? (
                <RadixDialog.Description className="text-[15px] leading-relaxed text-muted">
                  {description}
                </RadixDialog.Description>
              ) : null}
            </div>
            <RadixDialog.Close asChild>
              <button
                type="button"
                aria-label={closeLabel}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink transition-colors duration-200 hover:bg-yellow"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

