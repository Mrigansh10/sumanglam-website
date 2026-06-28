import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOutAdmin } from "./actions";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Spaces", href: "/admin/spaces" },
  { label: "Inspirations", href: "/admin/inspirations" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Consultations", href: "/admin/consultations" },
  { label: "Content", href: "/admin/content" },
  { label: "Reviews", href: "/admin/reviews" },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/admin" className="font-display text-2xl">
              Sumanglam Admin
            </Link>
            <p className="mt-1 text-sm text-ink-soft">
              Content, consultation, and lead visibility for V1.
            </p>
          </div>
          <form action={signOutAdmin}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-4 sm:px-8">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap border border-line bg-background px-4 py-2 text-sm text-ink-soft transition hover:border-ink hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
