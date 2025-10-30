"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ShopByCategory } from '@/components/ShopByCategory';
import { TrustSection } from '@/components/TrustSection';
import { FeatureStripe } from '@/components/FeatureStripe';
import { DiamondShapes } from '@/components/DiamondShapes';
import { EssentialsSection } from '@/components/EssentialsShapes';
import { MonthsSection } from '@/components/MonthsSection';
import { PartnersSection } from '@/components/PartnersSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ContactSection } from '@/components/ContactSection';
import DiamondAppointment from '@/components/appoinment';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { OfferModal } from '@/components/OfferModal';
import { Footer } from '@/components/Footer';
import Slides from '@/components/Slides';

import { useEffect } from 'react';

// Enhanced Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.3
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-background relative"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      {/* Progress Bar removed per request */}

      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <motion.div 
        variants={fadeInUp}
        className="relative z-30"
      >
        <AnnouncementBar forceShow />
      </motion.div>
      
      <motion.div 
        variants={scaleUp}
        className="sticky top-0 z-40"
      >
        <Header />
      </motion.div>
      
      <motion.main 
        id="main-content"
        variants={staggerChildren}
        className="relative z-10"
      >
        <motion.div 
          variants={fadeInUp}
          className="relative z-20"
        >
          <Hero />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={scaleUp}
          className="relative z-10"
        >
          <ShopByCategory />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={scaleUp}
        >
          <EssentialsSection />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeInUp}
        >
          <MonthsSection />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeInUp}
        >
          <TrustSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={scaleUp}
        >
          <FeatureStripe />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeInUp}
          className="relative z-20"
        >
          <DiamondShapes />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={scaleUp}
        >
          <Slides />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeInUp}
        >
          <PartnersSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={scaleUp}
        >
          <ReviewsSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeInUp}
        >
          <DiamondAppointment />
        </motion.div> 
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={scaleUp}
        >
          <ContactSection />
        </motion.div>
      </motion.main>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Footer />
      </motion.div>
      
      {/* Fixed positioned components with enhanced animations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          delay: 1.2,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-4"
      >
        <ChatWidget />
        <OfferModal />
       
      </motion.div>

    </motion.div>
  );
};

export default Home;
