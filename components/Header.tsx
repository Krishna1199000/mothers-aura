"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Phone, Search, ShoppingCart, Menu, Heart, MessageCircle } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { SearchPanel } from './SearchPanel';
import { ModeToggle } from './ModeToggle';
import { useCart } from '@/lib/contexts/cart-context';
import { CartModal } from './cart/CartModal';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  return (
    <>
      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-600">USD</span>
                <span className="text-xs">▼</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone size={14} className="text-gray-600" />
                <a 
                  href="tel:+852-537-5554-1" 
                  className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  +852-537-5554-1
                </a>
              </div>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
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
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors" 
                aria-label="Shopping cart"
              >
                <ShoppingCart size={14} />
                <span className="text-xs">Shopping Cart</span>
                {totalItems > 0 && (
                  <span className="bg-gray-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <Link 
                href="/wishlist"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Heart size={14} />
                <span className="text-xs">WishList</span>
              </Link>
              
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors">
                <MessageCircle size={14} />
                <span className="text-xs">Live Chat</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 bg-white border-b border-gray-100 transition-all duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="py-2">
            <MegaMenu isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
          </div>
        </div>
      </nav>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Modal */}
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};