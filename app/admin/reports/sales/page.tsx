import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SalesReportContent } from "./components/sales-report-content";

export const metadata: Metadata = {
  title: "Sales Report | Admin Dashboard",
  description: "View and analyze sales performance metrics",
};

export default async function SalesReportPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=/admin/reports/sales");
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
        <p className="text-muted-foreground">
          Analyze sales performance and trends
        </p>
      </div>
      <SalesReportContent />
    </div>
  );
}

