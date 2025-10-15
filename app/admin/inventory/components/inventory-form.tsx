"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
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
  type InventoryFormData,
} from "@/types/inventory";

interface Master {
  id: string;
  companyName: string;
}

interface InventoryFormProps {
  onSuccess: () => void;
  initialData?: InventoryFormData;
  isEditing?: boolean;
  inventoryId?: string;
}

export function InventoryForm({
  onSuccess,
  initialData,
  isEditing,
  inventoryId,
}: InventoryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoadingMasters, setIsLoadingMasters] = useState(false);
  const [formData, setFormData] = useState<InventoryFormData>(
    initialData || {
      stockId: "",
      heldByCompany: "",
      status: "AVAILABLE",
      shape: "",
      carat: 0,
      color: "",
      clarity: "",
      cut: "",
      polish: "",
      symmetry: "",
      certificateNo: "",
      lab: "",
      pricePerCarat: 0,
      amount: 0,
      discountPercent: 5.0,
      imageUrl: "",
      videoUrl: "",
      certificateUrl: "",
      measurement: "",
      location: "",
    }
  );

  // Fetch masters for held by company dropdown
  useEffect(() => {
    const fetchMasters = async () => {
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

    if (isEditing) {
      fetchMasters();
    }
  }, [isEditing, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.stockId || !formData.shape || !formData.carat || !formData.color || !formData.clarity || !formData.polish || !formData.symmetry || !formData.lab || !formData.pricePerCarat) {
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
        ? `/api/admin/inventory/${inventoryId}`
        : "/api/admin/inventory";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save inventory item");
      }

      toast({
        title: "Success",
        description: `Inventory item ${isEditing ? "updated" : "created"} successfully`,
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
    <form onSubmit={handleSubmit} className="space-y-4 pr-2">
      <div className="space-y-2">
        <Label htmlFor="stockId">Stock ID*</Label>
        <Input
          id="stockId"
          value={formData.stockId}
          onChange={(e) =>
            setFormData({ ...formData, stockId: e.target.value })
          }
          required
        />
      </div>

      {/* Only show these fields when editing */}
      {isEditing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="heldByCompany">Held By Company</Label>
            <Select
              value={formData.heldByCompany || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, heldByCompany: value === "none" ? "" : value })
              }
              disabled={isLoadingMasters}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingMasters ? "Loading companies..." : "Select a company"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {masters.map((master) => (
                  <SelectItem key={master.id} value={master.companyName}>
                    {master.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status*</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "AVAILABLE" | "HOLD" | "MEMO" | "SOLD") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="HOLD">Hold</SelectItem>
                <SelectItem value="MEMO">Memo</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="shape">Shape*</Label>
        <Input
          id="shape"
          value={formData.shape}
          onChange={(e) =>
            setFormData({ ...formData, shape: e.target.value })
          }
          placeholder="Enter shape"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carat">Carat*</Label>
        <Input
          id="carat"
          type="number"
          step="0.01"
          value={formData.carat || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              carat: parseFloat(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color*</Label>
        <Input
          id="color"
          value={formData.color}
          onChange={(e) =>
            setFormData({ ...formData, color: e.target.value })
          }
          placeholder="Enter color"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clarity">Clarity*</Label>
        <Input
          id="clarity"
          value={formData.clarity}
          onChange={(e) =>
            setFormData({ ...formData, clarity: e.target.value })
          }
          placeholder="Enter clarity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cut">Cut</Label>
        <Input
          id="cut"
          value={formData.cut}
          onChange={(e) =>
            setFormData({ ...formData, cut: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="polish">Polish*</Label>
        <Input
          id="polish"
          value={formData.polish}
          onChange={(e) =>
            setFormData({ ...formData, polish: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symmetry">Symmetry*</Label>
        <Input
          id="symmetry"
          value={formData.symmetry}
          onChange={(e) =>
            setFormData({ ...formData, symmetry: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificateNo">Certificate Number</Label>
        <Input
          id="certificateNo"
          value={formData.certificateNo}
          onChange={(e) =>
            setFormData({ ...formData, certificateNo: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lab">Lab*</Label>
        <Input
          id="lab"
          value={formData.lab}
          onChange={(e) =>
            setFormData({ ...formData, lab: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pricePerCarat">Price/Ct*</Label>
        <Input
          id="pricePerCarat"
          type="number"
          step="0.01"
          value={formData.pricePerCarat || ""}
          onChange={(e) => {
            const price = parseFloat(e.target.value) || 0;
            setFormData({
              ...formData,
              pricePerCarat: price,
              amount: price * formData.carat,
            });
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount || ""}
          readOnly
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discountPercent">Discount Percentage (%)</Label>
        <Input
          id="discountPercent"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.discountPercent || 5}
          onChange={(e) =>
            setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 5 })
          }
        />
        <p className="text-sm text-muted-foreground">
          Default: 5%. This will be applied to calculate the red price.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificateUrl">Certificate URL</Label>
        <Input
          id="certificateUrl"
          value={formData.certificateUrl}
          onChange={(e) =>
            setFormData({ ...formData, certificateUrl: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="measurement">Measurement</Label>
        <Input
          id="measurement"
          value={formData.measurement}
          onChange={(e) =>
            setFormData({ ...formData, measurement: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
          ? "Update Item"
          : "Create Item"}
      </Button>
    </form>
  );
}
