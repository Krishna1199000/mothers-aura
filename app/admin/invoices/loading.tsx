import { TableRowSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 rounded bg-muted/30" />
          <div className="h-4 w-48 rounded bg-muted/30" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-40 rounded bg-muted/30" />
          <div className="h-10 w-40 rounded bg-muted/30" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-10 w-full max-w-sm rounded bg-muted/30" />

      {/* Table Skeleton */}
      <div className="rounded-lg border bg-card">
        {/* Table Header Skeleton */}
        <div className="border-b bg-muted/5 p-4">
          <div className="grid grid-cols-6 gap-4">
            {Array(6).fill(null).map((_, i) => (
              <div key={i} className="h-5 rounded bg-muted/30" />
            ))}
          </div>
        </div>

        {/* Table Body Skeleton */}
        <div className="p-4 space-y-4">
          {Array(10).fill(null).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
