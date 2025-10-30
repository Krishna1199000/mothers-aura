"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";

interface Master {
  id: string;
  companyName: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  invoiceNumber?: string;
  memoNumber?: string;
}

interface OutstandingReport {
  master: Master;
  transactions: Transaction[];
  totalPurchase: number;
  totalPayment: number;
  outstandingAmount: number;
}

export function OutstandingReportContent() {
  const [selectedMasterId, setSelectedMasterId] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [masters, setMasters] = useState<Master[]>([]);

  // Fetch masters
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const response = await fetch("/api/admin/masters");
        if (!response.ok) throw new Error("Failed to fetch masters");
        const data = await response.json();
        setMasters(data);
      } catch (error) {
        console.error("Error fetching masters:", error);
      }
    };
    fetchMasters();
  }, []);

  // Fetch report data
  const { data: report, isLoading } = useQuery({
    queryKey: ["outstanding-report", selectedMasterId, date],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedMasterId && selectedMasterId !== "all") params.append("masterId", selectedMasterId);
      if (date?.from) params.append("fromDate", date.from.toISOString());
      if (date?.to) params.append("toDate", date.to.toISOString());

      const response = await fetch(`/api/admin/reports/outstanding?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch report");
      return response.json();
    },
    enabled: (selectedMasterId && selectedMasterId !== "all") || (!!date?.from && !!date?.to),
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Master Selection */}
          <div className="space-y-2">
            <Label>Select Master</Label>
            <Select
              value={selectedMasterId}
              onValueChange={setSelectedMasterId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a master" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Masters</SelectItem>
                {masters.map((master) => (
                  <SelectItem key={master.id} value={master.id}>
                    {master.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : report ? (
        <Card className="p-6 overflow-x-auto">
          <div className="space-y-6">
            {/* Transactions Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Invoice/Memo No</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.transactions?.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.invoiceNumber || transaction.memoNumber || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Purchase:</span>
                <span className="font-medium">
                  ${report.totalPurchase?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Payment:</span>
                <span className="font-medium">
                  ${report.totalPayment?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Outstanding Amount:</span>
                <span className="text-red-600">
                  ${report.outstandingAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
