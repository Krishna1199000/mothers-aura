"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const mockSuggestions = useMemo(() => [
    'Diamond rings',
    'Engagement rings',
    'Wedding bands',
    'Lab-grown diamonds',
    'Solitaire rings',
    'Emerald cut diamonds',
    'Halo settings',
    'Tennis bracelets'
  ], []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query, mockSuggestions]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search diamonds, rings, and more..."
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

          {suggestions.length > 0 && (
            <div className="mt-4 bg-card border border-border rounded-lg shadow-luxury">
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center space-x-3"
                      onClick={() => {
                        // TODO: Handle search selection
                        setQuery(suggestion);
                        onClose();
                      }}
                    >
                      <Search size={16} className="text-muted-foreground" />
                      <span>{suggestion}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};