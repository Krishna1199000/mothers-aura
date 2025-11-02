"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const OfferModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Show once per browser session
    try {
      if (typeof window !== 'undefined') {
        const hasShown = sessionStorage.getItem('offerModalShown');
        if (hasShown) return; // already shown this session
      }
    } catch {}

    const timer = setTimeout(() => {
      setIsVisible(true);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('offerModalShown', '1');
        }
      } catch {}
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && phone && consent) {
      // TODO: Handle form submission
      console.log('Offer claimed:', { email, phone });

      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('offerModalShown', '1');
        }
      } catch {}

      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('offerModalShown', '1');
      }
    } catch {}
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

  return (
    <AnimatePresence>
      {isVisible && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleDismiss();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full relative max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
            aria-label="Close offer"
          >
            <X size={18} />
          </button>

          {/* Scrollable Content */}
          <ScrollArea className="h-[calc(90vh-0px)]">
            <div className="p-6 md:p-8 pr-10">
              {/* Image Section */}
              <div className="mb-6 -mx-6 md:-mx-8 -mt-6 md:-mt-8">
                <div className="relative w-full h-64 md:h-72 overflow-hidden">
                  <Image
                    src="/Popoutimage.jpg"
                    alt="Special Offer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 512px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Offer Heading */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                    $100 OFF
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
                    your first order
                  </p>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                  Unlock your welcome offer and discover exceptional diamonds at honest prices.
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                    required
                  />
                  <label htmlFor="consent" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer">
                    I agree to receive marketing communications and understand I can unsubscribe at any time. Privacy policy applies.
                  </label>
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={!email || !phone || !consent}
                  >
                    Claim $100 Off
                  </Button>
                  
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm font-medium py-2"
                  >
                    No thanks
                  </button>
                </div>
              </motion.form>
            </div>
          </ScrollArea>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};