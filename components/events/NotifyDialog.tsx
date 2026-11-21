"use client";

import type { ReactNode } from "react";
import { Dialog } from "@/components/ui";
import { NotifyForm } from "@/components/events/NotifyForm";
import { content } from "@/lib/content";

export interface NotifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string;
  eventTitle?: string;
  trigger?: ReactNode;
}

export function NotifyDialog({
  open,
  onOpenChange,
  eventId,
  eventTitle,
  trigger,
}: NotifyDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={content.notify.dialogTitle}
      description={content.notify.dialogDescription(eventTitle)}
      closeLabel={content.notify.closeLabel}
      size="sm"
      trigger={trigger}
    >
      <NotifyForm
        eventId={eventId}
        source="notify-dialog"
        mode="dialog"
        idPrefix={eventId ? `notify-${eventId}` : "notify-dialog"}
      />
    </Dialog>
  );
}
