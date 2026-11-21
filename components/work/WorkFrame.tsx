import Image from "next/image";
import { Placeholder, type PlaceholderTone } from "@/components/ui";
import { content } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/types/api";

export interface WorkFrameProps {
  item?: WorkItem;
  index: number;
  placeholderLabel?: string;
  placeholderTone?: PlaceholderTone;
  onSelect?: (item: WorkItem) => void;
}

const FRAME_ROTATIONS = [
  "xs:-rotate-2",
  "xs:rotate-[1.5deg] md:mt-7",
  "xs:-rotate-1",
] as const;

export function WorkFrame({
  item,
  index,
  placeholderLabel = "[PROJECT STILL]",
  placeholderTone = "yellow",
  onSelect,
}: WorkFrameProps) {
  const rotationClass = FRAME_ROTATIONS[index % 3] ?? "";

  if (!item) {
    return (
      <div className={cn("flex flex-col gap-4", rotationClass)}>
        <div className="aspect-[4/5] w-full overflow-hidden rounded-frame border-2 border-ink md:aspect-auto md:h-[400px]">
          <Placeholder
            tone={placeholderTone}
            ratio="auto"
            label={placeholderLabel}
            className="h-full w-full"
          />
        </div>
        <div className="space-y-1">
          <p className="font-meta text-muted">[Category • YYYY]</p>
          <p className="font-display-expanded text-[24px] leading-tight text-ink md:text-[28px]">
            [Project Title]
          </p>
        </div>
      </div>
    );
  }

  const categoryLabel = content.work.categoryLabels[item.category];
  const isDataUri = item.imageUrl.startsWith("data:");

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      className={cn(
        "group flex w-full flex-col gap-4 text-left",
        "transition-transform duration-[250ms] ease-[var(--ease-move)]",
        "hover:rotate-0 focus-visible:rotate-0 motion-reduce:transform-none",
        rotationClass,
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-frame border-2 border-ink bg-white md:aspect-auto md:h-[400px]">
        <Image
          src={item.imageUrl}
          alt={`${item.title} — ${categoryLabel} (${item.year})`}
          fill
          unoptimized={isDataUri}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="font-meta text-muted">
          {categoryLabel} • {item.year}
        </p>
        <h3 className="font-display-expanded text-[24px] leading-tight text-ink group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 md:text-[28px]">
          {item.title}
        </h3>
      </div>
    </button>
  );
}

