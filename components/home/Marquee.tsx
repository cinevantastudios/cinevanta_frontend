import { content } from "@/lib/content";

export function Marquee() {
  const sequence = content.marquee.items.map((item) => `${item} ✦`).join(" ");

  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden border-y-2 border-ink bg-ink py-5 text-yellow select-none"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <span className="font-display-expanded pr-6 text-[24px] leading-none md:text-[34px]">
          {sequence}
        </span>
        <span className="font-display-expanded pr-6 text-[24px] leading-none md:text-[34px]">
          {sequence}
        </span>
        <span className="font-display-expanded pr-6 text-[24px] leading-none md:text-[34px]">
          {sequence}
        </span>
        <span className="font-display-expanded pr-6 text-[24px] leading-none md:text-[34px]">
          {sequence}
        </span>
      </div>
    </div>
  );
}

