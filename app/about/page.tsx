"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Diamond, Users, Star } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";

export default function AboutPage() {
  const stats = [
    {
      icon: Diamond,
      value: "10K+",
      label: "Diamonds Sold",
      description: "Premium quality diamonds delivered worldwide"
    },
    {
      icon: Users,
      value: "5K+",
      label: "Happy Customers",
      description: "Satisfied customers across the globe"
    },
    {
      icon: Award,
      value: "10+",
      label: "Years Experience",
      description: "Expertise in diamond industry"
    },
    {
      icon: Star,
      value: "4.9",
      label: "Rating",
      description: "Average customer satisfaction rating"
    }
  ];

  return (
    <>
    <AnnouncementBar forceShow />
    <div className="sticky top-0 z-40">
      <Header />
    </div>
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight">About Mothers Aura Diamonds</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Crafting brilliance since 1998. We are committed to providing the finest quality diamonds
            and exceptional customer service.
          </p>
        </motion.div>

        {/* Owner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3">
                <Image
                  src="/Mothers-aura-Aboutus.jpg"
                  alt="About Mothers Aura"
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <h2 className="text-3xl font-bold">Tejas Bhosle</h2>
                <p className="text-muted-foreground italic">Founder & CEO</p>
                <p className="text-muted-foreground">
                  With over 10 years of experience in the diamond industry, Tejas Bhosle has built
                  Mothers Aura Diamonds from the ground up. His passion for excellence and commitment
                  to customer satisfaction has made us one of the most trusted names in the industry.
                </p>
                <p className="text-muted-foreground">
                  Under his leadership, we have grown from a small local business to a global
                  enterprise, serving customers across the world while maintaining the same level
                  of personal attention and care that we started with.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <stat.icon className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="font-medium">{stat.label}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Strength. Precision. Aura. Coming from the world of professional lifting and technology, I’ve learned that true strength isn’t just physical — it’s an inner energy, a mindset of focus, discipline, and innovation. That same energy inspires my journey in the world of diamonds. What began as fascination has grown into a passion — a pursuit of brilliance, emotion, and craftsmanship. Each diamond I curate is more than a gemstone; it’s a reflection of the wearer’s aura — their confidence, elegance, and individuality.
              </p>
              <p className="text-muted-foreground">
                With the help of my skilled craftsmen, I can design any diamond in the world, blending human artistry with modern technology to transform imagination into timeless reality. Every piece is handcrafted with precision, certified for authenticity, and made to be treasured for a lifetime.
              </p>
              <p className="text-muted-foreground">
                For me, this is not about selling luxury — it’s about creating trust, sharing passion, and celebrating human strength, innovation, and beauty through diamonds. I believe true strength is the aura you carry — confident, graceful, and real. That same energy inspires every diamond I create. Every Diamond Reflects Your Aura.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
}
