"use client";

import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ShopByCategory } from '@/components/ShopByCategory';
import { TrustSection } from '@/components/TrustSection';
import { FeatureStripe } from '@/components/FeatureStripe';
import { DiamondShapes } from '@/components/DiamondShapes';
import { EssentialsSection } from '@/components/EssentialsShapes';
import { ComparisonTable } from '@/components/ComparisonTable';
import { PartnersSection } from '@/components/PartnersSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { FAQSection } from '@/components/FAQSection';
import { ContactSection } from '@/components/ContactSection';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { OfferModal } from '@/components/OfferModal';
import { Footer } from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <AnnouncementBar forceShow />
      <Header />
      
      <main id="main-content">
        <Hero />
        <ShopByCategory />
        <TrustSection />
        <FeatureStripe />
        <DiamondShapes />
        <EssentialsSection />
        <ComparisonTable />
        <PartnersSection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
      
      {/* Fixed positioned components */}
      <ChatWidget />
      <OfferModal />
    </div>
  );
};

export default Home;
