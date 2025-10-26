"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/contexts/wishlist-context";
import { useCart } from "@/lib/contexts/cart-context";
import { ShoppingBag, Heart, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { checkStockAndAdd } = useCart();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleAddToCart = async (item: any) => {
    const success = await checkStockAndAdd({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });

    if (success) {
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromWishlist(itemId);
  };

  const handleClearWishlist = async () => {
    setIsClearing(true);
    await clearWishlist();
    setIsClearing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Wishlist Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {/* Clear Wishlist Button */}
        {wishlist.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Wishlist
            </Button>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Card className="overflow-hidden h-full flex flex-col bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span> {item.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Added:</span> {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <Button
                        className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding items to your wishlist by clicking the heart icon on any product.
            </p>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="px-8 py-3"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

