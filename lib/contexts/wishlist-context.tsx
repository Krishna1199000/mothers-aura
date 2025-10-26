"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  addedAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => Promise<boolean>;
  removeFromWishlist: (itemId: string) => Promise<boolean>;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => Promise<boolean>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        
        // Try to get from localStorage first
        const localWishlist = localStorage.getItem('wishlist');
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        }

        // Then sync with backend
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const data = await response.json();
          setWishlist(data.wishlist || []);
          // Update localStorage with server data
          localStorage.setItem('wishlist', JSON.stringify(data.wishlist || []));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        // Fallback to localStorage if server fails
        const localWishlist = localStorage.getItem('wishlist');
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const addToWishlist = async (item: Omit<WishlistItem, 'addedAt'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const wishlistItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };

      // Check if already in wishlist
      if (wishlist.some(wishlistItem => wishlistItem.id === item.id)) {
        toast({
          title: "Already in wishlist",
          description: "This item is already in your wishlist",
        });
        return false;
      }

      // Add to backend
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wishlistItem),
      });

      if (response.ok) {
        const newWishlist = [...wishlist, wishlistItem];
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        
        toast({
          title: "Added to wishlist",
          description: `${item.name} has been added to your wishlist`,
        });
        return true;
      } else {
        throw new Error('Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Fallback to localStorage
      const wishlistItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      
      if (!wishlist.some(wishlistItem => wishlistItem.id === item.id)) {
        const newWishlist = [...wishlist, wishlistItem];
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        
        toast({
          title: "Added to wishlist (offline)",
          description: `${item.name} has been added to your wishlist`,
        });
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Remove from backend
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const newWishlist = wishlist.filter(item => item.id !== itemId);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        });
        return true;
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      
      // Fallback to localStorage
      const newWishlist = wishlist.filter(item => item.id !== itemId);
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      
      toast({
        title: "Removed from wishlist (offline)",
        description: "Item has been removed from your wishlist",
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some(item => item.id === itemId);
  };

  const clearWishlist = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Clear from backend
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist([]);
        localStorage.removeItem('wishlist');
        
        toast({
          title: "Wishlist cleared",
          description: "All items have been removed from your wishlist",
        });
        return true;
      } else {
        throw new Error('Failed to clear wishlist');
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      
      // Fallback to localStorage
      setWishlist([]);
      localStorage.removeItem('wishlist');
      
      toast({
        title: "Wishlist cleared (offline)",
        description: "All items have been removed from your wishlist",
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

