"use client";
/** Route-level error boundary. Shows a friendly message and a retry. */
import Link from "next/link";
import { useEffect } from "react";
import { buttonClass } from "@/components/ui/button-styles";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hook up error reporting (Sentry etc.) here.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-24 text-center" role="alert">
      <h1 className="heading-display text-5xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">Sorry — this page couldn&apos;t load. Please try again.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className={buttonClass("dark", "lg")}>
          Try again
        </button>
        <Link href="/" className={buttonClass("outline", "lg")}>
          Go home
        </Link>
      </div>
    </div>
  );
}
