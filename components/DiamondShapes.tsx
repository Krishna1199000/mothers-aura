"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const DiamondShapes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const shapes = [
    { name: 'Round', video: '/Mothers-aura-Round.mp4' },
    { name: 'Princess', video: '/Mothers-aura-princess.mp4' },
    { name: 'Cushion', video: '/Mothers-aura-Cushion.mp4' },
    { name: 'Oval', video: '/Mothers-aura-Oval.mp4' },
    { name: 'Emerald', video: '/Mothers-aura-emerald.mp4' },
    { name: 'Pear', video: '/Mothers-aura-pear.mp4' },
    { name: 'Marquise', video: '/Mothers-aura-marquise.mp4' },
    { name: 'Radiant', video: '/Mothers-aura-radiant.mp4' },
    { name: 'Asscher', video: '/Mothers-aura-Asscher.mp4' },
    { name: 'Heart', video: '/Mothers-aura-heart.mp4' }
  ];

  // Get the three videos to display (previous, current, next)
  const getVisibleVideos = () => {
    const prevIndex = (currentIndex - 1 + shapes.length) % shapes.length;
    const nextIndex = (currentIndex + 1) % shapes.length;
    
    return [
      { ...shapes[prevIndex], index: prevIndex, position: 'prev' },
      { ...shapes[currentIndex], index: currentIndex, position: 'current' },
      { ...shapes[nextIndex], index: nextIndex, position: 'next' }
    ];
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setIsVideoLoading(true);
        setCurrentIndex((prev) => (prev + 1) % shapes.length);
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, shapes.length]);

  // Reset loading state when currentIndex changes
  useEffect(() => {
    setIsVideoLoading(true);
  }, [currentIndex]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setIsVideoLoading(true);
    setCurrentIndex((prev) => (prev + 1) % shapes.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setIsVideoLoading(true);
    setCurrentIndex((prev) => (prev - 1 + shapes.length) % shapes.length);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
            Experience Diamond Brilliance
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch our diamonds come to life in stunning detail
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Three Video Slider */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] flex items-center justify-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 md:px-8">
            {getVisibleVideos().map((shape, index) => {
              const isCenter = shape.position === 'current';
              const isPrev = shape.position === 'prev';
              const isNext = shape.position === 'next';
              
              return (
                <motion.div
                  key={`${shape.index}-${shape.position}`}
                  className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${
                    isCenter 
                      ? 'w-[200px] sm:w-[240px] md:w-[280px] lg:w-[350px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] z-20' 
                      : 'w-[80px] sm:w-[100px] md:w-[120px] lg:w-[150px] h-[150px] sm:h-[180px] md:h-[200px] lg:h-[250px] z-10 opacity-70 hover:opacity-90'
                  }`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8,
                    x: isPrev ? -100 : isNext ? 100 : 0
                  }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.7, 
                    scale: 1,
                    x: 0
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onClick={() => {
                    if (!isCenter) {
                      setIsAutoPlaying(false);
                      setIsVideoLoading(true);
                      setCurrentIndex(shape.index);
                    }
                  }}
                  style={{ cursor: !isCenter ? 'pointer' : 'default' }}
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover bg-black"
                    style={{ 
                      objectPosition: 'center',
                      objectFit: 'cover'
                    }}
                    onLoadStart={() => setIsVideoLoading(true)}
                    onCanPlay={() => setIsVideoLoading(false)}
                    onError={() => {
                      // Silently handle video load failures to avoid noisy console errors
                      setIsVideoLoading(false);
                    }}
                  >
                    <source src={shape.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Loading indicator */}
                  {isVideoLoading && isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Buttons - positioned outside the video container */}
          <button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 p-2 sm:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform z-30"
            aria-label="Previous shape"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 p-2 sm:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform z-30"
            aria-label="Next shape"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Progress Indicators */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 mt-4">
            {shapes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setIsVideoLoading(true);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};