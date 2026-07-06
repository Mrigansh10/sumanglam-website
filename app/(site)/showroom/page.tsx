import { redirect } from "next/navigation";

/**
 * TEMPORARILY REMOVED (2026-07-06): the showroom page is offline until real
 * showroom photography arrives — the placeholder imagery undersold the space.
 * The full page lives in git history (commit 885e46d and earlier); restore it
 * from there, re-add the "Showroom" nav entries in site-header.tsx, the
 * homepage "Showroom Experience" section in app/(site)/page.tsx, the sitemap
 * entry, and point the "Visit Us" CTAs back from /contact to /showroom.
 * The consultation flow never depended on this page (it only linked here).
 */
export default function ShowroomPage() {
  redirect("/contact");
}
