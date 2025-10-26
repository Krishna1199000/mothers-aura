"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Diamond, Users, Star } from "lucide-react";
import Image from "next/image";

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
      value: "25+",
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
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <h2 className="text-3xl font-bold">Tejas Vilas Bhosle</h2>
                <p className="text-muted-foreground italic">Founder & CEO</p>
                <p className="text-muted-foreground">
                  With over 25 years of experience in the diamond industry, John Smith has built
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
                Founded in 1998, Mothers Aura Diamonds has been at the forefront of the diamond industry,
                providing exceptional quality diamonds and jewelry to customers worldwide. Our journey
                began with a simple mission: to make premium quality diamonds accessible while
                maintaining the highest standards of transparency and customer service.
              </p>
              <p className="text-muted-foreground">
                Over the years, we have built strong relationships with leading diamond manufacturers
                and craftsmen, allowing us to offer an extensive collection of certified diamonds at
                competitive prices. Our team of experienced gemologists and jewelry designers works
                tirelessly to ensure that each piece meets our stringent quality standards.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to innovate and grow, embracing new technologies while maintaining
                our commitment to traditional craftsmanship. Our success is measured not just in
                sales, but in the lasting relationships we build with our customers.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
