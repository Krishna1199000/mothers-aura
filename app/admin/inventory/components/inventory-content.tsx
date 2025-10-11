"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InventoryFilter } from "./inventory-filter";
import { InventoryForm } from "./inventory-form";
import { InventoryTable } from "./inventory-table";
import { AdvancedFilter } from "./advanced-filter";
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
import type { InventoryFilterData } from "@/types/inventory";

interface InventoryContentProps {
  userRole: "ADMIN" | "EMPLOYEE";
}

async function fetchInventory(filters: InventoryFilterData) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.caratRange?.min) params.append("minCarat", filters.caratRange.min.toString());
  if (filters.caratRange?.max) params.append("maxCarat", filters.caratRange.max.toString());
  if (filters.color) filters.color.forEach(c => params.append("color", c));
  if (filters.clarity) filters.clarity.forEach(c => params.append("clarity", c));
  if (filters.shape) filters.shape.forEach(s => params.append("shape", s));
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.order) params.append("order", filters.order);

  const response = await fetch(`/api/admin/inventory?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
}

export function InventoryContent({ userRole }: InventoryContentProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [filters, setFilters] = useState<InventoryFilterData>({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inventory", filters],
    queryFn: () => fetchInventory(filters),
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Error loading inventory. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <InventoryFilter
            filters={filters}
            onFilterChange={(newFilters) => setFilters(newFilters)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAdvancedFilterOpen(true)}
          >
            Advanced Filter
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <InventoryForm onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Advanced Filter</DialogTitle>
          </DialogHeader>
          <AdvancedFilter
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setIsAdvancedFilterOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <InventoryTable
        isLoading={isLoading}
        inventory={data}
        userRole={userRole}
        onDelete={refetch}
      />
    </div>
  );
}
