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
import type { LedgerFormData, LedgerEntry } from "@/types/ledger";

interface LedgerFormProps {
  onSuccess: () => void;
  initialData?: LedgerEntry;
  isEditing?: boolean;
}

async function fetchInvoices() {
  const response = await fetch("/api/admin/invoices");
  if (!response.ok) throw new Error("Failed to fetch invoices");
  return response.json();
}

async function fetchMasters() {
  const response = await fetch("/api/admin/masters");
  if (!response.ok) throw new Error("Failed to fetch masters");
  return response.json();
}

export function LedgerForm({ onSuccess, initialData, isEditing = false }: LedgerFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState<string>();
  
  // Form state
  const [formData, setFormData] = useState<LedgerFormData>({
    date: initialData ? new Date(initialData.date) : new Date(),
    type: initialData?.type || "CREDIT",
    amount: initialData?.amount || 0,
    description: initialData?.description || "",
    masterId: initialData?.masterId || "",
    invoiceId: initialData?.invoiceId,
  });

  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    enabled: formData.type === "CREDIT",
  });

  const { data: masters } = useQuery({
    queryKey: ["masters"],
    queryFn: fetchMasters,
  });

  // Fetch remaining amount for selected invoice
  const { data: invoiceRemaining } = useQuery({
    queryKey: ["invoice-remaining", formData.invoiceId],
    queryFn: async () => {
      if (!formData.invoiceId) return null;
      const response = await fetch(`/api/admin/ledger/invoice-remaining/${formData.invoiceId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!formData.invoiceId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form data:", formData); // Debug log
    
    if (!formData.date || !formData.type || !formData.amount || !formData.masterId) {
      const missingFields = [];
      if (!formData.date) missingFields.push("Date");
      if (!formData.type) missingFields.push("Type");
      if (!formData.amount || formData.amount <= 0) missingFields.push("Amount");
      if (!formData.masterId) missingFields.push("Master/Company");
      
      toast({
        title: "Error",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const url = isEditing ? `/api/admin/ledger/${initialData?.id}` : "/api/admin/ledger";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} ledger entry`);
      }

      toast({
        title: "Success",
        description: `Ledger entry ${isEditing ? 'updated' : 'created'} successfully`,
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

      <div className="space-y-2">
        <Label htmlFor="masterId">Master/Company</Label>
        <Select
          value={formData.masterId}
          onValueChange={(value) =>
            setFormData({ ...formData, masterId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {masters?.map((master: any) => (
              <SelectItem key={master.id} value={master.id}>
                {master.companyName}
              </SelectItem>
            ))}
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
                amount: 0, // Reset amount to 0 when selecting invoice
                description: invoice ? `Payment for invoice ${invoice.invoiceNumber}` : "",
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
        {formData.type === "CREDIT" && formData.invoiceId && invoiceRemaining && (
          <p className="text-sm text-muted-foreground">
            Invoice total: ${invoiceRemaining.totalDue} | 
            Already credited: ${invoiceRemaining.creditedAmount} | 
            Remaining: ${invoiceRemaining.remainingAmount}
          </p>
        )}
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
        {isSubmitting 
          ? (isEditing ? "Updating..." : "Creating...") 
          : (isEditing ? "Update Entry" : "Create Entry")
        }
      </Button>
    </form>
  );
}
