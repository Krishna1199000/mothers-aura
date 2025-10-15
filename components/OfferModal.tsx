"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OfferModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && phone && consent) {
      // TODO: Handle form submission
      console.log('Offer claimed:', { email, phone });

      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Function to clear localStorage for testing (can be called from browser console)
  const clearOfferStorage = () => {
    setIsVisible(true);
  };

  // Expose function to window for testing
  if (typeof window !== 'undefined') {
    (window as typeof window & { clearOfferStorage: () => void }).clearOfferStorage = clearOfferStorage;
  }

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      <div className="bg-card rounded-xl shadow-premium max-w-md w-full relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close offer"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">£100 OFF</h2>
            <p className="text-lg text-muted-foreground">your first order</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Unlock your welcome offer and discover exceptional diamonds at honest prices.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground">
                I agree to receive marketing communications and understand I can unsubscribe at any time. Privacy policy applies.
              </label>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={!email || !phone || !consent}
              >
                Claim £100 Off
              </Button>
              
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                No thanks
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};