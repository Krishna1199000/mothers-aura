"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Search, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  shape?: string;
  carat?: number;
  color?: string;
  clarity?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isValidImage = (url: string) => {
    if (!url) return false;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    // Check if it's a valid image URL by extension or if it contains common image indicators
    return imageExtensions.test(url) || url.includes('image') || url.includes('photo');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const images = product.images.filter(img => isValidImage(img));
          const displayImage = hoveredProduct === product.id && images.length > 1 
            ? images[1] 
            : images[0];

          return (
            <motion.div
              key={product.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => router.push(`/product/${product.slug}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-2">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // If image fails to load, show placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.parentElement?.querySelector('.image-placeholder');
                      if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
                
                {/* Placeholder for failed images */}
                <div className="image-placeholder hidden absolute inset-0 items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-sm">Image not available</span>
                </div>
                
                {/* Wishlist Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add wishlist functionality here
                    console.log("Add to wishlist:", product.id);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
              </div>
              
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-xl font-bold">${product.price.toLocaleString()}</p>
            </motion.div>
          );
        })}
      </div>

        {products.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-card border border-border rounded-lg p-12">
              <Search size={64} className="mx-auto text-muted-foreground mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                We currently don&apos;t have this
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                All stocks are sold out, but we&apos;d love to help you find what you&apos;re looking for!
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-primary">📧</span>
                  <span className="text-muted-foreground">Email us:</span>
                  <a 
                    href="mailto:admintejas@mothersauradiamonds.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    admintejas@mothersauradiamonds.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-primary">📞</span>
                  <span className="text-muted-foreground">Call us:</span>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+918657585167" className="text-primary hover:underline font-medium">
                      +91 86575 85167
                    </a>
                    <a href="tel:+917841834563" className="text-primary hover:underline font-medium">
                      +91 78418 34563
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground mt-6 text-base">
                  We&apos;ll arrange it for you and give you something you would also love!
                </p>
              </div>
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Continue Browsing
              </button>
            </div>
        </div>
      )}
      </div>
    </div>
    <Footer />
    </>
  );
}
