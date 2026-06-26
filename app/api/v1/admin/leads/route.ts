import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { type LeadStatus, getAdminLeads, leadStatusOptions } from "@/server/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const url = new URL(request.url);
    const rawStatus = url.searchParams.get("status");
    const status =
      rawStatus && leadStatusOptions.includes(rawStatus as LeadStatus)
        ? (rawStatus as LeadStatus)
        : undefined;

    return ok(await getAdminLeads({ status }));
  });
}
