"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, X } from 'lucide-react';

interface MegaMenuProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  label: string;
  items: {
    section?: string;
    links: { label: string; href: string }[];
  }[];
}

const menuItems: MenuItem[] = [
  {
    label: "Rings",
    items: [
      {
        section: "Engagement",
        links: [
          { label: "Solitaire", href: "/rings/engagement/solitaire" },
          { label: "Halo", href: "/rings/engagement/halo" },
          { label: "Vintage", href: "/rings/engagement/vintage" },
          { label: "Three-Stone", href: "/rings/engagement/three-stone" },
        ],
      },
      {
        section: "Wedding",
        links: [
          { label: "Classic Bands", href: "/rings/wedding/classic-bands" },
          { label: "Eternity", href: "/rings/wedding/eternity" },
          { label: "Promise", href: "/rings/wedding/promise" },
          { label: "Matching Sets", href: "/rings/wedding/matching-sets" },
        ],
      },
      {
        section: "Fashion",
        links: [
          { label: "Cocktail", href: "/rings/fashion/cocktail" },
          { label: "Stackable", href: "/rings/fashion/stackable" },
          { label: "Statement", href: "/rings/fashion/statement" },
          { label: "Everyday", href: "/rings/fashion/everyday" },
        ],
      },
    ],
  },
  {
    label: "Diamonds",
    items: [
      {
        section: "By Type",
        links: [
          { label: "Natural", href: "/diamonds/type/natural" },
          { label: "Lab-Grown", href: "/diamonds/type/lab-grown" },
          { label: "Certified", href: "/diamonds/type/certified" },
          { label: "Premium", href: "/diamonds/type/premium" },
        ],
      },
      {
        section: "By Carat",
        links: [
          { label: "Under 1ct", href: "/diamonds/carat/under-1ct" },
          { label: "1-2ct", href: "/diamonds/carat/1-2ct" },
          { label: "2-3ct", href: "/diamonds/carat/2-3ct" },
          { label: "Over 3ct", href: "/diamonds/carat/over-3ct" },
        ],
      },
      {
        section: "By Quality",
        links: [
          { label: "By Colour", href: "/diamonds/quality/color" },
          { label: "By Clarity", href: "/diamonds/quality/clarity" },
          { label: "By Cut", href: "/diamonds/quality/cut" },
          { label: "Investment Grade", href: "/diamonds/quality/investment" },
        ],
      },
    ],
  },
  {
    label: "Gems",
    items: [
      {
        section: "Precious",
        links: [
          { label: "Sapphire", href: "/gems/precious/sapphire" },
          { label: "Emerald", href: "/gems/precious/emerald" },
          { label: "Ruby", href: "/gems/precious/ruby" },
          { label: "Premium", href: "/gems/precious/premium" },
        ],
      },
      {
        section: "Semi-Precious",
        links: [
          { label: "Tanzanite", href: "/gems/semi-precious/tanzanite" },
          { label: "Aquamarine", href: "/gems/semi-precious/aquamarine" },
          { label: "Morganite", href: "/gems/semi-precious/morganite" },
          { label: "Tourmaline", href: "/gems/semi-precious/tourmaline" },
        ],
      },
      {
        section: "Special",
        links: [
          { label: "Birthstones", href: "/gems/special/birthstones" },
          { label: "Rare Gems", href: "/gems/special/rare" },
          { label: "Custom Cut", href: "/gems/special/custom" },
          { label: "Vintage", href: "/gems/special/vintage" },
        ],
      },
    ],
  },
];

export function MegaMenu({ isMobileOpen, setIsMobileOpen }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="relative group"
            onMouseEnter={() => setActiveMenu(item.label)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              className="flex items-center space-x-1 py-4 text-sm font-medium hover:text-primary transition-colors"
            >
              <span>{item.label}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Mega Menu Dropdown */}
            {activeMenu === item.label && (
              <div className="absolute top-full left-0 w-screen bg-background border-b border-border shadow-luxury">
                <div className="container mx-auto px-4 py-6">
                  <div className="grid grid-cols-3 gap-8">
                    {item.items.map((section, idx) => (
                      <div key={idx}>
                        {section.section && (
                          <h3 className="font-medium text-sm mb-3">{section.section}</h3>
                        )}
                        <ul className="space-y-2">
                          {section.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <Link
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-50 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-end mb-2">
              <button
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-muted"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {menuItems.map((item) => (
              <div key={item.label} className="mb-6">
                <button
                  onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                  className="flex items-center justify-between w-full py-2 text-lg font-medium"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform ${
                      activeMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeMenu === item.label && (
                  <div className="mt-2 ml-4">
                    {item.items.map((section, idx) => (
                      <div key={idx} className="mb-4">
                        {section.section && (
                          <h3 className="font-medium text-sm mb-2">{section.section}</h3>
                        )}
                        <ul className="space-y-2">
                          {section.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <Link
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setIsMobileOpen(false)}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}