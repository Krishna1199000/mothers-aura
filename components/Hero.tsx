"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Fixed positions for sparkles to avoid hydration mismatch
  const backgroundSparklePositions = [
    { top: 90.84, left: 51.78 },
    { top: 27.01, left: 34.90 },
    { top: 6.41, left: 72.86 },
    { top: 59.91, left: 69.32 },
    { top: 4.09, left: 74.58 },
    { top: 22.94, left: 65.57 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const images = [
    "/Mothers-aura-landingimage.png",
    "/Landingimage4.jpg",
    "/Landingimage5.jpg"
  ];

  const captions = [
    "The Future of Diamonds Starts Here",
    "Wear this — a reminder of what you’re capable of",
    "Luxury that awakens your Roar"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] max-h-[900px] md:min-h-[700px] md:max-h-[100vh] overflow-hidden flex items-center">
      {/* Background Image Slider with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt="Luxury Diamond"
              fill
              className="object-cover object-center"
              priority={currentIndex === 0}
              sizes="100vw"
              unoptimized
              style={{
                objectPosition: images[currentIndex] === "/Landingimage5.jpg" 
                  ? 'center 30%' 
                  : 'center center'
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-lg text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight"
          >
            <motion.span
              className="bg-gradient-to-r from-amber-300 via-white to-amber-300 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              {captions[currentIndex]}
            </motion.span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto"
          >
            {/* Start with a diamond - Dark Button */}
            <motion.a
              href="/choose-diamond?flow=diamond-first"
              className="group relative inline-block overflow-hidden w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="relative z-10 inline-block w-full sm:w-auto bg-gray-900 dark:bg-gray-800 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold tracking-wide text-center transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-700"
              >
                Start with a diamond
              </motion.span>
            </motion.a>

            {/* Start with a setting - Light Button */}
            <motion.a
              href="/choose-diamond?flow=setting-first"
              className="group relative inline-block overflow-hidden w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="relative z-10 inline-block w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-900 dark:border-gray-700 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold tracking-wide text-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-800 dark:hover:border-gray-600"
              >
                Start with a setting
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Sparkle Effects */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {backgroundSparklePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};