"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LedgerFilterData } from "@/types/ledger";

interface LedgerFilterProps {
  filters: LedgerFilterData;
  onFilterChange: (filters: LedgerFilterData) => void;
}

export function LedgerFilter({ filters, onFilterChange }: LedgerFilterProps) {
  const formatDateForInput = (date: Date | null | undefined) => {
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

          <div className="grid gap-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Type
            </Label>
            <Select
              value={filters.type}
              onValueChange={(value: string) =>
                onFilterChange({ ...filters, type: value === "ALL" ? undefined : value as "CREDIT" | "DEBIT" })
              }
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="mt-4 md:mt-auto md:self-end"
            variant="outline"
            onClick={() =>
              onFilterChange({
                startDate: undefined,
                endDate: undefined,
                type: undefined,
                masterId: undefined,
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