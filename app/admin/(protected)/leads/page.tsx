import type { Metadata } from "next";
import type { LeadStatus } from "@/server/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  getAdminLeads,
  leadStatusLabels,
  leadStatusOptions,
} from "@/server/admin";
import { updateLeadStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin Leads",
  robots: { index: false, follow: false },
};

function formatDate(value: string | number | Date | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  // Supabase REST returns timestamps as ISO strings; coerce before formatting.
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status =
    params?.status && leadStatusOptions.includes(params.status as LeadStatus)
      ? (params.status as unknown as LeadStatus)
      : undefined;
  const data = await getAdminLeads({ status });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Leads</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Review consultation and inquiry leads. Lead source is preserved where
          the public flow captured it.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
                <tr>
                  <th className="px-5 py-4 font-medium">Lead</th>
                  <th className="px-5 py-4 font-medium">Contact</th>
                  <th className="px-5 py-4 font-medium">Latest project</th>
                  <th className="px-5 py-4 font-medium">Source</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((lead) => {
                  const latest = lead.consultations[0];
                  return (
                    <tr key={lead.id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-medium">{lead.name}</p>
                        <p className="mt-1 text-xs text-ink-faint">{lead.id}</p>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        <p>{lead.phone}</p>
                        <p>{lead.email ?? "No email"}</p>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        {latest ? latest.projectType.replaceAll("_", " ").toLowerCase() : "None"}
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        <p>{lead.leadSource ?? "Unknown"}</p>
                        <p className="mt-1 max-w-52 truncate text-xs text-ink-faint">
                          {lead.sourcePage ?? "No source page"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <form action={updateLeadStatusAction} className="flex gap-2">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <Select
                            name="status"
                            defaultValue={lead.leadStatus}
                            aria-label={`Status for ${lead.name}`}
                            className="h-9 min-w-36 text-xs"
                          >
                            {leadStatusOptions.map((option) => (
                              <option key={option} value={option}>
                                {leadStatusLabels[option]}
                              </option>
                            ))}
                          </Select>
                          <button
                            type="submit"
                            className="border border-line px-3 text-xs transition hover:border-ink"
                          >
                            Save
                          </button>
                        </form>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">{formatDate(lead.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!data.items.length ? (
            <div className="px-5 py-12 text-center text-sm text-ink-soft">
              No leads found.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
