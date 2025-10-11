"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LedgerFilter } from "./ledger-filter";
import { LedgerForm } from "./ledger-form";
import { LedgerTable } from "./ledger-table";
import { LedgerSummary } from "./ledger-summary";
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
import type { LedgerFilterData } from "@/types/ledger";

async function fetchLedger(filters: LedgerFilterData) {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate.toISOString());
  if (filters.endDate) params.append("endDate", filters.endDate.toISOString());
  if (filters.type) params.append("type", filters.type);
  if (filters.masterId) params.append("masterId", filters.masterId);

  const response = await fetch(`/api/admin/ledger?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch ledger data");
  return response.json();
}

export function LedgerContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<LedgerFilterData>({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ledger", filters],
    queryFn: () => fetchLedger(filters),
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Error loading ledger data. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <LedgerFilter
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Ledger Entry</DialogTitle>
            </DialogHeader>
            <LedgerForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <LedgerSummary
        isLoading={isLoading}
        creditTotal={data?.summary.creditTotal}
        debitTotal={data?.summary.debitTotal}
        balance={data?.summary.balance}
      />

      <LedgerTable isLoading={isLoading} entries={data?.entries} />
    </div>
  );
}
