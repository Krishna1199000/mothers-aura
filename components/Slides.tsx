import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function LuxurySplitScreen() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [rightImageLoaded, setRightImageLoaded] = useState(false);
  const [leftImageLoaded, setLeftImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload images for better performance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const preloadImages = () => {
      const imageUrls = ['/diamond2.png', '/Slidersimage-removebg-preview.png'];
      imageUrls.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    };

    preloadImages();
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div 
      className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-screen overflow-hidden select-none bg-white dark:bg-gray-900"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Right Side - Ring (Base Layer) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-4 sm:pr-6 md:pr-8 lg:pr-16 flex flex-col items-end max-w-[200px] sm:max-w-sm">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-gray-900 dark:text-white mb-4 sm:mb-6 text-right leading-tight drop-shadow-lg dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Mother&apos;s aura<br />classic diamond ring
          </h2>
          <button className="bg-stone-700 hover:bg-stone-800 dark:bg-stone-600 dark:hover:bg-stone-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm font-medium tracking-widest transition-all duration-300 hover:shadow-xl">
            SHOP NOW
          </button>
        </div>
        
        {/* Ring Image - Right Side */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {!rightImageLoaded && (
            <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          )}
          <Image
            src="/diamond2.png" 
            alt="Classic Diamond Ring" 
            width={256} 
            height={256}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 256px"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl transition-opacity duration-300"
            style={{ 
              filter: 'brightness(1.05)',
              opacity: rightImageLoaded ? 1 : 0
            }}
            onLoad={() => setRightImageLoaded(true)}
          />
        </div>
      </div>

      {/* Left Side - Ring (Overlay Layer) */}
      <div 
        className="absolute inset-0 bg-white dark:bg-gray-950"
        style={{ 
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-4 sm:pl-6 md:pl-8 lg:pl-16 flex flex-col items-start max-w-[200px] sm:max-w-sm">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-gray-900 dark:text-white mb-4 sm:mb-6 text-left leading-tight drop-shadow-lg dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Mother&apos;s aura<br />premium diamond ring
          </h2>
          <button className="bg-stone-700 hover:bg-stone-800 dark:bg-stone-600 dark:hover:bg-stone-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm font-medium tracking-widest transition-all duration-300 hover:shadow-xl">
            SHOP NOW
          </button>
        </div>
        
        {/* Ring Image - Left Side */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {!leftImageLoaded && (
            <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          )}
          <Image
            src="/Slidersimage-removebg-preview.png" 
            alt="Premium Diamond Ring" 
            width={256}
            height={256}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 256px"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl transition-opacity duration-300"
            style={{ 
              filter: 'brightness(1.1) contrast(1.1)',
              opacity: leftImageLoaded ? 0.95 : 0
            }}
            onLoad={() => setLeftImageLoaded(true)}
          />
        </div>
      </div>

      {/* Vertical Divider Line */}
      <div 
        className="absolute top-0 h-full w-px bg-gray-400 dark:bg-gray-500 opacity-40 dark:opacity-60 pointer-events-none z-20"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div 
        className="absolute top-0 h-full flex items-center justify-center cursor-ew-resize z-30 touch-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="bg-gray-900 dark:bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200 border-2 border-white dark:border-gray-900">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-gray-900 absolute left-1 sm:left-2" />
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-gray-900 absolute right-1 sm:right-2" />
        </div>
      </div>

    </div>
  );
}