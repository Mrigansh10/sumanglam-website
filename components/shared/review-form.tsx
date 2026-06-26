"use client";
import { useState } from "react";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";

type State = "idle" | "submitting" | "success" | "error";

export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg("Please choose a star rating.");
      return;
    }
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      authorName: (form.elements.namedItem("authorName") as HTMLInputElement).value,
      rating,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error?.message ?? "Something went wrong. Please try again.");
        setState("error");
      } else {
        setState("success");
        form.reset();
        setRating(0);
      }
    } catch {
      setErrorMsg("Could not submit. Please check your connection.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-accent-soft/30 bg-sand/50 p-6 text-center">
        <p className="font-display text-lg text-ink">Thank you for your review.</p>
        <p className="mt-1 text-sm text-ink-soft">
          It will appear here once approved — usually within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Your rating</label>
        <StarRating value={rating} interactive onChange={setRating} />
      </div>
      <div>
        <label htmlFor="authorName" className="mb-1.5 block text-sm font-medium text-ink">
          Your name
        </label>
        <input
          id="authorName"
          name="authorName"
          type="text"
          required
          minLength={2}
          maxLength={80}
          placeholder="e.g. Priya Sharma"
          className="w-full rounded-md border border-sand-dark bg-background px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 focus:border-accent-deep focus:ring-1 focus:ring-accent-deep"
        />
      </div>
      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-ink">
          Your review
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder="Tell us about your experience with Sumanglam…"
          className="w-full resize-none rounded-md border border-sand-dark bg-background px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 focus:border-accent-deep focus:ring-1 focus:ring-accent-deep"
        />
      </div>
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
