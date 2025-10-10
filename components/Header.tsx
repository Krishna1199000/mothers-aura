"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Search, ShoppingCart, Menu } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { SearchPanel } from './SearchPanel';
import { ModeToggle } from './ModeToggle';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
  <div className="bg-background border-b border-border">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Phone */}
          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-muted-foreground" />
            <a 
              href="tel:877-914-2877" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              877-914-2877
            </a>
          </div>

          {/* Logo */}
      <Link href="/" className="flex items-center">
        <img src="/Logo.jpg" alt="Logo" className="h-12 w-12 rounded-lg object-cover" />
      </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <ModeToggle />

            <button className="relative hover:text-primary transition-colors" aria-label="Shopping cart">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:text-primary transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-40 bg-background border-b border-border transition-all duration-300 ${
        isScrolled ? 'shadow-luxury' : ''
      }`}>
        <div className="container mx-auto px-4">
          <MegaMenu isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
        </div>
      </nav>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};