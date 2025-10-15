"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { CartModal } from "./CartModal";

export default function CartButton() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingBag className="h-5 w-5" />
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center"
            >
              {items.length}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
