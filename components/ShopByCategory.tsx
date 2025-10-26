"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Static categories with custom images
const staticCategories = [
  {
    id: "1",
    title: 'Gems',
    type: 'gems',
    image: '/luxury-diamond-macro-close-up.jpg',
    alt: 'Precious gems collection'
  },
  {
    id: "2", 
    title: 'Diamonds',
    type: 'diamonds',
    image: '/luxury-diamond-ring-collection.jpg',
    alt: 'Premium diamond collection'
  },
  {
    id: "3",
    title: 'Rings',
    type: 'rings', 
    image: '/elegant-diamond-engagement-ring.jpg',
    alt: 'Elegant diamond rings'
  }
];

export const ShopByCategory = () => {
  const router = useRouter();

  const handleCategoryClick = async (type: string) => {
    try {
      // For all categories, search for diamonds
      const response = await fetch(`/api/categories/map?type=diamonds`);
      if (!response.ok) throw new Error("Failed to map category");
      const data = await response.json();

      // Store the results in localStorage for the target page
      localStorage.setItem("categoryResults", JSON.stringify(data));

      // Navigate to the diamonds category page
      router.push(`/category/diamonds`);
    } catch (error) {
      console.error("Error mapping category:", error);
      router.push(`/category/diamonds`); // Fallback to direct navigation
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium diamonds and fine jewellery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {staticCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.type)}
              className="group relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
                  <span className="text-sm">Shop now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};