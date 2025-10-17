"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

interface LoadingScreenProps {
  show?: boolean;
}

export function LoadingScreen({ show = true }: LoadingScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isDark ? "bg-black" : "bg-white"
          }`}
        >
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="relative h-24 w-24"
          >
            <Image
              src="/Logo.jpg"
              alt="Mother's Aura Logo"
              fill
              className="object-contain"
              sizes="96px"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
