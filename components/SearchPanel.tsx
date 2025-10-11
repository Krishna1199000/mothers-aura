"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DiamondResult {
  id: string;
  stockId: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string | null;
  certificateNo: string | null;
  lab: string;
  pricePerCarat: number;
  amount: number;
  status: string;
  imageUrl: string | null;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiamondResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchDiamonds = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/diamond-search?q=${encodeURIComponent(query)}&limit=10`);
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

    const timeoutId = setTimeout(searchDiamonds, 300);
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

  const handleDiamondSelect = (diamond: DiamondResult) => {
    // Navigate to a diamond detail page or show more info
    router.push(`/diamond/${diamond.id}`);
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
              placeholder="Search diamonds by stock ID, shape, color, clarity..."
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
                <span className="text-muted-foreground">Searching diamonds...</span>
              </div>
            </div>
          )}

          {results.length > 0 && !isLoading && (
            <div className="mt-4 bg-card border border-border rounded-lg shadow-luxury">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Sparkles size={16} className="text-primary" />
                  <span>Diamond Results ({results.length})</span>
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {results.map((diamond) => (
                  <button
                    key={diamond.id}
                    className="w-full px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                    onClick={() => handleDiamondSelect(diamond)}
                  >
                    <div className="flex items-start space-x-4">
                      {diamond.imageUrl && (
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={diamond.imageUrl}
                            alt={`Diamond ${diamond.stockId}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            {diamond.stockId}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            diamond.status === 'AVAILABLE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {diamond.status}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div>
                              <span className="font-medium">Shape:</span> {diamond.shape}
                            </div>
                            <div>
                              <span className="font-medium">Carat:</span> {diamond.carat}
                            </div>
                            <div>
                              <span className="font-medium">Color:</span> {diamond.color}
                            </div>
                            <div>
                              <span className="font-medium">Clarity:</span> {diamond.clarity}
                            </div>
                          </div>
                          {diamond.cut && (
                            <div className="mt-1">
                              <span className="font-medium">Cut:</span> {diamond.cut}
                            </div>
                          )}
                          {diamond.certificateNo && (
                            <div className="mt-1">
                              <span className="font-medium">Certificate:</span> {diamond.certificateNo}
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              <span className="font-medium">Price:</span> ${diamond.pricePerCarat}/ct
                            </div>
                            <div className="text-lg font-bold text-primary">
                              ${diamond.amount.toLocaleString()}
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
              <Search size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No diamonds found for &quot;{query}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching by stock ID, shape, color, or clarity
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};