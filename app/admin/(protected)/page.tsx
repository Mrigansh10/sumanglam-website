import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leadStatusLabels, getAdminOverview } from "@/server/admin";

export const metadata: Metadata = {
  title: "Admin Overview",
  robots: { index: false, follow: false },
};

const countLabels = {
  spaces: "Spaces",
  collections: "Collections",
  inspirations: "Inspirations",
  brands: "Brands",
  products: "Products",
  showroomSections: "Showroom sections",
  leads: "Leads",
  consultations: "Consultations",
} as const;

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Admin overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          V1 admin foundation: monitor seeded content, review incoming leads,
          and manage consultation status without exposing any public accounts.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data.counts).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-ink-soft">
                {countLabels[key as keyof typeof countLabels]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent leads</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentLeads.length ? (
              <div className="divide-y divide-line">
                {data.recentLeads.map((lead) => (
                  <div key={lead.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-ink-soft">{lead.phone}</p>
                      </div>
                      <span className="text-xs uppercase tracking-luxe text-accent-deep">
                        {leadStatusLabels[lead.leadStatus]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-ink-faint">
                      {lead.sourcePage ?? "No source page captured"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">No leads yet.</p>
            )}
            <Link href="/admin/leads" className="mt-5 inline-block text-sm text-accent-deep underline">
              View all leads
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentConsultations.length ? (
              <div className="divide-y divide-line">
                {data.recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="py-4 first:pt-0 last:pb-0">
                    <p className="font-medium">{consultation.lead?.name ?? "—"}</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {consultation.projectType.replaceAll("_", " ").toLowerCase()}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-faint">
                      {consultation.requirements}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">No consultations yet.</p>
            )}
            <Link
              href="/admin/consultations"
              className="mt-5 inline-block text-sm text-accent-deep underline"
            >
              View all consultations
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
