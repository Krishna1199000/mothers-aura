"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PerformanceFilterData } from "@/types/performance";

interface PerformanceFilterProps {
  filters: PerformanceFilterData;
  onFilterChange: (filters: PerformanceFilterData) => void;
}

export function PerformanceFilter({
  filters,
  onFilterChange,
}: PerformanceFilterProps) {
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({ ...filters, startDate: value ? new Date(value) : undefined });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({ ...filters, endDate: value ? new Date(value) : undefined });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="grid gap-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              placeholder="dd-mm-yyyy"
              value={formatDateForInput(filters.startDate)}
              onChange={handleStartDateChange}
              className="w-[240px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              placeholder="dd-mm-yyyy"
              value={formatDateForInput(filters.endDate)}
              onChange={handleEndDateChange}
              className="w-[240px]"
            />
          </div>

          <Button
            className="mt-4 md:mt-auto md:self-end"
            variant="outline"
            onClick={() =>
              onFilterChange({
                startDate: undefined,
                endDate: undefined,
              })
            }
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
