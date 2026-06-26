import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";
import { getAllReviewsAdmin } from "@/server/reviews";
import { approveReviewAction, deleteReviewAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin Reviews",
  robots: { index: false, follow: false },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();
  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Reviews</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Approve or reject website reviews before they appear publicly. Google
          reviews are shown automatically via the Places API.
        </p>
      </div>

      {/* Pending */}
      <section>
        <h2 className="mb-4 font-display text-xl">
          Pending approval{" "}
          {pending.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-sm font-normal text-amber-700">
              {pending.length}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-ink-soft">No pending reviews.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-line">
                {pending.map((review) => (
                  <div key={review.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-ink">{review.authorName}</p>
                        <StarRating value={review.rating} size="sm" />
                      </div>
                      <p className="text-sm leading-relaxed text-ink-soft">{review.content}</p>
                      <p className="text-xs text-ink-soft/60">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <form action={approveReviewAction}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="isApproved" value="true" />
                        <button
                          type="submit"
                          className="w-full rounded-md bg-ink px-4 py-2 text-xs font-medium text-background hover:bg-ink/90"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={deleteReviewAction}>
                        <input type="hidden" name="id" value={review.id} />
                        <button
                          type="submit"
                          className="w-full rounded-md border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:border-red-300 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Approved */}
      <section>
        <h2 className="mb-4 font-display text-xl">Approved ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="text-sm text-ink-soft">No approved reviews yet.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-line">
                {approved.map((review) => (
                  <div key={review.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-ink">{review.authorName}</p>
                        <StarRating value={review.rating} size="sm" />
                      </div>
                      <p className="text-sm leading-relaxed text-ink-soft">{review.content}</p>
                      <p className="text-xs text-ink-soft/60">{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <form action={approveReviewAction}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="isApproved" value="false" />
                        <button
                          type="submit"
                          className="w-full rounded-md border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:border-amber-300 hover:text-amber-700"
                        >
                          Unpublish
                        </button>
                      </form>
                      <form action={deleteReviewAction}>
                        <input type="hidden" name="id" value={review.id} />
                        <button
                          type="submit"
                          className="w-full rounded-md border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:border-red-300 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
