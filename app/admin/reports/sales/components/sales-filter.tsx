"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SalesFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export function SalesFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: SalesFilterProps) {
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onStartDateChange(value ? new Date(value) : null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEndDateChange(value ? new Date(value) : null);
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
              value={formatDateForInput(startDate)}
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
              value={formatDateForInput(endDate)}
              onChange={handleEndDateChange}
              className="w-[240px]"
            />
          </div>

          <Button
            className="mt-4 md:mt-auto md:self-end"
            variant="outline"
            onClick={() => {
              onStartDateChange(null);
              onEndDateChange(null);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}