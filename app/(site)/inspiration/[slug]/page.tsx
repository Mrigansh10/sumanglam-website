import { redirect } from "next/navigation";

// Inspirations are browsed visually on the listing page (Nolte-style) and no
// longer have detail pages. Old URLs redirect so nothing 404s. The previous
// detail-page implementation lives in git history (commit c8ad41b) if this
// decision is ever reversed.
export default function InspirationDetailPage() {
  redirect("/inspiration");
}
