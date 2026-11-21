import { RegisterButton } from "@/components/events/RegisterButton";
import { content } from "@/lib/content";
import { cn, formatEventDateParts } from "@/lib/utils";
import type { EventItem } from "@/types/api";

export interface TicketCardProps {
  event: EventItem;
  notchColorClass?: string;
  className?: string;
}

export function TicketCard({
  event,
  notchColorClass = "bg-ink",
  className,
}: TicketCardProps) {
  const { day, monthYear, time } = formatEventDateParts(event.date);

  return (
    <article
      className={cn(
        "relative flex w-full max-w-[760px] flex-col overflow-hidden rounded-card border-2 border-ink bg-yellow text-ink",
        "sm:flex-row sm:-rotate-[1.5deg]",
        "transition-transform duration-[250ms] ease-[var(--ease-move)]",
        "sm:hover:-translate-y-1 sm:hover:-rotate-[0.5deg] motion-reduce:transform-none",
        className,
      )}
    >
      {/* Left main ticket body */}
      <div className="flex flex-1 flex-col justify-between gap-5 p-7 sm:p-9">
        <div className="space-y-2">
          <span className="font-meta inline-block text-ink">
            {content.events.upcomingBadge}
          </span>
          <div className="flex items-end gap-4 pt-1">
            <span className="font-display-expanded text-ticket-date text-ink">{day}</span>
            <span className="font-display-expanded pb-1.5 text-[24px] leading-none text-ink sm:text-[30px]">
              {monthYear}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display-expanded text-[20px] leading-tight text-ink sm:text-[22px]">
            {event.title}
          </h3>
          <p className="text-[14px] font-medium text-ink/85">
            {event.venue} • {time}
          </p>
        </div>
      </div>

      {/* Perforated tear line + notches */}
      <div
        aria-hidden="true"
        className="relative border-t-[3px] border-dashed border-ink sm:border-t-0 sm:border-l-[3px]"
      >
        <span
          className={cn(
            "absolute -top-3.5 -left-3.5 h-6 w-6 rounded-full border-2 border-ink sm:-top-3.5 sm:-left-[13px]",
            notchColorClass,
          )}
        />
        <span
          className={cn(
            "absolute -top-3.5 -right-3.5 h-6 w-6 rounded-full border-2 border-ink sm:top-auto sm:right-auto sm:-bottom-3.5 sm:-left-[13px]",
            notchColorClass,
          )}
        />
      </div>

      {/* Right ticket stub */}
      <div className="flex shrink-0 items-center justify-center bg-cream p-6 sm:w-[150px] sm:p-5">
        <RegisterButton
          eventId={event.id}
          eventTitle={event.title}
          variant="ink"
          label={content.events.registerLabel}
          fullWidth
          className="sm:w-auto"
        />
      </div>
    </article>
  );
}

