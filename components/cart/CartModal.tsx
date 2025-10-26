"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/contexts/cart-context";
import { ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export function CartModal({ open, onClose }: CartModalProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, subtotal } = useCart();

// We rely on onOpenChange prop to close; no router event support in App Router

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    router.push("/customer/cart");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                router.push("/orders/history");
                onClose();
              }}
            >
              Purchase History
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in cart
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">
              Add items to your cart to continue shopping
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push("/orders/history");
                onClose();
              }}
            >
              View Purchase History
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[65vh] pr-6">
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", duration: 0.3 }}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                          <Image
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                              ${item.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Total Price */}
                            <p className="font-medium">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator className="mt-6" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">${subtotal.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Shipping and tax will be calculated at checkout
                </p>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}