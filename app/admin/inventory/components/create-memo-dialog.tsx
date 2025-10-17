"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Inventory } from "@/types/inventory";

interface CreateMemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: Inventory[];
  onSuccess: () => void;
}

export function CreateMemoDialog({
  open,
  onOpenChange,
  selectedItems,
  onSuccess,
}: CreateMemoDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [masterId, setMasterId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterId) {
      toast({
        title: "Error",
        description: "Please select a master",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Calculate totals
      const items = selectedItems.map(item => ({
        description: `${item.shape} ${item.carat}ct ${item.color}/${item.clarity} ${item.lab} ${item.certificateNo || ""}`,
        carat: item.carat,
        color: item.color,
        clarity: item.clarity,
        lab: item.lab,
        reportNo: item.certificateNo,
        pricePerCarat: item.askingAmount / item.carat,
        total: item.askingAmount,
      }));

      const subtotal = items.reduce((sum, item) => sum + item.total, 0);

      const response = await fetch("/api/admin/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterId,
          paymentTerms,
          items,
          subtotal,
          totalDue: subtotal,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create memo");
      }

      toast({
        title: "Success",
        description: "Memo created successfully",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Memo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="master">Master</Label>
            <Select value={masterId} onValueChange={setMasterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select master" />
              </SelectTrigger>
              <SelectContent>
                {/* TODO: Fetch masters from API */}
                <SelectItem value="1">Master 1</SelectItem>
                <SelectItem value="2">Master 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g., 30 days"
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Items</Label>
            <div className="border rounded-md p-2 space-y-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="text-sm">
                  {item.shape} {item.carat}ct {item.color}/{item.clarity} {item.lab} {item.certificateNo || ""}
                  <span className="float-right font-medium">
                    ${(item.askingAmount || 0).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium">
                Total: ${selectedItems.reduce((sum, item) => sum + (item.askingAmount || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Memo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
