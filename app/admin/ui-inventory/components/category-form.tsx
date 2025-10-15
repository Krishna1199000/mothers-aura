"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    description?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description?: string;
}

export function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const url = isEditing 
        ? `/api/admin/categories/${initialData.id}`
        : "/api/admin/categories";
      
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
        title: isEditing ? "Category updated" : "Category created",
        description: `Successfully ${isEditing ? "updated" : "created"} category "${data.name}"`,
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
          placeholder="Category name"
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
          {isEditing ? "Update" : "Create"} Category
        </Button>
      </div>
    </motion.form>
  );
}
