"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/lib/contexts/cart-context";
import { Loader2 } from "lucide-react";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { items, subtotal, clearCartWithoutRestore } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      email: session?.user?.email || "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: subtotal,
          shippingInfo: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      // Clear the cart after successful order
      clearCartWithoutRestore();

      // Show success message
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.orderNumber || order.id.slice(0, 8)} has been placed.`,
      });

      // Redirect to purchase history
      router.push("/orders/history");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if no items
  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid gap-8">
            {/* Order Summary */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center"
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
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    {...register("fullName", { required: "Name is required" })}
                    placeholder="Full Name / Company Name"
                  />
                  {errors.fullName && (
                    <span className="text-sm text-destructive">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <span className="text-sm text-destructive">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    {...register("phone", { required: "Phone is required" })}
                    type="tel"
                    placeholder="Phone"
                  />
                  {errors.phone && (
                    <span className="text-sm text-destructive">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                <div>
                  <Textarea
                    {...register("address", { required: "Address is required" })}
                    placeholder="Shipping Address"
                    rows={3}
                  />
                  {errors.address && (
                    <span className="text-sm text-destructive">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div>
                  <Textarea
                    {...register("notes")}
                    placeholder="Order Notes (optional)"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Place Order
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
