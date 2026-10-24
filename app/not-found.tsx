import Link from "next/link";

/** Root-level 404 for routes outside the public site shell. */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-sm font-medium text-accent-deep">404</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Page not found</h1>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-ink px-6 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-ivory"
      >
        Back to Home
      </Link>
    </div>
  );
}
