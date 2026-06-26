import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { deleteReview, setReviewApproval } from "@/server/reviews";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  isApproved: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { isApproved } = patchSchema.parse(body);
    const review = await setReviewApproval(id, isApproved);
    return ok(review);
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    await deleteReview(id);
    return ok({ deleted: true });
  });
}
