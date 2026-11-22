import { Placeholder, SafeImage, type PlaceholderTone } from "@/components/ui";
import { content } from "@/lib/content";
import { mediaConfig } from "@/lib/site";
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

/**
 * Portfolio card rendered either as an interactive tilted still button or an intentional
 * placeholder slot when fewer than three featured items exist.
 */
export function WorkFrame({
  item,
  index,
  placeholderLabel = content.work.placeholderStillLabel,
  placeholderTone = "yellow",
  onSelect,
}: WorkFrameProps) {
  const rotationClass = FRAME_ROTATIONS[index % 3] ?? "";

  if (!item) {
    return (
      <div className={cn("flex flex-col gap-4", rotationClass)}>
        <div className="aspect-[4/5] w-full overflow-hidden rounded-frame border-2 border-ink md:aspect-auto md:h-[25rem]">
          <Placeholder
            tone={placeholderTone}
            ratio="auto"
            label={placeholderLabel}
            className="h-full w-full"
          />
        </div>
        <div className="space-y-1">
          <p className="font-meta text-muted">{content.work.placeholderMetaLabel}</p>
          <p className="font-display-expanded text-[1.5rem] leading-tight text-ink md:text-[1.75rem]">
            {content.work.placeholderTitleLabel}
          </p>
        </div>
      </div>
    );
  }

  const categoryLabel = content.work.categoryLabels[item.category];

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
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-frame border-2 border-ink bg-white md:aspect-auto md:h-[25rem]">
        <SafeImage
          src={item.imageUrl}
          alt={`${item.title} — ${categoryLabel} (${item.year})`}
          fill
          sizes={mediaConfig.gridCardSizes}
          className="object-cover"
          fallbackLabel={placeholderLabel}
          fallbackTone={placeholderTone}
          fallbackRatio="auto"
        />
      </div>
      <div className="space-y-1">
        <p className="font-meta text-muted">
          {categoryLabel} • {item.year}
        </p>
        <h3 className="font-display-expanded text-[1.5rem] leading-tight text-ink group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 md:text-[1.75rem]">
          {item.title}
        </h3>
      </div>
    </button>
  );
}
