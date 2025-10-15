"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/contexts/cart-context";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  subcategory?: string;
}

interface CategoryResults {
  products: Product[];
  isExactMatch: boolean;
  message?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { checkStockAndAdd } = useCart();
  const [results, setResults] = useState<CategoryResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get results from localStorage first
    const storedResults = localStorage.getItem("categoryResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
      localStorage.removeItem("categoryResults"); // Clear after using
      setIsLoading(false);
      return;
    }

    // If no stored results, fetch based on URL params
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("category", params.slug as string);
        
        // Add any additional search params
        for (const [key, value] of searchParams.entries()) {
          queryParams.append(key, value);
        }

        const response = await fetch(`/api/categories/map?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [params.slug, searchParams, toast]);

  const handleAddToCart = async (product: Product) => {
    const success = await checkStockAndAdd({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });

    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold capitalize mb-2">
            {(params.slug as string)?.toString().replace(/-/g, " ")}
          </h1>
          {results?.message && (
            <p className="text-muted-foreground">{results.message}</p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results?.products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold">${product.price.toLocaleString()}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock < 1}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {(!results?.products || results.products.length === 0) && (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">
              We couldn&apos;t find any products matching your criteria.
              </p>
          </div>
        )}
      </div>
    </div>
  );
}