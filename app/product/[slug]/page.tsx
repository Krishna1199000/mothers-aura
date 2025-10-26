"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { MegaMenu } from "@/components/MegaMenu";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  certificateNo?: string;
  lab?: string;
  stock: number;
  images: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("7");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { checkStockAndAdd } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the specific product
        const productResponse = await fetch(`/api/products/${slug}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData);
        }
        
        // Always fetch all products for the "You may also love" section
        const allProductsResponse = await fetch('/api/admin/products');
        if (allProductsResponse.ok) {
          const allProductsData = await allProductsResponse.json();
          setAllProducts(allProductsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, toast]);

  const handleAddToCart = async () => {
    if (!product) return;

    const success = await checkStockAndAdd({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    if (success) {
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MegaMenu isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen">
        <MegaMenu isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
        <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find the product you&apos;re looking for.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>

        {allProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">You may also love...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/product/${item.slug}`)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={item.images[0] || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.shape} • {item.carat}ct • {item.color} • {item.clarity}
                    </p>
                    <p className="text-xl font-bold">${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Helper function to check if URL is a valid image
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    return imageExtensions.test(url) || url.includes('image') || url.includes('photo');
  };

  if (!product) return null;

  // Filter out non-image URLs
  const validImages = product.images.filter(img => isValidImageUrl(img));
  const displayImages = validImages.length > 0 ? validImages : product.images;

  return (
    <div className="min-h-screen">
      <MegaMenu isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {displayImages.map((image, index) => {
                const isImage = isValidImageUrl(image);
                return (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative">
                      {isImage ? (
                        <Image
                          src={image}
                          alt={`${product.name} - View ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback to regular img tag on error
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.image-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'block';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                          <div className="text-center p-4">
                            <p className="text-sm text-muted-foreground">Media Link:</p>
                            <a 
                              href={image} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {image}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="image-fallback" style={{ display: 'none' }}>
                        <Image src={image} alt={`${product.name} - View ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Thumbnail Navigation */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative cursor-pointer rounded-md overflow-hidden"
                >
                  {isValidImageUrl(image) ? (
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover hover:opacity-75 transition"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs">Link</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-semibold">
              ${product.price.toLocaleString()}
            </span>
            <Badge>Only One Made</Badge>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {Array.from({ length: 13 }, (_, i) => i + 4).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4 mb-8">
            <Button onClick={handleAddToCart} className="w-full">
              Add to cart
            </Button>
            <Button variant="outline" className="w-full">
              Contact to Customize
            </Button>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="diamond">Diamond Details</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="prose max-w-none">
                <p>{product.description || "No description available."}</p>
                <div className="mt-4">
                  <h4 className="font-semibold">Our Commitment To You</h4>
                  <ul className="list-disc pl-4 mt-2">
                    <li>Complimentary cleanings</li>
                    <li>Professional Appraisal</li>
                    <li>Lifetime Warranty</li>
                    <li>Secure Shipments</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="diamond">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Specifications</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Shape</dt>
                      <dd>{product.shape}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Carat</dt>
                      <dd>{product.carat}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Color</dt>
                      <dd>{product.color}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Clarity</dt>
                      <dd>{product.clarity}</dd>
                    </div>
                    {product.cut && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Cut</dt>
                        <dd>{product.cut}</dd>
                      </div>
                    )}
                    {product.polish && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Polish</dt>
                        <dd>{product.polish}</dd>
                      </div>
                    )}
                    {product.symmetry && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Symmetry</dt>
                        <dd>{product.symmetry}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Certification</h4>
                  {product.certificateNo && (
                    <div className="mb-2">
                      <dt className="text-sm text-muted-foreground">Certificate Number</dt>
                      <dd>{product.certificateNo}</dd>
                    </div>
                  )}
                  {product.lab && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Laboratory</dt>
                      <dd>{product.lab}</dd>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Processing Time */}
          <div className="mt-8 text-sm text-muted-foreground">
            <h4 className="font-semibold text-foreground mb-2">Processing Time</h4>
            <p>
              In stock items will be processed within 1-2 business days. Custom pieces have potential for a rush order, please email info@mothersaura.com to accommodate your request.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
