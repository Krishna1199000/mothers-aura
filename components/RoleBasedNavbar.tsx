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
  group?: string;
}

interface RoleBasedNavbarProps {
  role: "ADMIN" | "EMPLOYEE" | "CUSTOMER";
}

const navItems: Record<string, NavItem[]> = {
  ADMIN: [
    // Core Management
    { href: "/dashboard", label: "Dashboard", group: "core" },
    { href: "/admin/manage-users", label: "Manage Users", group: "core" },
    { href: "/admin/masters", label: "Masters", group: "core" },
    
    // Inventory & Products
    { href: "/admin/inventory", label: "Inventory", group: "inventory" },
    { href: "/admin/ui-inventory", label: "UI Inventory", group: "inventory" },
    { href: "/admin/parcel-goods", label: "Parcel Goods", group: "inventory" },
    
    // Orders & Transactions
    { href: "/admin/orders", label: "Orders", group: "orders" },
    { href: "/admin/invoices", label: "Invoices", group: "orders" },
    { href: "/admin/memos", label: "Memos", group: "orders" },
    { href: "/admin/ledger", label: "Account Ledger", group: "orders" },
    
    // Communication
    { href: "/admin/chats", label: "Chat", group: "communication" },
    
    // Reports & Analytics
    { href: "/admin/reports/sales", label: "Sales Report", group: "reports" },
    { href: "/admin/performance", label: "Performance Reports", group: "reports" },
  ],
  EMPLOYEE: [
    { href: "/dashboard", label: "Dashboard", group: "core" },
    { href: "/admin/masters", label: "Masters", group: "core" },
    { href: "/admin/inventory", label: "Inventory", group: "inventory" },
    { href: "/admin/ui-inventory", label: "UI Inventory", group: "inventory" },
    { href: "/admin/parcel-goods", label: "Parcel Goods", group: "inventory" },
    { href: "/admin/orders", label: "Orders", group: "orders" },
    { href: "/admin/invoices", label: "Invoices", group: "orders" },
    { href: "/admin/memos", label: "Memos", group: "orders" },
    { href: "/admin/chats", label: "Chat", group: "communication" },
    { href: "/admin/performance", label: "Performance Reports", group: "reports" },
  ],
  CUSTOMER: [
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function RoleBasedNavbar({ role }: RoleBasedNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const items = navItems[role] || navItems.CUSTOMER;

  // Group items for desktop navigation
  const groupedItems = items.reduce((acc, item) => {
    if (!item.group) {
      acc.ungrouped = acc.ungrouped || [];
      acc.ungrouped.push(item);
    } else {
      acc[item.group] = acc[item.group] || [];
      acc[item.group].push(item);
    }
    return acc;
  }, {} as Record<string, NavItem[]>);

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
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group} className="relative group">
                {groupItems.length === 1 ? (
                  <Link
                    href={groupItems[0].href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === groupItems[0].href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {groupItems[0].label}
                  </Link>
                ) : (
                  <>
                    <button
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                        pathname.startsWith(`/admin/${group}`)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-48 bg-popover rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border">
                      <div className="py-1">
                        {groupItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "block px-4 py-2 text-sm transition-colors",
                              pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
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
                {Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group} className="space-y-1">
                    {group !== "ungrouped" && (
                      <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group}
                      </h3>
                    )}
                    {groupItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md transition-colors block",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}