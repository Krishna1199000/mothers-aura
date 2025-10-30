"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Search, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  stock: number;
  images: string[];
  category: string;
  subcategory?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExactMatch, setIsExactMatch] = useState(true);

  useEffect(() => {
    const categoryResults = localStorage.getItem('categoryResults');
    
    if (categoryResults) {
      try {
        const data = JSON.parse(categoryResults);
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setIsExactMatch(data.isExactMatch !== false);
        }
      } catch (error) {
        console.error('Error parsing category results:', error);
      }
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        }
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };
    
    fetchAllProducts();
  }, []);

  const isValidImage = (url: string) => {
    if (!url) return false;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    return imageExtensions.test(url) || url.includes('image') || url.includes('photo');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const RenderProductCard = ({ product, index }: { product: Product; index: number }) => {
    const images = product.images.filter(img => isValidImage(img));
    const displayImage = images[0] || '/placeholder.jpg';

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="relative group cursor-pointer"
        onClick={() => router.push(`/product/${product.slug}`)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-3">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {product.price && (
            <span className="text-xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Show "We currently don't have this" message if not exact match */}
        {!isExactMatch && (
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="p-8">
              <Search size={64} className="mx-auto text-muted-foreground mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                We currently don&apos;t have this
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                All stocks are sold out, but we&apos;d love to help you find what you&apos;re looking for!
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="text-primary h-5 w-5" />
                  <span className="text-muted-foreground">Email us:</span>
                  <a 
                    href="mailto:admintejas@mothersauradiamonds.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    admintejas@mothersauradiamonds.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="text-primary h-5 w-5" />
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
            </div>
          </div>
        )}

        {/* Show exact matches header if exact match */}
        {isExactMatch && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 capitalize">{slug} Collection</h1>
            <p className="text-muted-foreground">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        )}

        {/* Show whole collection title if not exact match */}
        {!isExactMatch && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Our Whole Collection</h2>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!isExactMatch ? 
            allProducts.map((product, index) => (
              <RenderProductCard key={product.id} product={product} index={index} />
            ))
            :
            products.map((product, index) => (
              <RenderProductCard key={product.id} product={product} index={index} />
            ))
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}
