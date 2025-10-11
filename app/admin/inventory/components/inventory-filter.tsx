"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InventoryFilterData } from "@/types/inventory";

interface InventoryFilterProps {
  filters: InventoryFilterData;
  onFilterChange: (filters: InventoryFilterData) => void;
}

export function InventoryFilter({
  filters,
  onFilterChange,
}: InventoryFilterProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by Stock ID, Company, or Certificate"
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="flex-1"
          />
          <Select
            value={filters.status || "all"}
            onValueChange={(value: "AVAILABLE" | "HOLD" | "MEMO" | "SOLD" | "all") =>
              onFilterChange({ ...filters, status: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="HOLD">Hold</SelectItem>
              <SelectItem value="MEMO">Memo</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
