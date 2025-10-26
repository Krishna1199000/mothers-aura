import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function LuxurySplitScreen() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="relative w-full h-screen overflow-hidden select-none bg-white"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Right Side - Ring (Base Layer) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-16 md:pr-32 flex flex-col items-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-12 text-right leading-tight">
            Create<br />The Perfect<br />Ring
          </h2>
          <button className="bg-stone-700 hover:bg-stone-800 text-white px-10 py-4 text-sm font-medium tracking-widest transition-all duration-300 hover:shadow-xl">
            SHOP NOW
          </button>
        </div>
        
        {/* Ring Image - Right Side */}
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80" 
            alt="Ring" 
            width={256}
            height={256}
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
            style={{ filter: 'brightness(1.05)' }}
          />
        </div>
      </div>

      {/* Left Side - Diamond (Overlay Layer) */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100"
        style={{ 
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
        }}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-16 md:pl-32 flex flex-col items-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-12 text-left leading-tight">
            Discover Your<br />Prefect Diamond
          </h2>
          <button className="bg-stone-700 hover:bg-stone-800 text-white px-10 py-4 text-sm font-medium tracking-widest transition-all duration-300 hover:shadow-xl">
            SHOP NOW
          </button>
        </div>
        
        {/* Diamond Image - Left Side */}
        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80" 
            alt="Diamond" 
            width={256}
            height={256}
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl opacity-95"
            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
          />
        </div>
      </div>

      {/* Vertical Divider Line */}
      <div 
        className="absolute top-0 h-full w-px bg-gray-400 opacity-40 pointer-events-none z-20"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div 
        className="absolute top-0 h-full flex items-center justify-center cursor-ew-resize z-30"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="bg-gray-900 rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200 border-2 border-white">
          <ChevronLeft className="w-5 h-5 text-white absolute left-2" />
          <ChevronRight className="w-5 h-5 text-white absolute right-2" />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        <button className="w-2.5 h-2.5 rounded-full bg-gray-900" />
        <button className="w-2.5 h-2.5 rounded-full bg-gray-400 opacity-50" />
        <button className="w-2.5 h-2.5 rounded-full bg-gray-400 opacity-50" />
      </div>
    </div>
  );
}