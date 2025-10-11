import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PerformanceContent } from "./components/performance-content";

export const metadata: Metadata = {
  title: "Performance Reports | Admin Dashboard",
  description: "View and manage employee performance reports",
};

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.role || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    redirect("/signin?callbackUrl=/admin/performance");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Performance Reports</h1>
        <p className="text-muted-foreground">
          Track and manage daily performance metrics
        </p>
      </div>
      <PerformanceContent userRole={session.user.role as "ADMIN" | "EMPLOYEE"} />
    </div>
  );
}
