import type { ReactNode } from "react";
import { Sticker } from "@/components/ui/Sticker";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  title: string;
  sticker?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  sticker,
  action,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 id={id} className="font-display-expanded text-h2">
          {title}
        </h2>
        {sticker ? <Sticker>{sticker}</Sticker> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

