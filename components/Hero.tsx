"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/Mothers-aura-landingimage.png",
    "/Mothers-aura-landingimage2.png",
    "/Mothers-aura-landingimage3.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden flex items-center">
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
                objectPosition: 'center center'
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 md:px-8">
        <div className="max-w-lg text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-tight"
          >
            We don&apos;t just craft diamonds — we create symbols of timeless brilliance and enduring beauty.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="/signup"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Sparkle Effects */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
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
    </section>
  );
};