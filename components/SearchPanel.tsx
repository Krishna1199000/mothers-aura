"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  subcategory?: string;
  type: "ui-inventory";
}

export const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleItemSelect = (item: SearchResult) => {
    router.push(`/product/${item.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, rings, jewelry..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-lg border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {isLoading && (
            <div className="mt-4 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Searching products...</span>
              </div>
            </div>
          )}

          {results.length > 0 && !isLoading && (
            <div className="mt-4 bg-card border border-border rounded-lg shadow-luxury">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Sparkles size={16} className="text-primary" />
                  <span>Search Results ({results.length})</span>
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item.id}
                    className="w-full px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                    onClick={() => handleItemSelect(item)}
                  >
                    <div className="flex items-start space-x-4">
                      {item.images && item.images.length > 0 && (
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.stock > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-1 text-sm text-muted-foreground">
                          {item.description && (
                            <p className="text-xs mb-2">{item.description}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                              <span className="font-medium">Category:</span> {item.category}
                            </div>
                            {item.subcategory && (
                              <div>
                                <span className="font-medium">Type:</span> {item.subcategory}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Stock:</span> {item.stock}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-lg font-bold text-primary">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-muted-foreground flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && results.length === 0 && !isLoading && (
            <div className="mt-4 bg-card border border-border rounded-lg p-8 text-center">
              <Search size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                We currently don&apos;t have this
              </h3>
              <p className="text-muted-foreground mb-4">
                All stocks are sold out, but we&apos;d love to help you find what you&apos;re looking for!
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">📧 Email us:</span>
                  <a 
                    href="mailto:admintejas@mothersauradiamonds.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    admintejas@mothersauradiamonds.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground">📞 Call us:</span>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+918657585167" className="text-primary hover:underline font-medium">
                      +91 86575 85167
                    </a>
                    <a href="tel:+917841834563" className="text-primary hover:underline font-medium">
                      +91 78418 34563
                    </a>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4">
                  We&apos;ll arrange it for you and give you something you would also love!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  router.push('/products');
                }}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Our Whole Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};