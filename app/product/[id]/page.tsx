"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/contexts/cart-context";
import { Loader2, Plus, Minus, ShoppingBag } from "lucide-react";
import { MegaMenu } from "@/components/MegaMenu";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  subcategory?: {
    name: string;
    slug: string;
  };
}

export default function ProductPage() {
  const params = useParams();
	const router = useRouter();
	const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { checkStockAndAdd } = useCart();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to fetch product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, toast]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!session) {
      // Save the current product and quantity to localStorage
      localStorage.setItem('pendingCartItem', JSON.stringify({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      }));
      
      // Redirect to sign in with return URL
      router.push(`/signin?redirect=${encodeURIComponent(`/product/${product.id}`)}`);
      return;
    }

    const success = await checkStockAndAdd({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
    });

    if (success) {
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} has been added to your cart`,
      });
      
      // Refresh product data to show updated stock
      const response = await fetch(`/api/products/${product.id}`);
      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
      }

      // Redirect to customer cart page for signed-in users
      router.push('/customer/cart');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MegaMenu isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <MegaMenu isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MegaMenu isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg border overflow-hidden ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= product.stock) {
                      setQuantity(val);
                    }
                  }}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>

              {!session && (
                <p className="text-sm text-muted-foreground text-center">
                  You&apos;ll need to sign in to complete your purchase
                </p>
              )}
            </div>

            {/* Category and Subcategory */}
            <div className="pt-6 border-t space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Category: </span>
                <span className="font-medium">{product.category.name}</span>
              </div>
              {product.subcategory && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Subcategory:{" "}
                  </span>
                  <span className="font-medium">{product.subcategory.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}