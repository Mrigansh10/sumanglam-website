import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminConsultations } from "@/server/admin";

export const metadata: Metadata = {
  title: "Admin Consultations",
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

export default async function AdminConsultationsPage() {
  const data = await getAdminConsultations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Consultations</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Consultation requests created by the public booking flow. Notification
          delivery is still a launch decision; requests remain visible here.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
                <tr>
                  <th className="px-5 py-4 font-medium">Lead</th>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Requirements</th>
                  <th className="px-5 py-4 font-medium">Preferred contact</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((consultation) => (
                  <tr key={consultation.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium">{consultation.lead?.name ?? "—"}</p>
                      <p className="mt-1 text-xs text-ink-faint">{consultation.lead?.phone ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {consultation.projectType.replaceAll("_", " ").toLowerCase()}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      <p className="max-w-md leading-relaxed">{consultation.requirements}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {consultation.preferredContactMethod?.toLowerCase() ?? "No preference"}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {consultation.status.toLowerCase()}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {formatDate(consultation.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data.items.length ? (
            <div className="px-5 py-12 text-center text-sm text-ink-soft">
              No consultation requests yet.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
