import { Container, Section, Skeleton } from "@/components/ui";

export default function EventsLoading() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-14 w-56" />
            <Skeleton className="h-6 w-full max-w-[30rem]" />
          </div>
          <Skeleton rounded="pill" className="h-12 w-60" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((idx) => (
              <Skeleton key={idx} rounded="card" className="aspect-[3/4] w-full" />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}

