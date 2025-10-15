"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SalesReportResponse } from "@/types/reports";
import { SalesFilter } from "./sales-filter";
import { SummaryCards } from "./summary-cards";
import { SalesCharts } from "./sales-charts";
import { RecentSales } from "./recent-sales";
import { TopSalesmen } from "./top-salesmen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchSalesReport(
  startDate?: Date | null,
  endDate?: Date | null,
  customerId?: string
) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate.toISOString());
  if (endDate) params.append("endDate", endDate.toISOString());
  if (customerId) params.append("customerId", customerId);

  const response = await fetch(`/api/admin/reports/sales?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch sales report");
  return response.json() as Promise<SalesReportResponse>;
}

export function SalesReportContent() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customerId, setCustomerId] = useState<string>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["salesReport", startDate, endDate, customerId],
    queryFn: () => fetchSalesReport(startDate, endDate, customerId),
  });

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Error loading sales report. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
        <SalesFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        data && (
          <>
            <SummaryCards summary={data.summary} />
            <div className="grid gap-8 md:grid-cols-2">
              <SalesCharts
                dailySales={data.dailySales}
                categoryDistribution={data.categoryDistribution}
              />
            </div>
            {data.summary.topSalesmen && data.summary.topSalesmen.length > 0 && (
              <TopSalesmen salesmen={data.summary.topSalesmen} />
            )}
            <RecentSales invoices={data.recentInvoices} />
          </>
        )
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[100px]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[150px]" />
                <Skeleton className="mt-4 h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

