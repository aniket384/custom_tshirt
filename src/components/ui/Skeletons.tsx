/** Loading skeletons with fixed aspect ratios (no layout shift when content arrives). */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="aspect-[4/5] animate-pulse rounded-card bg-surface" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-surface" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-surface" />
        </li>
      ))}
    </ul>
  );
}

export function PageSkeleton({ grid = true }: { grid?: boolean }) {
  return (
    <div className="container-page py-8 md:py-12" role="status" aria-label="Loading">
      <div className="h-4 w-40 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-12 w-2/3 max-w-md animate-pulse rounded bg-surface" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-surface" />
      {grid && (
        <div className="mt-10">
          <ProductGridSkeleton />
        </div>
      )}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
