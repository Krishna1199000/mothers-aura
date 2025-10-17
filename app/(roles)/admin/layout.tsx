"use client";

import { RoleGuard } from "@/lib/role-guard";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <DashboardHeader />
      <main>{children}</main>
    </RoleGuard>
  );
}



