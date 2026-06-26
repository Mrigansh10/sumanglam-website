import { NextResponse } from "next/server";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { clientKey, rateLimit } from "@/lib/api/rate-limit";
import { reviewSchema } from "@/lib/validation/review";
import { getApprovedReviews, submitReview } from "@/server/reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    const reviews = await getApprovedReviews();
    return ok(reviews);
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    if (!rateLimit(clientKey(request, "reviews"), { limit: 3, windowMs: 60_000 })) {
      return errors.rateLimited();
    }

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const input = reviewSchema.parse(body);
    await submitReview(input);

    return NextResponse.json(
      { success: true, message: "Thank you! Your review will appear after approval." },
      { status: 201 },
    );
  });
}
