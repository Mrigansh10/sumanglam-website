import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { deleteConsultation, getAdminConsultation } from "@/server/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const consultation = await getAdminConsultation(id);
    if (!consultation) {
      return errors.notFound("CONSULTATION_NOT_FOUND", "Consultation not found.");
    }

    return ok({ consultation });
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
    await deleteConsultation(id);
    return ok({ deleted: true });
  });
}
