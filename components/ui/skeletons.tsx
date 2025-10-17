"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Use literal types so Framer Motion's Transition typing accepts repeatType/ease values
const shimmer = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
  transition: {
    repeat: Infinity,
    repeatType: "loop" as const,
    duration: 2,
    ease: "easeInOut" as const,
  },
} as const;

interface SkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted/20 p-4", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        {...shimmer}
      />
      <div className="space-y-3">
        <div className="h-4 w-3/4 rounded bg-muted/30" />
        <div className="h-8 w-full rounded bg-muted/30" />
        <div className="h-4 w-1/2 rounded bg-muted/30" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        {...shimmer}
      />
      <div className="grid grid-cols-6 gap-4 py-4">
        {Array(6).fill(null).map((_, i) => (
          <div key={i} className="h-4 rounded bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted/20", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        {...shimmer}
      />
      <div className="aspect-square bg-muted/30" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 rounded bg-muted/30" />
        <div className="h-6 w-1/2 rounded bg-muted/30" />
        <div className="h-4 w-1/3 rounded bg-muted/30" />
      </div>
    </div>
  );
}

export function ListItemSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden py-2", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        {...shimmer}
      />
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-muted/30" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 rounded bg-muted/30" />
          <div className="h-3 w-1/2 rounded bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden space-y-6", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        {...shimmer}
      />
      {Array(4).fill(null).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/4 rounded bg-muted/30" />
          <div className="h-10 w-full rounded bg-muted/30" />
        </div>
      ))}
    </div>
  );
}
