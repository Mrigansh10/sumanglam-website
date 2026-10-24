import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main data-admin className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <Card className="w-full">
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-luxe text-accent-deep">
              Sumanglam Admin
            </p>
            <CardTitle className="font-display text-2xl">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <AdminLoginForm />
            </Suspense>
            <p className="mt-5 text-xs leading-relaxed text-ink-faint">
              Admin access is intentionally limited to one configured V1 account.
              Public user accounts are out of scope.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
