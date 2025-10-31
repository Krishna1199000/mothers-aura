"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearCartWithoutRestore: () => void;
  isLoading: boolean;
  subtotal: number;
  checkStockAndAdd: (item: CartItem) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Load cart from localStorage on mount (guard against StrictMode double-invoke)
  const hasLoadedFromStorage = useRef(false);
  useEffect(() => {
    if (hasLoadedFromStorage.current) return;
    hasLoadedFromStorage.current = true;

    if (session?.user) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const normalized = Array.isArray(parsed)
            ? parsed.reduce((map, item) => {
                const key = item.productId;
                const existing = map[key];
                if (existing) {
                  existing.quantity += item.quantity;
                } else {
                  map[key] = { ...item };
                }
                return map;
              }, {})
            : {};
          setItems(Object.values(normalized));
        } catch {
          localStorage.removeItem("cart");
          setItems([]);
        }
      }
    } else {
      // Guest: ensure localStorage is fully cleared to remove any stale/ghost data
      localStorage.removeItem("cart");
      setItems([]);
    }
    setIsLoading(false);
  }, [session?.user]);

  useEffect(() => {
    if (!isLoading && session?.user) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
    // Guests: do not persist cart
  }, [items, isLoading, session?.user]);

  // Sync with database when user logs in
  const hasSyncedWithDb = useRef(false);
  useEffect(() => {
    const syncCart = async () => {
      if (!session?.user) return;
      if (hasSyncedWithDb.current) return;
      hasSyncedWithDb.current = true;
      try {
        setIsLoading(true);

        // Get the user's cart from the database (if any)
        const response = await fetch("/api/cart");
        const dbCart = await response.json();

        // Read any locally stored cart
        const localCart: CartItem[] = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        let nextItems: CartItem[] = [];

        if (Array.isArray(dbCart?.items) && dbCart.items.length > 0) {
          // Prefer the database as source of truth when it has items
          nextItems = dbCart.items as CartItem[];
        } else if (localCart.length > 0) {
          // If DB is empty but local has items, push local cart to DB once
          nextItems = localCart;
          await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: nextItems }),
          });
        } else {
          nextItems = [];
        }

        // Persist the resolved cart to localStorage and state
        localStorage.setItem("cart", JSON.stringify(nextItems));
        setItems(nextItems);
      } catch (error) {
        console.error("Error syncing cart:", error);
        toast.error("Error", {
          description: "Failed to sync cart with your account",
        });
      } finally {
        setIsLoading(false);
      }
    };

    syncCart();
  }, [session]);

  const addItem = async (newItem: CartItem) => {
    const updatedItems = [...items];
    const existingItemIndex = updatedItems.findIndex(
      (item) => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      updatedItems[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Add new item if it doesn't exist
      updatedItems.push(newItem);
    }

    setItems(updatedItems);

    // Sync with database if user is logged in
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedItems }),
        });
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Error", {
          description: "Failed to update cart",
        });
      }
    }
  };

  const removeItem = async (productId: string) => {
    // Find the item to get its quantity for stock restoration
    const itemToRemove = items.find((item) => item.productId === productId);
    
    // Remove the item completely from cart
    const updatedItems = items.filter((item) => item.productId !== productId);
    setItems(updatedItems);

    // Restore stock when item is removed
    if (itemToRemove) {
      try {
        await fetch(`/api/products/${productId}/restore-stock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: itemToRemove.quantity }),
        });
      } catch (error) {
        console.error("Error restoring stock:", error);
      }
    }

    // Sync with database if user is logged in
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedItems }),
        });
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Error", {
          description: "Failed to update cart",
        });
      }
    }
    toast.success("Item Removed", {
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    const currentItem = items.find((item) => item.productId === productId);
    if (!currentItem) return;

    const quantityDifference = newQuantity - currentItem.quantity;

    const updatedItems = items.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);

    // Update stock based on quantity change
    if (quantityDifference !== 0) {
      try {
        if (quantityDifference > 0) {
          // Reducing stock
          await fetch(`/api/products/${productId}/check-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestedQuantity: quantityDifference }),
          });
        } else {
          // Restoring stock
          await fetch(`/api/products/${productId}/restore-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: Math.abs(quantityDifference) }),
          });
        }
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    }

    // Sync with database if user is logged in
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedItems }),
        });
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Error", {
          description: "Failed to update cart",
        });
      }
    }
    toast.success("Quantity Updated", {
      description: "Cart quantity has been updated",
    });
  };

  const clearCart = async () => {
    // Restore stock for all items before clearing
    for (const item of items) {
      try {
        await fetch(`/api/products/${item.productId}/restore-stock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity }),
        });
      } catch (error) {
        console.error("Error restoring stock for item:", item.productId, error);
      }
    }

    setItems([]);
    // Eagerly clear localStorage to avoid any stale reads during refreshes
    try {
      localStorage.setItem("cart", JSON.stringify([]));
    } catch {}

    // Clear from database if user is logged in
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [] }),
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Error", {
          description: "Failed to clear cart",
        });
      }
    }
    toast.success("Cart Cleared", {
      description: "All items have been removed from your cart",
    });
  };

  const clearCartWithoutRestore = async () => {
    setItems([]);
    try {
      localStorage.setItem("cart", JSON.stringify([]));
    } catch {}

    // Clear from database if user is logged in
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [] }),
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Error", {
          description: "Failed to clear cart",
        });
      }
    }
  };

  const checkStockAndAdd = async (item: CartItem): Promise<boolean> => {
    // Check if user is signed in
    if (!session?.user) {
      toast.error("Sign in required", {
        description: "Please sign in to add items to your cart",
      });
      router.push("/signin?redirect=" + encodeURIComponent(window.location.pathname));
      return false;
    }

    try {
      // Check stock availability
      const response = await fetch(`/api/products/${item.productId}/check-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedQuantity: item.quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Stock unavailable", {
          description: error.message || "Insufficient stock available",
        });
        return false;
      }

      // Stock is available, add to cart
      addItem(item);
      toast.success("Added to cart", {
        description: `${item.name} has been added to your cart`,
      });
      return true;
    } catch (error) {
      console.error("Error checking stock:", error);
      toast.error("Error", {
        description: "Failed to check stock availability",
      });
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearCartWithoutRestore,
        isLoading,
        subtotal,
        checkStockAndAdd,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
