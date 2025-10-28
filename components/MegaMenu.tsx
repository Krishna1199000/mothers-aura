"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, X } from "lucide-react"
import { ProductPreview } from "./ProductPreview"
import { AnimatePresence, motion } from "framer-motion"

interface MegaMenuProps {
  isMobileOpen: boolean
  setIsMobileOpen: (isOpen: boolean) => void
  // Optional: explicit navbar height in px for correct dropdown positioning
  navbarHeight?: number
}

interface MenuItem {
  label: string
  items: {
    section?: string
    links: {
      label: string
      href: string
      icon?: string
      product?: {
        id: string
        name: string
        slug: string
        price: number
        images: string[]
        shape?: string
        carat?: number
        color?: string
        clarity?: string
      }
    }[]
  }[]
}

const menuItems: MenuItem[] = [
  {
    label: "Rings",
    items: [
      {
        section: "NATURAL GEMSTONE RINGS",
        links: [
          { label: "Ruby Rings", href: "/category/rings?type=ruby", icon: "🔴" },
          { label: "Emerald Rings", href: "/category/rings?type=emerald", icon: "🟢" },
          { label: "Blue Sapphire Rings", href: "/category/rings?type=blue-sapphire", icon: "🔵" },
          { label: "Yellow Sapphire Rings", href: "/category/rings?type=yellow-sapphire", icon: "🟡" },
          { label: "Amethyst Rings", href: "/category/rings?type=amethyst", icon: "🟣" },
          { label: "Aquamarine Rings", href: "/category/rings?type=aquamarine", icon: "🔵" },
          { label: "Citrine Rings", href: "/category/rings?type=citrine", icon: "🟡" },
          { label: "Garnet Rings", href: "/category/rings?type=garnet", icon: "🔴" },
          { label: "Explore All", href: "/category/rings?type=natural-gemstone" },
        ],
      },
      {
        section: "NATURAL DIAMOND RINGS",
        links: [
          { label: "Diamond Rings", href: "/category/rings?type=diamond", icon: "⚪" },
          { label: "Black Diamond Rings", href: "/category/rings?type=black-diamond", icon: "⚫" },
          { label: "Explore All", href: "/category/rings?type=natural-diamond" },
        ],
      },
      {
        section: "LAB-GROWN RINGS",
        links: [
          { label: "Lab Diamond Rings", href: "/category/rings?type=lab-diamond", icon: "⚪" },
          { label: "Lab Emerald Rings", href: "/category/rings?type=lab-emerald", icon: "🟢" },
          { label: "Lab Blue Sapphire Rings", href: "/category/rings?type=lab-blue-sapphire", icon: "🔵" },
          { label: "Lab Ruby Rings", href: "/category/rings?type=lab-ruby", icon: "🔴" },
          { label: "Explore All", href: "/category/rings?type=lab-grown" },
        ],
      },
      {
        section: "PEARL RINGS",
        links: [
          { label: "Freshwater Pearl Rings", href: "/category/rings?type=freshwater-pearl", icon: "⚪" },
          { label: "South Sea Pearl Rings", href: "/category/rings?type=south-sea-pearl", icon: "⚪" },
          { label: "Explore All", href: "/category/rings?type=pearl" },
        ],
      },
      {
        section: "RINGS BY STYLE",
        links: [
          { label: "Halo Rings", href: "/category/rings?style=halo", icon: "⚪" },
          { label: "Classic Rings", href: "/category/rings?style=classic", icon: "⚪" },
          { label: "Side Stone Rings", href: "/category/rings?style=side-stone", icon: "⚪" },
          { label: "Solitaire Rings", href: "/category/rings?style=solitaire", icon: "⚪" },
          { label: "Explore All", href: "/category/rings?style=all" },
        ],
      },
      {
        section: "RINGS BY METAL PURITY",
        links: [
          { label: "9 KT Yellow Gold", href: "/category/rings?metal=9kt-yellow-gold", icon: "🟡" },
          { label: "9 KT White Gold", href: "/category/rings?metal=9kt-white-gold", icon: "⚪" },
          { label: "14 KT Yellow Gold", href: "/category/rings?metal=14kt-yellow-gold", icon: "🟡" },
          { label: "14 KT White Gold", href: "/category/rings?metal=14kt-white-gold", icon: "⚪" },
          { label: "18 KT Yellow Gold", href: "/category/rings?metal=18kt-yellow-gold", icon: "🟡" },
          { label: "18 KT White Gold", href: "/category/rings?metal=18kt-white-gold", icon: "⚪" },
        ],
      },
      {
        section: "RINGS BY PRICE RANGE",
        links: [
          { label: "₹10,000 - ₹25,000", href: "/category/rings?price=10000-25000" },
          { label: "₹25,000 - ₹50,000", href: "/category/rings?price=25000-50000" },
          { label: "₹50,000 - ₹1,00,000", href: "/category/rings?price=50000-100000" },
          { label: "₹1,00,000 - ₹2,00,000", href: "/category/rings?price=100000-200000" },
        ],
      },
    ],
  },
  {
    label: "Necklaces",
    items: [
      {
        section: "NATURAL DIAMOND NECKLACES",
        links: [
          { label: "Diamond Necklaces", href: "/category/necklaces?type=diamond", icon: "⚪" },
          { label: "Black Diamond Necklaces", href: "/category/necklaces?type=black-diamond", icon: "⚫" },
          { label: "Explore All", href: "/category/necklaces?type=natural-diamond" },
        ],
      },
      {
        section: "LAB-GROWN NECKLACES",
        links: [
          { label: "Lab Diamond Necklaces", href: "/category/necklaces?type=lab-diamond", icon: "⚪" },
          { label: "Lab Emerald Necklaces", href: "/category/necklaces?type=lab-emerald", icon: "🟢" },
          { label: "Lab Blue Sapphire Necklaces", href: "/category/necklaces?type=lab-blue-sapphire", icon: "🔵" },
          { label: "Lab Ruby Necklaces", href: "/category/necklaces?type=lab-ruby", icon: "🔴" },
          { label: "Explore All", href: "/category/necklaces?type=lab-grown" },
        ],
      },
      {
        section: "NECKLACES BY STYLE",
        links: [
          { label: "Solitaire", href: "/category/necklaces?style=solitaire", icon: "⚪" },
          { label: "Religious", href: "/category/necklaces?style=religious", icon: "⚪" },
          { label: "Infinity", href: "/category/necklaces?style=infinity", icon: "⚪" },
          { label: "Initials", href: "/category/necklaces?style=initials", icon: "⚪" },
          { label: "Mangalsutra", href: "/category/necklaces?style=mangalsutra", icon: "⚪" },
          { label: "Explore All", href: "/category/necklaces?style=all" },
        ],
      },
      {
        section: "NECKLACES BY METAL PURITY",
        links: [
          { label: "9 KT Yellow Gold", href: "/category/necklaces?metal=9kt-yellow-gold", icon: "🟡" },
          { label: "14 KT Yellow Gold", href: "/category/necklaces?metal=14kt-yellow-gold", icon: "🟡" },
          { label: "14 KT White Gold", href: "/category/necklaces?metal=14kt-white-gold", icon: "⚪" },
          { label: "14 KT Rose Gold", href: "/category/necklaces?metal=14kt-rose-gold", icon: "🟠" },
          { label: "18 KT Yellow Gold", href: "/category/necklaces?metal=18kt-yellow-gold", icon: "🟡" },
          { label: "18 KT White Gold", href: "/category/necklaces?metal=18kt-white-gold", icon: "⚪" },
          { label: "18 KT Rose Gold", href: "/category/necklaces?metal=18kt-rose-gold", icon: "🟠" },
        ],
      },
      {
        section: "NECKLACES BY PRICE RANGE",
        links: [
          { label: "₹10,000 - ₹25,000", href: "/category/necklaces?price=10000-25000" },
          { label: "₹25,000 - ₹50,000", href: "/category/necklaces?price=25000-50000" },
          { label: "₹50,000 - ₹1,00,000", href: "/category/necklaces?price=50000-100000" },
          { label: "₹1,00,000 - ₹2,00,000", href: "/category/necklaces?price=100000-200000" },
        ],
      },
    ],
  },
  {
    label: "Mangalsutra",
    items: [
      {
        section: "NATURAL GEMSTONE MANGALSUTRA",
        links: [
          { label: "Ruby Mangalsutra", href: "/category/mangalsutra?type=ruby", icon: "🔴" },
          { label: "Emerald Mangalsutra", href: "/category/mangalsutra?type=emerald", icon: "🟢" },
          { label: "Blue Sapphire Mangalsutra", href: "/category/mangalsutra?type=blue-sapphire", icon: "🔵" },
          { label: "Explore All", href: "/category/mangalsutra?type=natural-gemstone" },
        ],
      },
      {
        section: "NATURAL DIAMOND MANGALSUTRA",
        links: [
          { label: "Diamond Mangalsutra", href: "/category/mangalsutra?type=diamond", icon: "⚪" },
          { label: "Explore All", href: "/category/mangalsutra?type=natural-diamond" },
        ],
      },
      {
        section: "LAB-GROWN MANGALSUTRA",
        links: [
          { label: "Lab Diamond Mangalsutra", href: "/category/mangalsutra?type=lab-diamond", icon: "⚪" },
          { label: "Lab Ruby Mangalsutra", href: "/category/mangalsutra?type=lab-ruby", icon: "🔴" },
          { label: "Lab Emerald Mangalsutra", href: "/category/mangalsutra?type=lab-emerald", icon: "🟢" },
          { label: "Lab Blue Sapphire Mangalsutra", href: "/category/mangalsutra?type=lab-blue-sapphire", icon: "🔵" },
          { label: "Explore All", href: "/category/mangalsutra?type=lab-grown" },
        ],
      },
      {
        section: "MANGALSUTRA BY STYLE",
        links: [
          { label: "Mangalsutra Necklaces", href: "/category/mangalsutra?style=necklace", icon: "⚪" },
          { label: "Mangalsutra Bracelets", href: "/category/mangalsutra?style=bracelet", icon: "⚪" },
          { label: "Mangalsutra Earrings", href: "/category/mangalsutra?style=earring", icon: "⚪" },
          { label: "Explore All", href: "/category/mangalsutra?style=all" },
        ],
      },
      {
        section: "MANGALSUTRA BY METAL PURITY",
        links: [
          { label: "9 KT Yellow Gold", href: "/category/mangalsutra?metal=9kt-yellow-gold", icon: "🟡" },
          { label: "14 KT Yellow Gold", href: "/category/mangalsutra?metal=14kt-yellow-gold", icon: "🟡" },
          { label: "18 KT Yellow Gold", href: "/category/mangalsutra?metal=18kt-yellow-gold", icon: "🟡" },
        ],
      },
      {
        section: "MANGALSUTRA BY PRICE RANGE",
        links: [
          { label: "₹25,000 - ₹50,000", href: "/category/mangalsutra?price=25000-50000" },
          { label: "₹50,000 - ₹1,00,000", href: "/category/mangalsutra?price=50000-100000" },
          { label: "₹1,00,000 - ₹2,00,000", href: "/category/mangalsutra?price=100000-200000" },
        ],
      },
    ],
  },
  {
    label: "Earrings",
    items: [
      {
        section: "NATURAL GEMSTONE EARRINGS",
        links: [
          { label: "Ruby Earrings", href: "/category/earrings?type=ruby", icon: "🔴" },
          { label: "Emerald Earrings", href: "/category/earrings?type=emerald", icon: "🟢" },
          { label: "Blue Sapphire Earrings", href: "/category/earrings?type=blue-sapphire", icon: "🔵" },
          { label: "Yellow Sapphire Earrings", href: "/category/earrings?type=yellow-sapphire", icon: "🟡" },
          { label: "Amethyst Earrings", href: "/category/earrings?type=amethyst", icon: "🟣" },
          { label: "London Blue Topaz Earrings", href: "/category/earrings?type=london-blue-topaz", icon: "🔵" },
          { label: "Aquamarine Earrings", href: "/category/earrings?type=aquamarine", icon: "🔵" },
          { label: "Citrine Earrings", href: "/category/earrings?type=citrine", icon: "🟡" },
          { label: "Garnet Earrings", href: "/category/earrings?type=garnet", icon: "🔴" },
          { label: "Morganite Earrings", href: "/category/earrings?type=morganite", icon: "🟠" },
          { label: "Peridot Earrings", href: "/category/earrings?type=peridot", icon: "🟢" },
          { label: "Pink Sapphire Earrings", href: "/category/earrings?type=pink-sapphire", icon: "🟣" },
          { label: "Opal Earrings", href: "/category/earrings?type=opal", icon: "⚪" },
          { label: "Explore All", href: "/category/earrings?type=natural-gemstone" },
        ],
      },
      {
        section: "NATURAL DIAMOND EARRINGS",
        links: [
          { label: "Diamond Earrings", href: "/category/earrings?type=diamond", icon: "⚪" },
          { label: "Black Diamond Earrings", href: "/category/earrings?type=black-diamond", icon: "⚫" },
          { label: "Explore All", href: "/category/earrings?type=natural-diamond" },
        ],
      },
      {
        section: "PEARL EARRINGS",
        links: [
          { label: "Freshwater Pearl Earrings", href: "/category/earrings?type=freshwater-pearl", icon: "⚪" },
          { label: "South Sea Pearl Earrings", href: "/category/earrings?type=south-sea-pearl", icon: "⚪" },
          { label: "Explore All", href: "/category/earrings?type=pearl" },
        ],
      },
      {
        section: "LAB-GROWN EARRINGS",
        links: [
          { label: "Lab Diamond Earrings", href: "/category/earrings?type=lab-diamond", icon: "⚪" },
          { label: "Lab Emerald Earrings", href: "/category/earrings?type=lab-emerald", icon: "🟢" },
          { label: "Lab Blue Sapphire Earrings", href: "/category/earrings?type=lab-blue-sapphire", icon: "🔵" },
          { label: "Lab Ruby Earrings", href: "/category/earrings?type=lab-ruby", icon: "🔴" },
          { label: "Explore All", href: "/category/earrings?type=lab-grown" },
        ],
      },
      {
        section: "EARRINGS BY STYLE",
        links: [
          { label: "Classic Earrings", href: "/category/earrings?style=classic", icon: "⚪" },
          { label: "Solitaire Stud Earrings", href: "/category/earrings?style=solitaire-stud", icon: "⚪" },
          { label: "Drop Earrings", href: "/category/earrings?style=drop", icon: "⚪" },
          { label: "Halo Earrings", href: "/category/earrings?style=halo", icon: "⚪" },
          { label: "Sui Dhaga Earrings", href: "/category/earrings?style=sui-dhaga", icon: "⚪" },
          { label: "Explore All", href: "/category/earrings?style=all" },
        ],
      },
      {
        section: "EARRINGS BY METAL PURITY",
        links: [
          { label: "9 KT Yellow Gold", href: "/category/earrings?metal=9kt-yellow-gold", icon: "🟡" },
          { label: "14 KT Yellow Gold", href: "/category/earrings?metal=14kt-yellow-gold", icon: "🟡" },
          { label: "14 KT White Gold", href: "/category/earrings?metal=14kt-white-gold", icon: "⚪" },
          { label: "14 KT Rose Gold", href: "/category/earrings?metal=14kt-rose-gold", icon: "🟠" },
          { label: "18 KT Yellow Gold", href: "/category/earrings?metal=18kt-yellow-gold", icon: "🟡" },
          { label: "18 KT White Gold", href: "/category/earrings?metal=18kt-white-gold", icon: "⚪" },
          { label: "18 KT Rose Gold", href: "/category/earrings?metal=18kt-rose-gold", icon: "🟠" },
        ],
      },
      {
        section: "EARRINGS BY PRICE RANGE",
        links: [
          { label: "₹10,000 - ₹25,000", href: "/category/earrings?price=10000-25000" },
          { label: "₹25,000 - ₹50,000", href: "/category/earrings?price=25000-50000" },
          { label: "₹50,000 - ₹1,00,000", href: "/category/earrings?price=50000-100000" },
          { label: "₹1,00,000 - ₹2,00,000", href: "/category/earrings?price=100000-200000" },
        ],
      },
    ],
  },
  {
    label: "Bracelets",
    items: [
      {
        section: "NATURAL GEMSTONE BRACELETS",
        links: [
          { label: "Ruby Bracelets", href: "/category/bracelets?type=ruby", icon: "🔴" },
          { label: "Emerald Bracelets", href: "/category/bracelets?type=emerald", icon: "🟢" },
          { label: "Blue Sapphire Bracelets", href: "/category/bracelets?type=blue-sapphire", icon: "🔵" },
          { label: "Yellow Sapphire Bracelets", href: "/category/bracelets?type=yellow-sapphire", icon: "🟡" },
          { label: "Amethyst Bracelets", href: "/category/bracelets?type=amethyst", icon: "🟣" },
          { label: "London Blue Topaz Bracelets", href: "/category/bracelets?type=london-blue-topaz", icon: "🔵" },
          { label: "Aquamarine Bracelets", href: "/category/bracelets?type=aquamarine", icon: "🔵" },
          { label: "Citrine Bracelets", href: "/category/bracelets?type=citrine", icon: "🟡" },
          { label: "Garnet Bracelets", href: "/category/bracelets?type=garnet", icon: "🔴" },
          { label: "Morganite Bracelets", href: "/category/bracelets?type=morganite", icon: "🟠" },
          { label: "Peridot Bracelets", href: "/category/bracelets?type=peridot", icon: "🟢" },
          { label: "Pink Sapphire Bracelets", href: "/category/bracelets?type=pink-sapphire", icon: "🟣" },
          { label: "Opal Bracelets", href: "/category/bracelets?type=opal", icon: "⚪" },
          { label: "Explore All", href: "/category/bracelets?type=natural-gemstone" },
        ],
      },
      {
        section: "NATURAL DIAMOND BRACELETS",
        links: [
          { label: "Diamond Bracelets", href: "/category/bracelets?type=diamond", icon: "⚪" },
          { label: "Explore All", href: "/category/bracelets?type=natural-diamond" },
        ],
      },
      {
        section: "PEARL BRACELETS",
        links: [
          { label: "Freshwater Pearl Bracelets", href: "/category/bracelets?type=freshwater-pearl", icon: "⚪" },
          { label: "South Sea Pearl Bracelets", href: "/category/bracelets?type=south-sea-pearl", icon: "⚪" },
          { label: "Explore All", href: "/category/bracelets?type=pearl" },
        ],
      },
      {
        section: "LAB-GROWN BRACELETS",
        links: [
          { label: "Lab Diamond Bracelets", href: "/category/bracelets?type=lab-diamond", icon: "⚪" },
          { label: "Lab Emerald Bracelets", href: "/category/bracelets?type=lab-emerald", icon: "🟢" },
          { label: "Lab Blue Sapphire Bracelets", href: "/category/bracelets?type=lab-blue-sapphire", icon: "🔵" },
          { label: "Lab Ruby Bracelets", href: "/category/bracelets?type=lab-ruby", icon: "🔴" },
          { label: "Explore All", href: "/category/bracelets?type=lab-grown" },
        ],
      },
      {
        section: "BRACELETS BY STYLE",
        links: [
          { label: "Tennis Bracelets", href: "/category/bracelets?style=tennis", icon: "⚪" },
          { label: "Chain Bracelets", href: "/category/bracelets?style=chain", icon: "⚪" },
          { label: "Mangalsutra Bracelets", href: "/category/bracelets?style=mangalsutra", icon: "⚪" },
          { label: "Explore All", href: "/category/bracelets?style=all" },
        ],
      },
      {
        section: "BRACELETS BY METAL PURITY",
        links: [
          { label: "9 KT Yellow Gold", href: "/category/bracelets?metal=9kt-yellow-gold", icon: "🟡" },
          { label: "14 KT Yellow Gold", href: "/category/bracelets?metal=14kt-yellow-gold", icon: "🟡" },
          { label: "14 KT White Gold", href: "/category/bracelets?metal=14kt-white-gold", icon: "⚪" },
          { label: "14 KT Rose Gold", href: "/category/bracelets?metal=14kt-rose-gold", icon: "🟠" },
          { label: "18 KT Yellow Gold", href: "/category/bracelets?metal=18kt-yellow-gold", icon: "🟡" },
          { label: "18 KT White Gold", href: "/category/bracelets?metal=18kt-white-gold", icon: "⚪" },
          { label: "18 KT Rose Gold", href: "/category/bracelets?metal=18kt-rose-gold", icon: "🟠" },
        ],
      },
      {
        section: "BRACELETS BY PRICE RANGE",
        links: [
          { label: "₹50,000 - ₹1,00,000", href: "/category/bracelets?price=50000-100000" },
          { label: "₹1,00,000 - ₹2,00,000", href: "/category/bracelets?price=100000-200000" },
          { label: "Above ₹2,00,000", href: "/category/bracelets?price=above-200000" },
        ],
      },
    ],
  },
  {
    label: "Gift",
    items: [
      {
        section: "BIRTHSTONES JEWELLERY",
        links: [
          { label: "JAN-Garnet", href: "/category/gift?birthstone=garnet", icon: "🔴" },
          { label: "FEB-Amethyst", href: "/category/gift?birthstone=amethyst", icon: "🟣" },
          { label: "MAR-Aquamarine", href: "/category/gift?birthstone=aquamarine", icon: "🔵" },
          { label: "APR-Diamond", href: "/category/gift?birthstone=diamond", icon: "⚪" },
          { label: "MAY-Emerald", href: "/category/gift?birthstone=emerald", icon: "🟢" },
          { label: "JUN-Pearl", href: "/category/gift?birthstone=pearl", icon: "⚪" },
          { label: "JUL-Ruby", href: "/category/gift?birthstone=ruby", icon: "🔴" },
          { label: "AUG-Peridot", href: "/category/gift?birthstone=peridot", icon: "🟢" },
          { label: "SEP-Sapphire", href: "/category/gift?birthstone=sapphire", icon: "🔵" },
          { label: "OCT-Opal", href: "/category/gift?birthstone=opal", icon: "⚪" },
          { label: "NOV-Citrine", href: "/category/gift?birthstone=citrine", icon: "🟡" },
          { label: "DEC-Tanzanite", href: "/category/gift?birthstone=tanzanite", icon: "🔵" },
          { label: "Explore All", href: "/category/gift?type=birthstone" },
        ],
      },
      {
        section: "GIFTS BY OCCASION",
        links: [
          { label: "Rakhi", href: "/category/gift?occasion=rakhi" },
          { label: "Gifts For Sister", href: "/category/gift?occasion=sister" },
          { label: "Mother's Day", href: "/category/gift?occasion=mothers-day" },
          { label: "Akshaya Tritiya", href: "/category/gift?occasion=akshaya-tritiya" },
          { label: "Valentine's Day", href: "/category/gift?occasion=valentine" },
          { label: "Anniversary", href: "/category/gift?occasion=anniversary" },
          { label: "Wedding", href: "/category/gift?occasion=wedding" },
          { label: "Promise Rings", href: "/category/gift?occasion=promise-rings" },
          { label: "Explore All", href: "/category/gift?type=occasion" },
        ],
      },
      {
        section: "PERSONALISED JEWELLERY",
        links: [
          { label: "Zodiac Jewellery", href: "/category/gift?type=zodiac", icon: "⚪" },
          { label: "Initials Jewellery", href: "/category/gift?type=initials", icon: "⚪" },
          { label: "Explore All", href: "/category/gift?type=personalised" },
        ],
      },
      {
        section: "POPULAR GIFTS",
        links: [
          { label: "Gemstone Jewellery", href: "/category/gift?type=gemstone" },
          { label: "Diamond Jewellery", href: "/category/gift?type=diamond" },
          { label: "Lab Grown Jewellery", href: "/category/gift?type=lab-grown" },
          { label: "Heart Jewellery", href: "/category/gift?type=heart" },
          { label: "Religious Jewellery", href: "/category/gift?type=religious" },
          { label: "Cocktail Rings", href: "/category/gift?type=cocktail-rings" },
          { label: "Explore All", href: "/category/gift?type=popular" },
        ],
      },
      {
        section: "GIFTS BY CATEGORY",
        links: [
          { label: "Rings", href: "/category/gift?category=rings", icon: "⚪" },
          { label: "Earrings", href: "/category/gift?category=earrings", icon: "⚪" },
          { label: "Necklaces", href: "/category/gift?category=necklaces", icon: "⚪" },
          { label: "Bracelets", href: "/category/gift?category=bracelets", icon: "⚪" },
          { label: "Nose Pin", href: "/category/gift?category=nose-pin", icon: "⚪" },
          { label: "Watch Jewellery", href: "/category/gift?category=watch-jewellery", icon: "⚪" },
          { label: "Explore All", href: "/category/gift?type=category" },
        ],
      },
      {
        section: "GIFTS BY PRICE RANGE",
        links: [
          { label: "₹10,000 - ₹25,000", href: "/category/gift?price=10000-25000" },
          { label: "₹25,000 - ₹50,000", href: "/category/gift?price=25000-50000" },
          { label: "₹50,000 - ₹1,00,000", href: "/category/gift?price=50000-100000" },
          { label: "₹1,00,000 - ₹2,00,000", href: "/category/gift?price=100000-200000" },
        ],
      },
    ],
  },
]

export function MegaMenu({ isMobileOpen, setIsMobileOpen, navbarHeight = 56 }: MegaMenuProps) {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  shape?: string;
  carat?: number;
  color?: string;
  clarity?: string;
}

const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleItemClick = async (href: string, product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    } else if (href.startsWith('/category/')) {
      // Redirect category links to products page
      setIsMobileOpen(false);
      setActiveMenu(null);
      router.push('/products');
    } else {
      setIsMobileOpen(false);
      setActiveMenu(null);
      router.push(href);
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as Element).closest('.mega-menu-container')) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

  return (
    <div className="relative mega-menu-container w-full flex justify-center" style={{ '--navbar-height': `${navbarHeight}px` } as React.CSSProperties}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-center space-x-12 w-full max-w-[1400px]">
        {menuItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="relative group"
            onMouseEnter={() => setActiveMenu(item.label)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="flex items-center space-x-1 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-white transition-colors">
              <span>{item.label}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {activeMenu === item.label && (
              <div className="fixed left-0 right-0 top-[calc(var(--navbar-height)+3.4rem)] z-[60] bg-white dark:bg-gray-950 shadow-2xl border-b border-gray-100 dark:border-gray-800 max-h-[70vh] overflow-y-auto">
                <div className="container mx-auto px-4 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    {item.items.map((section, idx) => (
                      <div key={idx} className="min-w-0 w-full px-2 py-2 rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/70">
                        {section.section && (
                          <h3 className="font-bold text-xs mb-2 text-gray-800 dark:text-gray-100 uppercase tracking-wider border-b pb-1 border-gray-200 dark:border-gray-700">
                            {section.section}
                          </h3>
                        )}
                        <ul className="space-y-1 max-h-[300px] overflow-y-auto">
                          {section.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <button
                                onClick={() => handleItemClick(link.href, link.product)}
                                className="text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left flex items-center gap-2 py-1.5 px-2 rounded"
                              >
                                {link.icon ? (
                                  <span className="flex-shrink-0">{link.icon}</span>
                                ) : (
                                  link.label !== "Explore All" && <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></span>
                                )}
                                <span>{link.label}</span>
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
            
            <AnimatePresence>
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedProduct(null)}
                >
                  <div onClick={e => e.stopPropagation()}>
                    <ProductPreview
                      product={selectedProduct}
                      onClose={() => setSelectedProduct(null)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <button
          onClick={() => handleItemClick("/about")}
          className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          About us
        </button>
        <button
          onClick={() => handleItemClick("/trending")}
          className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          Trending
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4 max-h-screen">
            <div className="flex justify-end mb-2">
              <button
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {menuItems.map((item, index) => (
              <div key={`${item.label}-${index}`} className="mb-6">
                <button
                  onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                  className="flex items-center justify-between w-full py-2 text-lg font-medium text-gray-800 dark:text-gray-100"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform ${
                      activeMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeMenu === item.label && (
                  <div className="mt-2 ml-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                      {item.items.map((section, idx) => (
                        <div key={idx} className="mb-3">
                          {section.section && (
                            <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-100 uppercase tracking-wider border-b pb-2 border-gray-200 dark:border-gray-700">{section.section}</h3>
                          )}
                          <ul className="space-y-1 max-h-[200px] overflow-y-auto">
                            {section.links.map((link, linkIdx) => (
                              <li key={linkIdx}>
                                <button
                                  onClick={() => handleItemClick(link.href)}
                                  className="text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-black dark:hover:text-white transition-all flex items-center gap-2"
                                >
                                  {link.icon ? (
                                    <span className="flex-shrink-0">{link.icon}</span>
                                  ) : (
                                    link.label !== "Explore All" && <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></span>
                                  )}
                                  {link.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2 space-y-4">
              <button onClick={() => handleItemClick("/about")} className="block text-lg font-medium text-gray-800 dark:text-gray-100">
                About us
              </button>
              <button onClick={() => handleItemClick("/trending")} className="block text-lg font-medium text-gray-800 dark:text-gray-100">
                Trending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
