"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LedgerFormData } from "@/types/ledger";

interface LedgerFormProps {
  onSuccess: () => void;
}

async function fetchInvoices() {
  const response = await fetch("/api/admin/invoices");
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return response.json();
}

export function LedgerForm({ onSuccess }: LedgerFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState<string>();
  
  // Form state
  const [formData, setFormData] = useState<LedgerFormData>({
    date: new Date(),
    type: "CREDIT",
    amount: 0,
    description: "",
    masterId: "",
  });

  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    enabled: formData.type === "CREDIT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.type || !formData.amount || !formData.masterId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ledger entry");
      }

      toast({
        title: "Success",
        description: "Ledger entry created successfully",
      });
      
      // Reset form
      setFormData({
        date: new Date(),
        type: "CREDIT",
        amount: 0,
        description: "",
        masterId: "",
      });
      setSelectedMasterId(undefined);
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          placeholder="dd-mm-yyyy"
          value={formData.date ? formData.date.toISOString().split('T')[0] : ""}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value ? new Date(e.target.value) : new Date() })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "CREDIT" | "DEBIT") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CREDIT">Credit</SelectItem>
            <SelectItem value="DEBIT">Debit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "CREDIT" && (
        <div className="space-y-2">
          <Label htmlFor="invoiceId">Invoice</Label>
          <Select
            value={formData.invoiceId || ""}
            onValueChange={(value) => {
              const invoice = invoices?.find((i: any) => i.id === value);
              setFormData({
                ...formData,
                invoiceId: value || undefined,
                masterId: invoice?.masterId || "",
                amount: invoice?.totalDue || 0,
                description: `Payment for invoice ${invoice?.invoiceNumber}` || "",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select invoice" />
            </SelectTrigger>
            <SelectContent>
              {invoices?.map((invoice: any) => (
                <SelectItem key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - {invoice.totalDue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          value={formData.amount || ""}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Entry"}
      </Button>
    </form>
  );
}
