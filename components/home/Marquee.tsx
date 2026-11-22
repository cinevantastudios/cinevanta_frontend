import { content } from "@/lib/content";

/** Continuous decorative horizontal marquee band displaying studio service disciplines. */
export function Marquee() {
  const sequence = content.marquee.items.map((item) => `${item} ✦`).join(" ");

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden border-y-2 border-ink bg-ink py-5 text-yellow select-none"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <span className="font-display-expanded pr-6 text-[1.5rem] leading-none md:text-[2.125rem]">
          {sequence}
        </span>
        <span className="font-display-expanded pr-6 text-[1.5rem] leading-none md:text-[2.125rem]">
          {sequence}
        </span>
        <span className="font-display-expanded pr-6 text-[1.5rem] leading-none md:text-[2.125rem]">
          {sequence}
        </span>
        <span className="font-display-expanded pr-6 text-[1.5rem] leading-none md:text-[2.125rem]">
          {sequence}
        </span>
      </div>
    </div>
  );
}

