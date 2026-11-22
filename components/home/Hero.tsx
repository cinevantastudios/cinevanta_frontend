"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { Button, Container, Sticker } from "@/components/ui";
import { HeroMedia } from "@/components/home/HeroMedia";
import { RotatingBadge } from "@/components/home/RotatingBadge";
import { content } from "@/lib/content";
import type { ShowreelMedia } from "@/lib/site";

export interface HeroProps {
  showreel: ShowreelMedia | null;
}

const EASE_MOVE = [0.22, 0.8, 0.2, 1] as const;

export function Hero({ showreel }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative bg-cream pt-10 pb-14 md:pt-12 md:pb-16 lg:pt-14 lg:pb-[65px]">
        <Container className="relative">
          {/* Desktop rotating badge: right 3.5rem (50.4px), top 2.5rem (36px) */}
          <m.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.78 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.48, ease: EASE_MOVE }}
            className="hidden lg:block lg:absolute lg:top-10 lg:right-14 lg:z-[2]"
          >
            <RotatingBadge />
          </m.div>

          <div className="max-w-[900px] space-y-6">
            <div>
              <Sticker rotation={-3}>{content.hero.kicker}</Sticker>
            </div>

            <h1 className="font-display-expanded text-h1 text-ink">
              {content.hero.headlineLines.map((line, index) => {
                const isOutlined = index === content.hero.outlinedLineIndex;
                const isFirst = index === 0;
                const breakBefore = index === content.hero.outlinedLineIndex;

                return (
                  <span key={line}>
                    {breakBefore ? <br className="hidden lg:block" /> : null}
                    {breakBefore ? " " : null}
                    <span className="inline-block overflow-hidden align-bottom">
                      <m.span
                        className={isOutlined ? "text-outline-ink inline-block" : "inline-block"}
                        initial={prefersReducedMotion ? false : { y: "105%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_MOVE }}
                      >
                        {line}
                        {isFirst ? "\u00A0" : ""}
                      </m.span>
                    </span>
                  </span>
                );
              })}
            </h1>

            <p className="max-w-[46ch] text-[16.2px] leading-[1.6] text-muted">
              {content.hero.lead}
            </p>

            <m.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.85, ease: "easeOut" }}
              className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:gap-4"
            >
              <Button
                href={content.hero.primaryCta.href}
                variant="ink"
                withArrow
                className="w-full md:w-auto"
              >
                {content.hero.primaryCta.label}
              </Button>
              <Button
                href={content.hero.secondaryCta.href}
                variant="yellow"
                withArrow
                className="w-full md:w-auto"
              >
                {content.hero.secondaryCta.label}
              </Button>
            </m.div>
          </div>

          {/* Hero media block + mobile badge overlay */}
          <div className="relative mt-10 md:mt-12 lg:mt-14">
            <m.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.78 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.48, ease: EASE_MOVE }}
              className="absolute -top-6 right-4 z-[3] lg:hidden"
            >
              <RotatingBadge />
            </m.div>
            <HeroMedia showreel={showreel} />
          </div>
        </Container>
      </section>
    </LazyMotion>
  );
}

