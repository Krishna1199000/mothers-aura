"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
}

interface RoleBasedNavbarProps {
  role: "ADMIN" | "EMPLOYEE" | "CUSTOMER";
}

const navItems: Record<string, NavItem[]> = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/manage-users", label: "Manage Users" },
    { href: "/admin/masters", label: "Masters" },
    { href: "/admin/invoices", label: "Invoices" },
    { href: "/admin/memos", label: "Memos" },
    { href: "/admin/parcel-goods", label: "Parcel Goods" },
    { href: "/admin/inventory", label: "Inventory" },
    { href: "/admin/reports/sales", label: "Sales Report" },
    { href: "/admin/performance", label: "Performance Reports" },
    { href: "/admin/ledger", label: "Account Ledger" },
  ],
  EMPLOYEE: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/masters", label: "Masters" },
    { href: "/admin/invoices", label: "Invoices" },
    { href: "/admin/memos", label: "Memos" },
    { href: "/admin/parcel-goods", label: "Parcel Goods" },
    { href: "/admin/inventory", label: "Inventory" },
    { href: "/admin/performance", label: "Performance Reports" },
  ],
  CUSTOMER: [
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function RoleBasedNavbar({ role }: RoleBasedNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const items = navItems[role] || navItems.CUSTOMER;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Role Label */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <img
                src="/Logo.jpg"
                alt="Logo"
                className="h-10 w-10 rounded-lg object-contain"
              />
            </Link>
            <span className="text-base font-semibold hidden sm:block">
              {role === "ADMIN"
                ? "Admin Panel"
                : role === "EMPLOYEE"
                ? "Employee Panel"
                : "Customer Panel"}
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

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-md hover:bg-primary/5 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-3">
                    <img
                      src="/Logo.jpg"
                      alt="Logo"
                      className="h-10 w-10 rounded-lg object-contain"
                    />
                    <span className="text-base font-semibold">
                      {role === "ADMIN"
                        ? "Admin Panel"
                        : role === "EMPLOYEE"
                        ? "Employee Panel"
                        : "Customer Panel"}
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-2">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}