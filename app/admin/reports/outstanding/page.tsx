"use client";

import { RoleGuard } from "@/lib/role-guard";
import { OutstandingReportContent } from "./components/outstanding-report-content";

export default function OutstandingReportPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Outstanding Amount Report</h1>
          <p className="text-muted-foreground">
            View and track outstanding amounts for all masters
          </p>
        </div>
        <OutstandingReportContent />
      </div>
    </RoleGuard>
  );
}






