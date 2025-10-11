"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PerformanceFilter } from "./performance-filter";
import { PerformanceForm } from "./performance-form";
import { PerformanceTable } from "./performance-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PerformanceFilterData } from "@/types/performance";

interface PerformanceContentProps {
  userRole: "ADMIN" | "EMPLOYEE";
}

async function fetchReports(filters: PerformanceFilterData) {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate.toISOString());
  if (filters.endDate) params.append("endDate", filters.endDate.toISOString());

  const response = await fetch(`/api/admin/performance-reports?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch reports");
  return response.json();
}

export function PerformanceContent({ userRole }: PerformanceContentProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<PerformanceFilterData>({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["performanceReports", filters],
    queryFn: () => fetchReports(filters),
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Error loading performance reports. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <PerformanceFilter
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Performance Report</DialogTitle>
            </DialogHeader>
            <PerformanceForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <PerformanceTable
        isLoading={isLoading}
        reports={data}
        userRole={userRole}
        onDelete={refetch}
      />
    </div>
  );
}
