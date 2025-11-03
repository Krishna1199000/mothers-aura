"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Static categories with custom images
const staticCategories = [
  {
    id: "1",
    title: 'Engagement Rings',
    type: 'engagement-rings',
    image: '/engagement-rings.png',
    alt: 'Elegant engagement rings'
  },
  {
    id: "2", 
    title: 'Women Wedding Ring',
    type: 'women-wedding-ring',
    image: '/Womenweddingring.png',
    alt: 'Women wedding rings'
  },
  {
    id: "3",
    title: 'Mens Wedding Ring',
    type: 'mens-wedding-ring',
    image: '/MenWeddingring.png',
    alt: 'Mens wedding rings'
  },
  {
    id: "4",
    title: 'Earrings',
    type: 'earrings', 
    image: '/earrings.png',
    alt: 'Diamond earrings'
  },
  {
    id: "5",
    title: 'Bracelets',
    type: 'bracelets',
    image: '/bracelets.png',
    alt: 'Diamond bracelets'
  },
  {
    id: "6",
    title: 'Necklace',
    type: 'necklace',
    image: '/Womennecklace.png',
    alt: 'Diamond necklaces'
  },
  {
    id: "7",
    title: 'Waist Chain',
    type: 'waist-chain',
    image: '/Waistchain.png',
    alt: 'Waist chains'
  },
  {
    id: "8",
    title: 'Pendent',
    type: 'pendent',
    image: '/diamond-pendant-necklace.jpg',
    alt: 'Diamond pendent'
  }
];

export const ShopByCategory = () => {
  const router = useRouter();

  const handleCategoryClick = async (type: string) => {
    try {
      // Map category type to search query
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
    }
  };

  const firstRow = staticCategories.slice(0, 4);
  const secondRow = staticCategories.slice(4, 8);

  const CategoryCard = ({ id, title, type, image, alt }: (typeof staticCategories)[number]) => (
    <button
      key={id}
      onClick={() => handleCategoryClick(type)}
      className="group relative w-full overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-2"
    >
      <div className="aspect-square overflow-hidden relative">
        {type === 'pendent' ? (
          <>
            <Image
              src="/pendent.png"
              alt={alt}
              className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
              loading="lazy"
              width={800}
              height={800}
            />
            <Image
              src={image}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              loading="lazy"
              width={800}
              height={800}
            />
          </>
        ) : (
          <Image
            src={image}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            width={800}
            height={800}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className={`text-xl md:text-2xl font-bold mb-2 ${title === 'Women Wedding Ring' ? 'whitespace-nowrap' : ''}`}>{title}</h3>
        <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
          <span className="text-sm">Shop now</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium diamonds and fine jewellery
          </p>
        </div>

        {/* First row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {firstRow.map(CategoryCard as any)}
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondRow.map(CategoryCard as any)}
        </div>
      </div>
    </section>
  );
};