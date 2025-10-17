"use client";

import { Suspense } from "react";
import MastersPage from "@/app/(admin-shared)/masters/page";
import { CardSkeleton, TableRowSkeleton } from "@/components/ui/skeletons";

function MastersListFallback() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-1/3 rounded bg-muted/30" />
        <div className="h-4 w-1/2 rounded bg-muted/30" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <CardSkeleton key={i} />
          ))}
      </div>
      <div className="rounded-lg border bg-card p-4 space-y-4">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
      </div>
    </div>
  );
}

export default function EmployeeMastersPage() {
  return (
    <Suspense fallback={<MastersListFallback />}> 
      <MastersPage />
    </Suspense>
  );
}



