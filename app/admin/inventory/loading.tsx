import { ProductCardSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-muted/30" />
          <div className="h-4 w-64 rounded bg-muted/30" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded bg-muted/30" />
          <div className="h-10 w-32 rounded bg-muted/30" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="h-10 rounded bg-muted/30" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12).fill(null).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
