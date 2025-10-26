"use client";

import { RoleGuard } from "@/lib/role-guard";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["EMPLOYEE"]}>
      <DashboardHeader />
      <main>{children}</main>
    </RoleGuard>
  );
}









