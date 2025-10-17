"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Download, Settings } from "lucide-react";
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
import { CreateMemoDialog } from "./create-memo-dialog";
import { CreateInvoiceDialog } from "./create-invoice-dialog";
import DiamondHistoryModal from "./diamond-history-modal";
import { InventoryOperationsDialog } from "./inventory-operations-dialog";

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
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  const [operationsDialogOpen, setOperationsDialogOpen] = useState(false);
  const [selectedItemForOperation, setSelectedItemForOperation] = useState<Inventory | null>(null);

  // Function to get visible price columns based on user role
  const getVisiblePriceColumns = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          { key: "askingAmount", label: "Asking" },
          { key: "greenAmount", label: "Green" },
          { key: "redAmount", label: "Red" },
          { key: "superRedAmount", label: "Super Red" }
        ];
      case "EMPLOYEE":
        return [
          { key: "askingAmount", label: "Asking" },
          { key: "greenAmount", label: "Green" },
          { key: "redAmount", label: "Red" }
        ];
      default:
        return [
          { key: "askingAmount", label: "Asking" }
        ];
    }
  };

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
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
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
      "Asking Amount",
      "Green Amount",
      "Red Amount",
      "Super Red Amount",
      "Green %",
      "Red %",
      "Super Red %",
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
        item.pricePerCarat || 0,
        item.askingAmount || 0,
        item.greenAmount || 0,
        item.redAmount || 0,
        item.superRedAmount || 0,
        item.greenPercentage || 0,
        item.redPercentage || 0,
        item.superRedPercentage || 0,
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
      <CardHeader>
        <div className="flex flex-row items-center justify-between mb-4">
          <CardTitle>Inventory Items</CardTitle>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    const selected = (inventory || []).filter(item => selectedItems.includes(item.id));
                    const payload = selected.map(item => ({
                      description: `${item.shape} ${item.carat}ct ${item.color}/${item.clarity} ${item.lab} ${item.certificateNo || ""}`,
                      carat: String(item.carat ?? "0"),
                      color: item.color || "",
                      clarity: item.clarity || "",
                      lab: item.lab || "",
                      reportNo: item.certificateNo || "",
                      pricePerCarat: String(((item.askingAmount || 0) && item.carat) ? (item.askingAmount / item.carat) : 0),
                      total: String(item.askingAmount || 0),
                    }));
                    try {
                      sessionStorage.setItem("prefillMemoItems", JSON.stringify(payload));
                    } catch {}
                    router.push("/admin/memos/create");
                  }}
                >
                  Create Memo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const selected = (inventory || []).filter(item => selectedItems.includes(item.id));
                    const payload = selected.map(item => ({
                      description: `${item.shape} ${item.carat}ct ${item.color}/${item.clarity} ${item.lab} ${item.certificateNo || ""}`,
                      carat: String(item.carat ?? "0"),
                      color: item.color || "",
                      clarity: item.clarity || "",
                      lab: item.lab || "",
                      reportNo: item.certificateNo || "",
                      pricePerCarat: String(((item.askingAmount || 0) && item.carat) ? (item.askingAmount / item.carat) : 0),
                      total: String(item.askingAmount || 0),
                    }));
                    try {
                      sessionStorage.setItem("prefillInvoiceItems", JSON.stringify(payload));
                    } catch {}
                    router.push("/admin/invoices/create");
                  }}
                >
                  Create Invoice
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={!inventory?.length}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        {selectedItems.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedItems.length} items selected
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedItems.length === inventory?.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems(inventory?.map(item => item.id) || []);
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
              </TableHead>
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
              {getVisiblePriceColumns().map(column => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems([...selectedItems, item.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      setSelectedInventoryId(item.id);
                      setHistoryDialogOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {item.heldByCompany ? item.heldByCompany : "-"}
                  </button>
                </TableCell>
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
                <TableCell>
                  <span className="font-medium">
                    ${((item.pricePerCarat || 0)).toLocaleString()}
                  </span>
                </TableCell>
                {getVisiblePriceColumns().map(column => (
                  <TableCell key={column.key}>
                    <span className={`font-medium ${
                      column.key === "redAmount" ? "text-red-500" :
                      column.key === "superRedAmount" ? "text-red-700" :
                      column.key === "greenAmount" ? "text-green-600" :
                      ""
                    }`}>
                      ${((item[column.key as keyof Inventory] as number) || 0).toLocaleString()}
                    </span>
                  </TableCell>
                ))}
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
                              pricePerCarat: item.pricePerCarat || 0,
                              askingAmount: item.askingAmount || 0,
                              greenAmount: item.greenAmount || 0,
                              redAmount: item.redAmount || 0,
                              superRedAmount: item.superRedAmount || 0,
                              greenPercentage: item.greenPercentage || 0,
                              redPercentage: item.redPercentage || 0,
                              superRedPercentage: item.superRedPercentage || 0,
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

                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setSelectedItemForOperation(item);
                          setOperationsDialogOpen(true);
                        }}
                        title="Operations (Hold, Memo, Sold)"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

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

      {/* History Modal */}
      <DiamondHistoryModal
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        inventoryId={selectedInventoryId}
      />

      {/* Operations Dialog */}
      {selectedItemForOperation && (
        <InventoryOperationsDialog
          open={operationsDialogOpen}
          onOpenChange={setOperationsDialogOpen}
          inventoryId={selectedItemForOperation.id}
          currentStatus={selectedItemForOperation.status}
          onSuccess={() => {
            // Refresh the inventory data
            window.location.reload();
          }}
        />
      )}

      {/* Memo and Invoice Dialogs */}
      <CreateMemoDialog
        open={memoDialogOpen}
        onOpenChange={setMemoDialogOpen}
        selectedItems={inventory?.filter(item => selectedItems.includes(item.id)) || []}
        onSuccess={() => {
          setSelectedItems([]);
          onDelete();
        }}
      />

      <CreateInvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        selectedItems={inventory?.filter(item => selectedItems.includes(item.id)) || []}
        onSuccess={() => {
          setSelectedItems([]);
          onDelete();
        }}
      />
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
