import { Container, Section, Skeleton } from "@/components/ui";

export default function RootLoading() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16">
        <Container className="space-y-8">
          <Skeleton rounded="pill" className="h-8 w-40" />
          <Skeleton className="h-24 w-full max-w-[48.75rem]" />
          <Skeleton className="h-7 w-full max-w-[28.75rem]" />
          <div className="flex gap-4">
            <Skeleton rounded="pill" className="h-12 w-40" />
            <Skeleton rounded="pill" className="h-12 w-44" />
          </div>
          <Skeleton rounded="card" className="aspect-video w-full" />
        </Container>
      </Section>
    </main>
  );
}

