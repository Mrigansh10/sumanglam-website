"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page-error]", error);
  }, [error]);

  return (
    <Container size="narrow" className="py-32 text-center">
      <p className="text-sm font-medium text-accent-deep">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        This page didn&apos;t load the way it should
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
        Please try again — and if it keeps happening, we&apos;d genuinely like
        to know. Call us or drop a WhatsApp message any time.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button type="button" onClick={reset}>
          Try Again
        </Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}
