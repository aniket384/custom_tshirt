/**
 * Loading UI for /search only.
 *
 * NOTE (Core Web Vitals): a `loading.tsx` wraps the route in Suspense, so
 * the skeleton is streamed first and the real content swapped in after —
 * even when data is instant. On static pages that causes layout shift and
 * delays LCP, so we deliberately do NOT use loading.tsx on the homepage,
 * shop, collections or product pages. Add one only where a real backend
 * call is slow enough to be worth a skeleton (search is the likely case).
 */
import { PageSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return <PageSkeleton />;
}
