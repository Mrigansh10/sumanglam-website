import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { getAllReviewsAdmin } from "@/server/reviews";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const reviews = await getAllReviewsAdmin();
    return ok(reviews);
  });
}
