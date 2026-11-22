import { Container, Section, Skeleton } from "@/components/ui";

/**
 * Route-level loading skeleton for the Services page (/services).
 */
export default function ServicesLoading() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="space-y-4">
            <Skeleton rounded="pill" className="h-8 w-48" />
            <Skeleton className="h-14 w-64" />
            <Skeleton className="h-6 w-full max-w-[36rem]" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <Skeleton key={idx} rounded="pill" className="h-11 w-36" />
            ))}
          </div>
          <div className="space-y-10">
            {[0, 1, 2].map((idx) => (
              <Skeleton key={idx} rounded="card" className="h-[24rem] w-full" />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
