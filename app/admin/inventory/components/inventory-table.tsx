"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryForm } from "./inventory-form";
import type { Inventory } from "@/types/inventory";

interface InventoryTableProps {
  isLoading: boolean;
  inventory?: Inventory[];
  userRole: "ADMIN" | "EMPLOYEE";
  onDelete: () => void;
}

export function InventoryTable({
  isLoading,
  inventory,
  userRole,
  onDelete,
}: InventoryTableProps) {
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete item");
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSuccess = () => {
    setEditingItemId(null);
    onDelete(); // Refetch the data
  };

  const handleExportCSV = () => {
    if (!inventory) return;

    const items = selectedItems.length > 0
      ? inventory.filter(item => selectedItems.includes(item.id))
      : inventory;

    const headers = [
      "Sr No.",
      "Held By Company",
      "Status",
      "Stock ID",
      "Shape",
      "Carat",
      "Color",
      "Clarity",
      "Cut",
      "Polish",
      "Symmetry",
      "Certificate",
      "Lab",
      "Price/Ct",
      "Amount",
    ];

    const csvContent = [
      headers.join(","),
      ...items.map((item, index) => [
        index + 1,
        item.heldByCompany || "",
        item.status,
        item.stockId,
        item.shape,
        item.carat,
        item.color,
        item.clarity,
        item.cut || "",
        item.polish,
        item.symmetry,
        item.certificateNo || "",
        item.lab,
        item.pricePerCarat,
        item.amount,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Items</CardTitle>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={!inventory?.length}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No.</TableHead>
              <TableHead>Held By Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock ID</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Shape</TableHead>
              <TableHead>Carat</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Clarity</TableHead>
              <TableHead>Cut</TableHead>
              <TableHead>Polish</TableHead>
              <TableHead>Sym</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Price/Ct</TableHead>
              <TableHead>Amount (Red Price)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.heldByCompany || "-"}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.stockId}</TableCell>
                <TableCell>
                  {(item.imageUrl || item.videoUrl || item.certificateUrl) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.imageUrl && (
                          <DropdownMenuItem
                            onClick={() => window.open(item.imageUrl!, "_blank")}
                          >
                            Image
                          </DropdownMenuItem>
                        )}
                        {item.videoUrl && (
                          <DropdownMenuItem
                            onClick={() => window.open(item.videoUrl!, "_blank")}
                          >
                            Video
                          </DropdownMenuItem>
                        )}
                        {item.certificateUrl && (
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(item.certificateUrl!, "_blank")
                            }
                          >
                            Certificate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
                <TableCell>{item.shape}</TableCell>
                <TableCell>{item.carat}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.clarity}</TableCell>
                <TableCell>{item.cut || "-"}</TableCell>
                <TableCell>{item.polish}</TableCell>
                <TableCell>{item.symmetry}</TableCell>
                <TableCell>{item.certificateNo || "-"}</TableCell>
                <TableCell>{item.lab}</TableCell>
                <TableCell>{item.pricePerCarat}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                    <span className="text-red-500 text-sm font-medium">
                      ${(item.amount * (1 - (item.discountPercent || 5) / 100)).toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {userRole === "ADMIN" && (
                    <div className="flex items-center gap-2">
                      <Dialog 
                        open={editingItemId === item.id} 
                        onOpenChange={(open) => setEditingItemId(open ? item.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Inventory Item</DialogTitle>
                          </DialogHeader>
                          <InventoryForm
                            initialData={{
                              stockId: item.stockId,
                              heldByCompany: item.heldByCompany || "",
                              status: item.status,
                              shape: item.shape,
                              carat: item.carat,
                              color: item.color,
                              clarity: item.clarity,
                              cut: item.cut || "",
                              polish: item.polish,
                              symmetry: item.symmetry,
                              certificateNo: item.certificateNo || "",
                              lab: item.lab,
                              pricePerCarat: item.pricePerCarat,
                              amount: item.amount,
                              imageUrl: item.imageUrl || "",
                              videoUrl: item.videoUrl || "",
                              certificateUrl: item.certificateUrl || "",
                              measurement: item.measurement || "",
                              location: item.location || "",
                            }}
                            isEditing
                            inventoryId={item.id}
                            onSuccess={handleEditSuccess}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this item? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!inventory || inventory.length === 0) && (
              <TableRow>
                <TableCell colSpan={17} className="text-center">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[150px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-[40px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
