"use client";

import { useRef, useEffect } from "react";
import { StarRating } from "@/components/shared/star-rating";
import { ReviewForm } from "@/components/shared/review-form";
import { Reveal } from "@/components/motion/reveal";
import { Heading } from "@/components/layout/heading";
import { siteConfig } from "@/lib/site";
import type { GooglePlaceData, GoogleReview } from "@/server/google-reviews";
import type { Review } from "@/lib/db-types";

// ── Infinite-scroll ticker ────────────────────────────────────────────────────

function ReviewTicker({ reviews }: { reviews: GoogleReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);       // hover or drag
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const SPEED = 0.5; // px per frame ≈ 30 px/s at 60 fps
    let raf: number;

    const tick = () => {
      if (!pausedRef.current) {
        el.scrollLeft += SPEED;
        // seamless loop — content is duplicated, so half-way = start
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Normalize scroll into the first half after interaction ends
  const normalizeScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (el.scrollLeft < 0) el.scrollLeft += half;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
  };

  // Pointer-drag handlers
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    pausedRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = trackRef.current?.scrollLeft ?? 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !trackRef.current) return;
    trackRef.current.scrollLeft = startScrollRef.current + (startXRef.current - e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    pausedRef.current = false;
    normalizeScroll();
    e.currentTarget.style.cursor = "grab";
  };

  // Trackpad two-finger horizontal swipe: pause while scrolling, resume after idle
  const onWheel = () => {
    pausedRef.current = true;
    clearTimeout(wheelTimerRef.current);
    wheelTimerRef.current = setTimeout(() => {
      normalizeScroll();
      pausedRef.current = false;
    }, 800);
  };

  const doubled = [...reviews, ...reviews];

  return (
    <div
      ref={trackRef}
      className="overflow-x-scroll cursor-grab select-none"
      style={{ scrollbarWidth: "none" }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { if (!draggingRef.current) pausedRef.current = false; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <div className="flex gap-4 w-max py-1 px-5 sm:px-8">
        {doubled.map((r, i) => (
          <div
            key={i}
            className="w-72 flex-none rounded-lg border border-sand-dark/40 bg-background p-5 flex flex-col gap-3"
          >
            <StarRating value={r.rating} size="sm" />
            <p className="flex-1 text-sm leading-relaxed text-ink-soft">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink">{r.authorName}</p>
              <div className="flex items-center gap-1.5">
                {r.relativeTime && (
                  <span className="text-xs text-ink-soft/60">{r.relativeTime}</span>
                )}
                <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                  Google
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

type Props = {
  googleData: GooglePlaceData | null;
  siteReviews: Review[];
};

export function ReviewsSection({ googleData, siteReviews }: Props) {
  const hasGoogleReviews = googleData && googleData.reviews.length > 0;
  const hasSiteReviews = siteReviews.length > 0;

  return (
    <div className="space-y-16">
      {/* Aggregate rating + link */}
      {hasGoogleReviews && googleData && (
        <Reveal>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="font-display text-5xl font-medium text-ink">
                {googleData.rating.toFixed(1)}
              </p>
              <StarRating value={Math.round(googleData.rating)} />
              <p className="mt-1 text-sm text-ink-soft">
                {googleData.userRatingsTotal.toLocaleString()} reviews on Google
              </p>
            </div>
            <a
              href={siteConfig.contact.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent-deep underline underline-offset-2 hover:text-accent-deep/80"
            >
              Write a Google review →
            </a>
          </div>
        </Reveal>
      )}

      {/* Draggable infinite ticker */}
      {hasGoogleReviews && googleData && (
        <div className="-mx-5 sm:-mx-8">
          <ReviewTicker reviews={googleData.reviews} />
        </div>
      )}

      {/* Website reviews */}
      {hasSiteReviews && (
        <div>
          {hasGoogleReviews && (
            <Reveal>
              <h3 className="mb-6 font-display text-xl text-ink">From our website</h3>
            </Reveal>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteReviews.map((review, i) => (
              <Reveal key={review.id} delay={(i % 3) * 0.08}>
                <div className="flex flex-col gap-3 rounded-lg border border-sand-dark/40 bg-background p-6">
                  <StarRating value={review.rating} size="sm" />
                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{review.authorName}</p>
                    <span className="rounded-full bg-accent-soft/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-deep">
                      Verified
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasGoogleReviews && !hasSiteReviews && (
        <Reveal>
          <p className="text-sm text-ink-soft">
            No reviews yet. Be the first to share your experience.
          </p>
        </Reveal>
      )}

      {/* Submit form */}
      <Reveal>
        <div className="max-w-lg">
          <Heading
            eyebrow="Share Your Experience"
            title="Leave a review"
            description="Your review helps others make informed decisions. It will appear here after a quick approval."
          />
          <div className="mt-8">
            <ReviewForm />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
