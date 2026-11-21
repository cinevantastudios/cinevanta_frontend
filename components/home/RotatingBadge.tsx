import { content } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface RotatingBadgeProps {
  className?: string;
}

export function RotatingBadge({ className }: RotatingBadgeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative inline-block h-[96px] w-[96px] rotate-[14deg] select-none lg:h-[150px] lg:w-[150px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <path
            id="cinevanta-badge-circle"
            d="M 75, 75 m -53, 0 a 53,53 0 1,1 106,0 a 53,53 0 1,1 -106,0"
          />
        </defs>

        {/* Yellow stamp disc with 2px ink stroke */}
        <circle cx="75" cy="75" r="73" fill="#FFC93C" stroke="#15110E" strokeWidth="2" />

        {/* Rotating circular text ring */}
        <g className="animate-badge-spin origin-center" style={{ transformOrigin: "75px 75px" }}>
          <text
            fill="#15110E"
            fontSize="12"
            fontWeight="500"
            letterSpacing="3"
            style={{ fontFamily: "var(--font-dm-mono), ui-monospace, monospace" }}
          >
            <textPath href="#cinevanta-badge-circle" startOffset="0%">
              {content.hero.badgeRingText}
            </textPath>
          </text>
        </g>

        {/* Static center mark */}
        <text
          x="75"
          y="77"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#15110E"
          fontSize="38"
          fontWeight="900"
          style={{
            fontFamily: 'var(--font-archivo), "Arial Black", Impact, sans-serif',
            fontStretch: "125%",
          }}
        >
          {content.hero.badgeCenter}
        </text>
      </svg>
    </div>
  );
}

