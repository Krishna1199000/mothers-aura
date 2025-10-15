"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

const essentialCategories = [
  { title: "Traditional wear", type: "traditional", image: "/traditional-diamond-jewelry.jpg" },
  { title: "Spiritual wear", type: "spiritual", image: "/spiritual-diamond-jewelry.jpg" },
  { title: "Party wear", type: "party", image: "/party-diamond-jewelry.jpg" },
  { title: "Everyday wear", type: "everyday", image: "/everyday-diamond-jewelry.jpg" },
];

const defaultCategories = [
  {
    id: "1",
    title: 'Engagement Rings',
    type: 'engagement',
    image: '/elegant-diamond-engagement-ring.jpg',
    alt: 'Elegant diamond engagement rings'
  },
  {
    id: "2",
    title: 'Wedding Rings',
    type: 'wedding',
    image: '/wedding-band-rings-set.jpg',
    alt: 'Beautiful wedding ring sets'
  },
  {
    id: "3",
    title: 'Diamond Rings',
    type: 'diamond',
    image: '/luxury-diamond-ring-collection.jpg',
    alt: 'Premium diamond rings'
  },
  {
    id: "4",
    title: 'Pendants',
    type: 'pendant',
    image: '/diamond-pendant-necklace.jpg',
    alt: 'Stunning diamond pendants'
  },
  {
    id: "5",
    title: 'Earrings',
    type: 'earring',
    image: '/diamond-stud-earrings.jpg',
    alt: 'Exquisite diamond earrings'
  },
  {
    id: "6",
    title: 'Bracelets',
    type: 'bracelet',
    image: '/diamond-tennis-bracelet.jpg',
    alt: 'Luxury diamond bracelets'
  }
];

export const ShopByCategory = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (type: string) => {
    try {
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
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Use dynamic categories if available, otherwise fall back to defaults
  const displayCategories = categories.length > 0
    ? categories.map(cat => ({
        id: cat.id,
        title: cat.name,
        type: cat.slug,
        image: defaultCategories.find(d => d.title.toLowerCase().includes(cat.name.toLowerCase()))?.image || '/placeholder.jpg',
        alt: cat.description || cat.name
      }))
    : defaultCategories;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.type)}
              className="group relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden">
                <img
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

        {/* Essentials for you */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold mb-8 text-center">Essentials for you</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {essentialCategories.map((category, index) => (
              <CategoryTile
                key={index}
                title={category.title}
                type={category.type}
                image={category.image}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface CategoryTileProps {
  title: string;
  type: string;
  image: string;
  onClick: (type: string) => void;
}

const CategoryTile = ({ title, type, image, onClick }: CategoryTileProps) => (
  <button
    onClick={() => onClick(type)}
    className="group relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-1"
  >
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
  </button>
);