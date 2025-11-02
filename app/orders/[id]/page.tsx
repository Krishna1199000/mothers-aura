"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";

interface Order {
  id: string;
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

export default function OrderConfirmationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session && orderId) {
      fetchOrder();
    }
  }, [session, orderId, toast]);

  if (!session) {
    router.push("/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button
            variant="link"
            onClick={() => router.push("/dashboard")}
            className="mt-4"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground mt-2">
              Thank you for your order. We&apos;ll notify you about the status updates.
            </p>
          </div>

          <div className="space-y-8">
            {/* Order Details */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-medium">
                    ${order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p>${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Name: </span>
                  {order.shippingInfo.fullName}
                </p>
                <p>
                  <span className="text-muted-foreground">Email: </span>
                  {order.shippingInfo.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone: </span>
                  {order.shippingInfo.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Address: </span>
                  {order.shippingInfo.address}
                </p>
                {order.shippingInfo.notes && (
                  <p>
                    <span className="text-muted-foreground">Notes: </span>
                    {order.shippingInfo.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button onClick={() => window.print()}>Print Order</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
}
