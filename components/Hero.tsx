"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/Mothers-aura-landingimage.png",
    "/Landingimage4.jpg",
    "/Landingimage5.jpg"
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
      <div className="relative z-10 w-full px-4 md:px-8">
        <div className="max-w-lg text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
          >
            <motion.span
              className="bg-gradient-to-r from-amber-300 via-white to-amber-300 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              The Future of Diamonds Starts Here
            </motion.span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href="/signup"
              className="group relative inline-block overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255, 255, 255, 0.3)",
                  "0 0 40px rgba(255, 255, 255, 0.5)",
                  "0 0 20px rgba(255, 255, 255, 0.3)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              {/* Glowing background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 opacity-0 group-hover:opacity-20"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
              />
              
              {/* Button content */}
              <motion.span
                className="relative z-10 inline-block bg-gradient-to-br from-black via-gray-900 to-black text-white px-10 py-4 rounded-full text-lg font-semibold tracking-wide backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  Shop Now
                  <motion.span
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.span>
              
              {/* Pulse ring effect */}
              <motion.div
                className="absolute inset-0 border-2 border-white/50 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              
              {/* Sparkle particles around button */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.a>
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