"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Search, ShoppingCart, Menu, Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchPanel } from './SearchPanel';

export const CustomerHeader = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const darkModePreference = localStorage.getItem('darkMode');

    // Strict default: Light mode (ignore system preference)
    if (darkModePreference === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Utility Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Contact */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-muted-foreground" />
                <a 
                  href="tel:+918657585167" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  +91 86575 85167
                </a>
              </div>
              <span className="text-muted-foreground">|</span>
              <a 
                href="tel:+917841834563" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                +91 78418 34563
              </a>
            </div>

            {/* Center - Logo */}
            <Link href="/dashboard" className="flex items-center">
              <Image 
                src={isDarkMode ? "/logoNameInvertbg.png" : "/logoNamebg.png"} 
                alt="Mothers Aura logo" 
                width={48} 
                height={48} 
                className="w-12 h-12 object-contain" 
                unoptimized 
              />
            </Link>

            {/* Right - Search, Dark Mode, Cart, Profile */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="hover:text-primary transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="relative hover:text-primary transition-colors" aria-label="Shopping cart">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Customer Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="bg-green-500 text-white">
                        {session?.user?.name ? getUserInitials(session.user.name) : "C"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session?.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session?.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                      <p className="text-xs text-green-600 font-medium">Customer</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
      </header>

      {/* Primary Navigation */}
      <nav className={`sticky top-0 z-40 bg-background border-b border-border transition-all duration-300 ${
        isScrolled ? 'shadow-luxury' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className="font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="py-4 space-y-2 border-t border-border">
                <Link 
                  href="/" 
                  className="block py-2 font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/dashboard" 
                  className="block py-2 font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};















