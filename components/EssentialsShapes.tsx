"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const essentials = [
  {
    id: 1,
    title: 'Traditional Wear',
    type: 'traditional',
    description: 'Classic pieces for timeless elegance',
    image: '/traditional-diamond-jewelry.jpg'
  },
  {
    id: 2,
    title: 'Spiritual Wear',
    type: 'spiritual',
    description: 'Meaningful jewellery for special moments',
    image: '/spiritual-diamond-jewelry.jpg'
  },
  {
    id: 3,
    title: 'Party Wear',
    type: 'party',
    description: 'Statement pieces that shine bright',
    image: '/party-diamond-jewelry.jpg'
  },
  {
    id: 4,
    title: 'Everyday Wear',
    type: 'everyday',
    description: 'Comfortable luxury for daily elegance',
    image: '/everyday-diamond-jewelry.jpg'
  }
];

export const EssentialsSection = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEssentialClick = async (type: string) => {
    try {
      setIsLoading(true);

      // Fetch mapped products
      const response = await fetch(`/api/categories/map?type=${type}`);
      if (!response.ok) throw new Error("Failed to map category");
      const data = await response.json();

      // Store the results in localStorage for the target page
      localStorage.setItem("categoryResults", JSON.stringify(data));

      // Navigate to the category page
      router.push(`/category/${type}`);
    } catch (error) {
      console.error("Error mapping category:", error);
      router.push(`/category/${type}`); // Fallback to direct navigation
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading essentials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Essentials for You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect piece for every occasion and moment in your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {essentials.map((essential) => (
            <button
              key={essential.id}
              onClick={() => handleEssentialClick(essential.type)}
              className="group text-left"
            >
              <div className="relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-square overflow-hidden relative">
                  <Image
                    src={essential.image}
                    alt={essential.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    width={400}
                    height={400}
                  />
                  {/* Add subtle dark gradient for traditional jewelry to match other cards */}
                  {essential.type === 'traditional' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
                  )}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2">{essential.title}</h3>
                  <p className="text-white/90 text-sm mb-4">{essential.description}</p>
                  <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
                    <span className="text-sm">Explore</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};