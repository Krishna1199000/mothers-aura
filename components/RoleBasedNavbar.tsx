"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

interface RoleBasedNavbarProps {
  role: "ADMIN" | "EMPLOYEE" | "CUSTOMER";
}

const navItems: Record<string, NavItem[]> = {
  ADMIN: [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/manage-users", label: "Manage Users" },
    { href: "/admin/masters", label: "Masters" },
    { href: "/admin/invoices", label: "Invoices" },
    { href: "/admin/memos", label: "Memos" },
    { href: "/admin/parcel-goods", label: "Parcel Goods" },
  ],
  EMPLOYEE: [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/masters", label: "Masters" },
    { href: "/admin/invoices", label: "Invoices" },
    { href: "/admin/memos", label: "Memos" },
    { href: "/admin/parcel-goods", label: "Parcel Goods" },
  ],
  CUSTOMER: [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function RoleBasedNavbar({ role }: RoleBasedNavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const items = navItems[role] || navItems.CUSTOMER;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Role Label */}
          <div className="flex items-center gap-3">
            <img src="/Logo.jpg" alt="Logo" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-base font-semibold hidden sm:block">
              {role === "ADMIN" ? "Admin Panel" : role === "EMPLOYEE" ? "Employee Panel" : "Customer Panel"}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-primary/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-2 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}