import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import {
  type LeadStatus,
  getAdminLead,
  leadStatusOptions,
  updateLeadStatus,
} from "@/server/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const lead = await getAdminLead(id);
    if (!lead) return errors.notFound("LEAD_NOT_FOUND", "Lead not found.");
    return ok({ lead });
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    const status = body?.leadStatus as LeadStatus | undefined;
    if (!status || !leadStatusOptions.includes(status)) {
      return errors.badRequest("Invalid lead status.");
    }

    const { id } = await params;
    const lead = await updateLeadStatus(id, status);
    return ok({ lead });
  });
}
