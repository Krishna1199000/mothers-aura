"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Phone, Search, ShoppingCart, Menu, Heart, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MegaMenu } from './MegaMenu';
import { SearchPanel } from './SearchPanel';
import { ModeToggle } from './ModeToggle';
import { useCart } from '@/lib/contexts/cart-context';
import { CartModal } from './cart/CartModal';
import { AppointmentForm } from './AppointmentForm';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currency, setCurrency] = useState<string>('USD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(56);
  const utilityRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const { items } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  // Calculate total items in cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize currency from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('currency') || 'USD';
      setCurrency(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const recalc = () => {
      const util = utilityRef.current;
      const nav = navRef.current;
      const utilH = util ? util.getBoundingClientRect().height : 0;
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      setNavbarHeight(Math.round(utilH + navH));
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);

  return (
    <>
      {/* Main Header */}
      <div className="bg-background border-b border-border" ref={utilityRef}>
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="w-24">
                <Select
                  value={currency}
                  onValueChange={(val) => {
                    setCurrency(val);
                    try { localStorage.setItem('currency', val); } catch {}
                    // Broadcast for any listeners (optional future use)
                    window.dispatchEvent(new CustomEvent('currency:change', { detail: { currency: val } }));
                  }}
                >
                  <SelectTrigger className="h-7 px-2 text-xs">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Phone size={14} className="text-muted-foreground" />
                  <a 
                    href="tel:+918657585167" 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +91 86575 85167
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">|</span>
                <a 
                  href="tel:+917841834563" 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  +91 78418 34563
                </a>
              </div>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search size={14} />
              </button>
            </div>

            {/* Center Section - Logo */}
            <Link href="/" className="flex flex-col items-center">
              <motion.div 
                className="relative group"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-16 w-auto">
                  <Image
                    src="/logobg.png"
                    alt="Mothers Aura Logo"
                    width={240}
                    height={64}
                    className="h-full w-auto object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </Link>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors" 
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={14} />
                  <span className="text-xs">Shopping Cart</span>
                  {totalItems > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <Link 
                  href="/wishlist"
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart size={14} />
                  <span className="text-xs">WishList</span>
                </Link>
                <button 
                  onClick={() => setIsAppointmentFormOpen(true)}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar size={14} />
                  <span className="text-xs">Book Appointment</span>
                </button>
                <ModeToggle />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav ref={navRef} className={`sticky top-0 z-40 bg-background border-b border-border transition-all duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="py-2">
            <MegaMenu isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} navbarHeight={navbarHeight} />
          </div>
        </div>
      </nav>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Modal */}
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Appointment Form */}
      <AppointmentForm 
        isOpen={isAppointmentFormOpen} 
        onClose={() => setIsAppointmentFormOpen(false)} 
      />
    </>
  );
};