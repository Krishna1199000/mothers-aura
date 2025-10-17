"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";

interface Master {
  id: string;
  companyName: string;
}

interface InventoryOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryId: string;
  currentStatus: string;
  onSuccess: () => void;
}

export function InventoryOperationsDialog({
  open,
  onOpenChange,
  inventoryId,
  currentStatus,
  onSuccess,
}: InventoryOperationsDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoadingMasters, setIsLoadingMasters] = useState(false);
  const [operation, setOperation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [lotLocation, setLotLocation] = useState("");

  // Fetch masters when dialog opens
  useEffect(() => {
    const fetchMasters = async () => {
      if (!open) return;
      
      try {
        setIsLoadingMasters(true);
        const response = await fetch('/api/admin/masters');
        if (!response.ok) {
          throw new Error('Failed to fetch masters');
        }
        const data = await response.json();
        setMasters(data);
      } catch (error) {
        console.error('Error fetching masters:', error);
        toast({
          title: "Error",
          description: "Failed to load companies",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMasters(false);
      }
    };

    fetchMasters();
  }, [open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!operation) {
      toast({
        title: "Error",
        description: "Please select an operation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/inventory/${inventoryId}/operations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation,
          companyName: companyName || undefined,
          referenceNo: referenceNo || undefined,
          lotLocation: lotLocation || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 503) {
          throw new Error("Database connection failed. Please try again in a moment.");
        }
        throw new Error(error.error || "Failed to perform operation");
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message,
      });

      // Reset form
      setOperation("");
      setCompanyName("");
      setReferenceNo("");
      setLotLocation("");
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error performing operation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableOperations = () => {
    switch (currentStatus) {
      case "AVAILABLE":
        return [
          { value: "HOLD", label: "Hold" },
          { value: "MEMO", label: "Memo" },
          { value: "SOLD", label: "Sold" },
        ];
      case "HOLD":
        return [
          { value: "HOLD_RETURN", label: "Hold Return" },
          { value: "MEMO", label: "Memo" },
          { value: "SOLD", label: "Sold" },
        ];
      case "MEMO":
        return [
          { value: "MEMO_RETURN", label: "Memo Return" },
          { value: "HOLD", label: "Hold" },
          { value: "SOLD", label: "Sold" },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inventory Operation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="operation">Operation *</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableOperations().map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(operation === "HOLD" || operation === "MEMO" || operation === "SOLD") && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Select
                value={companyName}
                onValueChange={setCompanyName}
                disabled={isLoadingMasters}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingMasters ? "Loading companies..." : "Select a company"} />
                </SelectTrigger>
                <SelectContent>
                  {masters.map((master) => (
                    <SelectItem key={master.id} value={master.companyName}>
                      {master.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="referenceNo">Reference No</Label>
            <Input
              id="referenceNo"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="Enter reference number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lotLocation">Lot Location</Label>
            <Input
              id="lotLocation"
              value={lotLocation}
              onChange={(e) => setLotLocation(e.target.value)}
              placeholder="Enter location (e.g., NY, LA)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Perform Operation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
