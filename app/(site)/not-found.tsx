import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function SiteNotFound() {
  return (
    <Container size="narrow" className="py-32 text-center">
      <p className="text-sm font-medium text-accent-deep">404</p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        This page has moved on
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist — but the
        inspiration that brought you here does.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/inspiration">Explore Inspirations</Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}
