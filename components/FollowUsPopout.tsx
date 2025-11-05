"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Linkedin, Twitter, X as Close } from "lucide-react";

export default function FollowUsPopout() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      // Show once per browser session (same philosophy as OfferModal/ChatWidget)
      if (typeof window !== 'undefined') {
        const hasShown = sessionStorage.getItem('followUsPopoutShown');
        if (hasShown) {
          setDismissed(true);
          return;
        }
      }
    } catch {}
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('followUsPopoutShown', '1');
      }
    } catch {}
  };

  if (dismissed) return null;

  const socials = [
    { icon: Facebook, href: 'https://facebook.com/mothersaura', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/mothers_aura?igsh=MWhydGR5dHZxaXRsdw%3D%3D&utm_source=qr', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/in/mother-s-aura-6991a7395', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/MOTHERSAURA007', label: 'Twitter' }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -220, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl px-3 py-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">Follow us</span>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={s.label}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
            <button
              aria-label="Dismiss follow popout"
              onClick={handleClose}
              className="ml-1 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              <Close size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


