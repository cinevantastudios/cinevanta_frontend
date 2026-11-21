import { Container } from "@/components/ui";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export function Partners() {
  if (site.partners.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={content.partners.label}
      className="border-b-2 border-ink bg-cream py-12 md:py-16"
    >
      <Container className="space-y-6 text-center">
        <p className="font-meta text-muted">{content.partners.label}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-14">
          {site.partners.map((partner) => (
            <li
              key={partner}
              className="font-display-expanded text-[24px] text-faint md:text-[28px]"
            >
              {partner}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

