import { Button, Container, Placeholder, SafeImage, Sticker } from "@/components/ui";
import { content } from "@/lib/content";
import { mediaConfig, type ShowreelMedia } from "@/lib/site";

export interface HeroProps {
  showreel: ShowreelMedia | null;
}

/**
 * Basic fast-track Hero section.
 * Presents the studio kicker, headline, lead copy, primary/secondary CTAs,
 * and a featured showreel/trailer preview frame.
 */
export function Hero({ showreel }: HeroProps) {
  return (
    <section className="border-b-2 border-ink bg-cream pt-10 pb-14 md:pt-12 md:pb-16 lg:pt-14 lg:pb-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Headline & primary actions */}
          <div className="space-y-6 lg:col-span-7">
            <div>
              <Sticker rotation={0}>{content.hero.kicker}</Sticker>
            </div>

            <h1 className="font-display-expanded text-h1 text-ink">
              {content.hero.headlineLines.join(" ")}
            </h1>

            <p className="max-w-[50ch] text-[1.0625rem] leading-[1.6] text-muted">
              {content.hero.lead}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Button
                href={content.hero.primaryCta.href}
                variant="ink"
                withArrow
                className="w-full sm:w-auto"
              >
                {content.hero.primaryCta.label}
              </Button>
              <Button
                href={content.hero.secondaryCta.href}
                variant="yellow"
                withArrow
                className="w-full sm:w-auto"
              >
                {content.hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Featured trailer / showreel preview card */}
          <div className="lg:col-span-5">
            {showreel?.posterUrl ? (
              <a
                href={showreel.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-card border-2 border-ink bg-white p-3 transition-colors duration-150 hover:bg-sand"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border-2 border-ink bg-ink">
                  <SafeImage
                    src={showreel.posterUrl}
                    alt="Kutumb: The Family — Official Trailer"
                    fill
                    sizes={mediaConfig.dialogHeroSizes}
                    className="object-cover"
                    fallbackLabel={content.hero.showreelPlaceholder}
                  />
                </div>
                <div className="flex items-center justify-between px-2 pt-3 pb-1">
                  <span className="font-meta text-ink">
                    Kutumb: The Family • Watch Trailer ↗
                  </span>
                  <span className="font-meta text-muted">{content.hero.kicker}</span>
                </div>
              </a>
            ) : (
              <div className="overflow-hidden rounded-card border-2 border-ink bg-white p-3">
                <div className="overflow-hidden rounded-[16px] border-2 border-ink">
                  <Placeholder
                    tone="ink"
                    ratio="16/9"
                    label={content.hero.showreelPlaceholder}
                  />
                </div>
                <div className="flex items-center justify-between px-2 pt-3 pb-1">
                  <span className="font-meta text-ink">{content.hero.showreelLabel}</span>
                  <span className="font-meta text-muted">{content.hero.kicker}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
