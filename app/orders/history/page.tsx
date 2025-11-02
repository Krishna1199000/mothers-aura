"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Eye, ShoppingCart } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Footer } from "@/components/Footer";

interface Order {
  id: string;
  orderNumber: number;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  status: string;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin?redirect=/orders/history");
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch purchase history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      PENDING: { variant: "secondary", label: "Pending" },
      CONFIRMED: { variant: "default", label: "Confirmed" },
      DELIVERED: { variant: "success", label: "Delivered" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber?.toString().includes(searchTerm) ||
      order.shippingInfo.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading purchase history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Purchase History</h1>
            <p className="text-muted-foreground">View your order history and track orders</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={() => router.push("/customer/cart")} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Go to Cart
            </Button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "You haven't placed any orders yet"}
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push("/")}>Start Shopping</Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && selectedOrder && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Order Details - #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-medium">#{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">
                        ${selectedOrder.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Name: </span>
                        {selectedOrder.shippingInfo.fullName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email: </span>
                        {selectedOrder.shippingInfo.email}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone: </span>
                        {selectedOrder.shippingInfo.phone}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Address: </span>
                        {selectedOrder.shippingInfo.address}
                      </p>
                      {selectedOrder.shippingInfo.notes && (
                        <p>
                          <span className="text-muted-foreground">Notes: </span>
                          {selectedOrder.shippingInfo.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t mt-4">
                      <span>Total</span>
                      <span>${selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
    <Footer />
    </>
  );
}
