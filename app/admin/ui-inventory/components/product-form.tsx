"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface ProductFormProps {
  categories: Category[];
  subcategories: Subcategory[];
  initialData?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    carat?: number;
    cut?: string;
    color?: string;
    clarity?: string;
    stock: number;
    images: string[];
    categoryId: string;
    subcategoryId?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description?: string;
  price: number;
  carat?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  stock: number;
  images: string[];
  categoryId: string;
  subcategoryId?: string;
}

export function ProductForm({
  categories,
  subcategories,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      carat: initialData?.carat || undefined,
      cut: initialData?.cut || undefined,
      color: initialData?.color || undefined,
      clarity: initialData?.clarity || undefined,
      stock: initialData?.stock || 0,
      images: initialData?.images || [],
      categoryId: initialData?.categoryId || "",
      subcategoryId: initialData?.subcategoryId || undefined,
    },
  });

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    if (selectedCategoryId) {
      setFilteredSubcategories(
        subcategories.filter((sub) => sub.categoryId === selectedCategoryId)
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategoryId, subcategories]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const url = isEditing
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: `Successfully ${isEditing ? "updated" : "created"} product "${
          data.name
        }"`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    const currentImages = watch("images");
    setValue("images", [...currentImages, url]);
  };

  const handleImageRemove = (index: number) => {
    const currentImages = watch("images");
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Product name"
          disabled={isLoading}
        />
        {errors.name && (
          <span className="text-sm text-destructive">{errors.name.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          {...register("description")}
          placeholder="Description (optional)"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
            placeholder="Price"
            disabled={isLoading}
          />
          {errors.price && (
            <span className="text-sm text-destructive">{errors.price.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            {...register("stock", { required: "Stock is required" })}
            placeholder="Stock"
            disabled={isLoading}
          />
          {errors.stock && (
            <span className="text-sm text-destructive">{errors.stock.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            type="number"
            step="0.01"
            {...register("carat")}
            placeholder="Carat (optional)"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register("cut")}
            placeholder="Cut (optional)"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            {...register("color")}
            placeholder="Color (optional)"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register("clarity")}
            placeholder="Clarity (optional)"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Select
          value={watch("categoryId")}
          onValueChange={(value) => {
            setValue("categoryId", value);
            setValue("subcategoryId", undefined);
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <span className="text-sm text-destructive">
            {errors.categoryId.message}
          </span>
        )}
      </div>

      {filteredSubcategories.length > 0 && (
        <div className="space-y-2">
          <Select
            value={watch("subcategoryId")}
            onValueChange={(value) => setValue("subcategoryId", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory (optional)" />
            </SelectTrigger>
            <SelectContent>
              {filteredSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {watch("images").map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleImageRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <ImageUpload 
          onUpload={handleImageUpload} 
          currentImageUrl=""
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update" : "Create"} Product
        </Button>
      </div>
    </motion.form>
  );
}
