"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/ui";
import { EventCard } from "@/components/events/EventCard";
import { NotifyForm } from "@/components/events/NotifyForm";
import { PastEventRow } from "@/components/events/PastEventRow";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { EventItem, EventStatus } from "@/types/api";

export interface EventsViewProps {
  initialStatus: EventStatus;
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
}

/**
 * Interactive upcoming/past events view.
 * Receives server-parsed `initialStatus` so deep links render on first paint without tab flash.
 */
export function EventsView({
  initialStatus,
  upcomingEvents,
  pastEvents,
}: EventsViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState<EventStatus>(initialStatus);

  function selectStatus(nextStatus: EventStatus) {
    setStatus(nextStatus);
    router.replace(routes.eventsByStatus(nextStatus), { scroll: false });
  }

  return (
    <div className="space-y-10">
      {/* Segmented control */}
      <div
        role="tablist"
        aria-label={content.events.tabsAriaLabel}
        className="inline-flex rounded-pill border-2 border-ink bg-white p-1"
      >
        {content.events.tabs.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              id={`tab-${tab.value}`}
              aria-selected={active}
              aria-controls={`panel-${tab.value}`}
              onClick={() => selectStatus(tab.value)}
              className={cn(
                "min-h-[2.75rem] rounded-pill px-6 text-[0.875rem] font-semibold transition-colors duration-200",
                active ? "bg-yellow text-ink" : "bg-transparent text-ink hover:bg-sand/60",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Upcoming panel */}
      {status === "upcoming" ? (
        <div
          role="tabpanel"
          id="panel-upcoming"
          aria-labelledby="tab-upcoming"
        >
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="max-w-[47.5rem] space-y-6 rounded-card border-2 border-dashed border-ink bg-white p-7 md:p-9">
              <p className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink">
                {content.events.emptyUpcoming}
              </p>
              <NotifyForm
                source="events-section"
                mode="inline"
                surface="light"
                idPrefix="events-page-notify"
              />
            </div>
          )}
        </div>
      ) : (
        <div role="tabpanel" id="panel-past" aria-labelledby="tab-past">
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {pastEvents.map((event) => (
                <PastEventRow key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState message={content.events.emptyPast} />
          )}
        </div>
      )}
    </div>
  );
}

