"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COLORS,
  CLARITIES,
  SHAPES,
  SORT_OPTIONS,
  type InventoryFilterData,
} from "@/types/inventory";

interface AdvancedFilterProps {
  filters: InventoryFilterData;
  onFilterChange: (filters: InventoryFilterData) => void;
}

export function AdvancedFilter({
  filters,
  onFilterChange,
}: AdvancedFilterProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Carat Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="Min"
            value={filters.caratRange?.min || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                caratRange: {
                  ...filters.caratRange,
                  min: e.target.value ? parseFloat(e.target.value) : undefined,
                },
              })
            }
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Max"
            value={filters.caratRange?.max || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                caratRange: {
                  ...filters.caratRange,
                  max: e.target.value ? parseFloat(e.target.value) : undefined,
                },
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Select
          value={filters.color?.[0] || "all"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, color: value === "all" ? undefined : [value] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {COLORS.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Clarity</Label>
        <Select
          value={filters.clarity?.[0] || "all"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, clarity: value === "all" ? undefined : [value] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select clarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clarity</SelectItem>
            {CLARITIES.map((clarity) => (
              <SelectItem key={clarity} value={clarity}>
                {clarity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Shape</Label>
        <Select
          value={filters.shape?.[0] || "all"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, shape: value === "all" ? undefined : [value] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shapes</SelectItem>
            {SHAPES.map((shape) => (
              <SelectItem key={shape} value={shape}>
                {shape}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy || "createdAt"}
          onValueChange={(value: any) =>
            onFilterChange({ ...filters, sortBy: value === "createdAt" ? undefined : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sort field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Default</SelectItem>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Order</Label>
        <Select
          value={filters.order || "desc"}
          onValueChange={(value: "asc" | "desc") =>
            onFilterChange({ ...filters, order: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        variant="outline"
        onClick={() => onFilterChange({})}
      >
        Reset Filters
      </Button>
    </div>
  );
}
