"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const months = [
  { name: 'January', image: '/january.jpg' },
  { name: 'February', image: '/february.jpg' },
  { name: 'March', image: '/march.jpg' },
  { name: 'April', image: '/april.jpg' },
  { name: 'May', image: '/may.jpg' },
  { name: 'June', image: '/june.jpg' },
  { name: 'July', image: '/july.jpg' },
  { name: 'August', image: '/august.jpg' },
  { name: 'September', image: '/september.jpg' },
  { name: 'October', image: '/october.jpg' },
  { name: 'November', image: '/november.jpg' },
  { name: 'December', image: '/december.jpg' }
];

export const MonthsSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 8;
  const router = useRouter();

  const nextSlide = () => {
    setStartIndex((prev) => (prev + visibleCount) % months.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - visibleCount + months.length) % months.length);
  };

  const visibleMonths = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (startIndex + i) % months.length;
    visibleMonths.push(months[index]);
  }

  const handleMonthClick = async (monthName: string) => {
    try {
      // Search for products related to the month
      const response = await fetch(`/api/categories/map?type=${monthName.toLowerCase()}`);
      if (!response.ok) throw new Error("Failed to map category");
      const data = await response.json();

      // Store the results in localStorage for the target page
      localStorage.setItem("categoryResults", JSON.stringify(data));

      // Navigate to the category page
      router.push(`/category/${monthName.toLowerCase()}`);
    } catch (error) {
      console.error("Error mapping category:", error);
      router.push(`/category/${monthName.toLowerCase()}`); // Fallback to direct navigation
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Birthstone Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your birthstone and celebrate your special month
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous months"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Months Grid */}
          <div className="flex gap-4 px-12 overflow-hidden">
            {visibleMonths.map((month, idx) => (
              <div
                key={`${month.name}-${idx}`}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/8"
              >
                <div 
                  onClick={() => handleMonthClick(month.name)}
                  className="group relative overflow-visible bg-transparent cursor-pointer flex flex-col items-center"
                >
                  <div className="aspect-square overflow-visible relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28">
                    <Image
                      src={month.image}
                      alt={month.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  </div>
                  
                  <div className="mt-3 text-center">
                    <h3 className="text-gray-900 font-medium text-base">
                      {month.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next months"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

