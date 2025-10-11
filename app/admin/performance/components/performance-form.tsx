"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PerformanceFormData } from "@/types/performance";

interface PerformanceFormProps {
  onSuccess: () => void;
  initialData?: PerformanceFormData;
  isEditing?: boolean;
  reportId?: string;
}

export function PerformanceForm({
  onSuccess,
  initialData,
  isEditing,
  reportId,
}: PerformanceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PerformanceFormData>(
    initialData || {
      date: new Date(),
      totalCalls: 0,
      totalEmails: 0,
      requirementReceived: 0,
      memoNumber: "",
      invoiceNumber: "",
      notes: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.totalCalls || !formData.totalEmails || !formData.requirementReceived) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const url = isEditing
        ? `/api/admin/performance-reports/${reportId}`
        : "/api/admin/performance-reports";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save report");
      }

      toast({
        title: "Success",
        description: `Report ${isEditing ? "updated" : "created"} successfully`,
      });
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
    <div className="max-h-[70vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4 pr-2">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          placeholder="dd-mm-yyyy"
          value={formData.date ? formData.date.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value ? new Date(e.target.value) : new Date(),
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalCalls">Total Calls</Label>
        <Input
          id="totalCalls"
          type="number"
          min="0"
          value={formData.totalCalls || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalCalls: parseInt(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalEmails">Total Emails</Label>
        <Input
          id="totalEmails"
          type="number"
          min="0"
          value={formData.totalEmails || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalEmails: parseInt(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirementReceived">Requirements Received</Label>
        <Input
          id="requirementReceived"
          type="number"
          min="0"
          value={formData.requirementReceived || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              requirementReceived: parseInt(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="memoNumber">Memo Number (Optional)</Label>
        <Input
          id="memoNumber"
          type="text"
          value={formData.memoNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, memoNumber: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
        <Input
          id="invoiceNumber"
          type="text"
          value={formData.invoiceNumber || ""}
          onChange={(e) =>
            setFormData({ ...formData, invoiceNumber: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes here..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
          ? "Update Report"
          : "Create Report"}
      </Button>
      </form>
    </div>
  );
}
