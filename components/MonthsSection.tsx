"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const months = [
  { name: 'January', image: '/january.png' },
  { name: 'February', image: '/february.png' },
  { name: 'March', image: '/march.png' },
  { name: 'April', image: '/april.png' },
  { name: 'May', image: '/may.png' },
  { name: 'June', image: '/june.png' },
  { name: 'July', image: '/july.png' },
  { name: 'August', image: '/august.png' },
  { name: 'September', image: '/september.png' },
  { name: 'October', image: '/october.png' },
  { name: 'November', image: '/november.png' },
  { name: 'December', image: '/december.png' }
];

export const MonthsSection = () => {
  const router = useRouter();

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
          Enhance Aura With Real Power of Birthstones

          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Scrollable Months Container */}
          <div 
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-4 months-scrollbar"
          >
            {months.map((month, idx) => (
              <div
                key={`${month.name}-${idx}`}
                className="flex-shrink-0"
              >
                <div 
                  onClick={() => handleMonthClick(month.name)}
                  className="group relative overflow-visible bg-transparent cursor-pointer flex flex-col items-center"
                >
                  <div className="aspect-square overflow-visible relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32">
                    <Image
                      src={month.image}
                      alt={month.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  </div>
                  
                  <div className="mt-3 text-center">
                    <h3 className="text-gray-900 dark:text-gray-100 font-medium text-base">
                      {month.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .months-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        .months-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
};

