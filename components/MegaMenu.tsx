"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    label: "Rings",
    items: [
      {
        section: "Engagement",
        links: [
          { label: "Solitaire", href: "/category/rings?type=solitaire" },
          { label: "Halo", href: "/category/rings?type=halo" },
          { label: "Vintage", href: "/category/rings?type=vintage" },
          { label: "Three-Stone", href: "/category/rings?type=three-stone" },
        ],
      },
      {
        section: "Wedding",
        links: [
          { label: "Classic Bands", href: "/category/rings?type=classic-band" },
          { label: "Eternity", href: "/category/rings?type=eternity" },
          { label: "Promise", href: "/category/rings?type=promise" },
          { label: "Matching Sets", href: "/category/rings?type=matching-set" },
        ],
      },
      {
        section: "Fashion",
        links: [
          { label: "Cocktail", href: "/category/rings?type=cocktail" },
          { label: "Stackable", href: "/category/rings?type=stackable" },
          { label: "Statement", href: "/category/rings?type=statement" },
          { label: "Everyday", href: "/category/rings?type=everyday" },
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
          { label: "Natural", href: "/category/diamonds?type=natural" },
          { label: "Lab-Grown", href: "/category/diamonds?type=lab-grown" },
          { label: "Certified", href: "/category/diamonds?type=certified" },
          { label: "Premium", href: "/category/diamonds?type=premium" },
        ],
      },
      {
        section: "By Carat",
        links: [
          { label: "Under 1ct", href: "/category/diamonds?carat=under-1" },
          { label: "1-2ct", href: "/category/diamonds?carat=1-2" },
          { label: "2-3ct", href: "/category/diamonds?carat=2-3" },
          { label: "Over 3ct", href: "/category/diamonds?carat=over-3" },
        ],
      },
      {
        section: "By Quality",
        links: [
          { label: "By Colour", href: "/category/diamonds?quality=color" },
          { label: "By Clarity", href: "/category/diamonds?quality=clarity" },
          { label: "By Cut", href: "/category/diamonds?quality=cut" },
          { label: "Investment Grade", href: "/category/diamonds?quality=investment" },
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
          { label: "Sapphire", href: "/category/gems?type=sapphire" },
          { label: "Emerald", href: "/category/gems?type=emerald" },
          { label: "Ruby", href: "/category/gems?type=ruby" },
          { label: "Premium", href: "/category/gems?type=premium" },
        ],
      },
      {
        section: "Semi-Precious",
        links: [
          { label: "Tanzanite", href: "/category/gems?type=tanzanite" },
          { label: "Aquamarine", href: "/category/gems?type=aquamarine" },
          { label: "Morganite", href: "/category/gems?type=morganite" },
          { label: "Tourmaline", href: "/category/gems?type=tourmaline" },
        ],
      },
      {
        section: "Special",
        links: [
          { label: "Birthstones", href: "/category/gems?type=birthstone" },
          { label: "Rare Gems", href: "/category/gems?type=rare" },
          { label: "Custom Cut", href: "/category/gems?type=custom" },
          { label: "Vintage", href: "/category/gems?type=vintage" },
        ],
      },
    ],
  },
];

export function MegaMenu({ isMobileOpen, setIsMobileOpen }: MegaMenuProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setDynamicCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Combine static menu items with dynamic categories
  const allMenuItems = [
    ...menuItems,
    ...dynamicCategories
      .filter(category => !menuItems.some(item => item.label.toLowerCase() === category.name.toLowerCase()))
      .map(category => ({
        label: category.name,
        items: [
          {
            section: "Products",
            links: [
              { label: "All Products", href: `/category/${category.slug}` },
              ...category.subcategories.map(sub => ({
                label: sub.name,
                href: `/category/${category.slug}?subcategory=${sub.slug}`
              }))
            ]
          }
        ]
      }))
  ];

  const handleItemClick = async (href: string) => {
    setIsMobileOpen(false);

    // Parse the URL to get category and type
    const url = new URL(href, window.location.origin);
    const category = url.pathname.split('/')[2]; // Get category from path
    const type = url.searchParams.get('type');
    const subcategory = url.searchParams.get('subcategory');
    const quality = url.searchParams.get('quality');
    const carat = url.searchParams.get('carat');

    // Build query params for category mapping
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (type) params.append("type", type);
    if (subcategory) params.append("subcategory", subcategory);
    if (quality) params.append("type", quality); // Map quality to type for search
    if (carat) params.append("type", carat); // Map carat to type for search

    try {
      // Fetch mapped products
      const response = await fetch(`/api/categories/map?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to map category");
      const data = await response.json();

      // Store the results in localStorage for the target page
      localStorage.setItem("categoryResults", JSON.stringify(data));

      // Navigate to the target page
      router.push(href);
    } catch (error) {
      console.error("Error mapping category:", error);
      router.push(href); // Fallback to direct navigation
    }
  };

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {allMenuItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
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
                              <button
                                onClick={() => handleItemClick(link.href)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {link.label}
                              </button>
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
        {/* Simple links (no dropdown) */}
        <button
          onClick={() => handleItemClick("/about")}
          className="py-4 text-sm font-medium hover:text-primary transition-colors"
        >
          About us
        </button>
        <button
          onClick={() => handleItemClick("/diamonds")}
          className="py-4 text-sm font-medium hover:text-primary transition-colors"
        >
          Trending
        </button>
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
            {allMenuItems.map((item, index) => (
              <div key={`${item.label}-${index}`} className="mb-6">
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
                              <button
                                onClick={() => handleItemClick(link.href)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {link.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Simple links (no dropdown) for mobile */}
            <div className="mt-2 space-y-4">
              <button
                onClick={() => handleItemClick("/about")}
                className="block text-lg font-medium"
              >
                About us
              </button>
              <button
                onClick={() => handleItemClick("/diamonds")}
                className="block text-lg font-medium"
              >
                Trending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}