"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRolePrefix } from "@/lib/get-role-prefix";
import { useTheme } from "next-themes";
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
  showLogoOnly?: boolean;
  showNavigationOnly?: boolean;
}

const navItems: Record<string, NavItem[]> = {
  ADMIN: [
    // Core Management
    { href: "/dashboard", label: "Dashboard", group: "core" },
    { href: "/manage-users", label: "Manage Users", group: "core" },
    { href: "/masters", label: "Masters", group: "core" },
    { href: "/announcements", label: "Announcements", group: "core" },
    { href: "/customer-testimonials", label: "Customer Testimonials", group: "core" },

    // Inventory & Products
    { href: "/inventory", label: "Inventory", group: "inventory" },
    { href: "/ui-inventory", label: "UI Inventory", group: "inventory" },
    { href: "/parcel-goods", label: "Parcel Goods", group: "inventory" },

    // Orders & Transactions
    { href: "/orders", label: "Orders", group: "orders" },
    { href: "/invoices", label: "Invoices", group: "orders" },
    { href: "/memos", label: "Memos", group: "orders" },

    // Communication
    { href: "/chats", label: "Chat", group: "communication" },

    // Reports & Analytics
    { href: "/reports/sales", label: "Sales Report", group: "reports" },
    { href: "/reports/outstanding", label: "Outstanding Report", group: "reports" },
    { href: "/performance", label: "Performance Reports", group: "reports" },
    { href: "/ledger", label: "Account Ledger", group: "reports" },
  ],
  EMPLOYEE: [
    // Core
    { href: "/dashboard", label: "Dashboard", group: "core" },
    { href: "/masters", label: "Masters", group: "core" },

    // Inventory
    { href: "/inventory", label: "Inventory", group: "inventory" },
    { href: "/ui-inventory", label: "UI Inventory", group: "inventory" },
    { href: "/parcel-goods", label: "Parcel Goods", group: "inventory" },

    // Orders
    { href: "/invoices", label: "Invoices", group: "orders" },
    { href: "/memos", label: "Memos", group: "orders" },

    // Reports
    { href: "/performance", label: "Performance Reports", group: "reports" },
  ],
  CUSTOMER: [
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function RoleBasedNavbar({ role, showLogoOnly = false, showNavigationOnly = false }: RoleBasedNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const items = navItems[role] || navItems.CUSTOMER;
  const rolePrefix = getRolePrefix(role);
  const { theme } = useTheme();

  // Helper to get the full path for a nav item
  const getFullPath = (href: string) => {
    if (href.startsWith("/dashboard")) return href;
    return `${rolePrefix}${href}`;
  };

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

  // Logo and Role Label Component
  const LogoSection = () => (
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="relative h-[72px] w-[72px]">
          <Image
            src={theme === "dark" ? "/logoNameInvertbg.png" : "/logoNamebg.png"}
            alt="Mother's Aura Logo"
            fill
            className="object-contain"
            sizes="72px"
            priority
          />
        </div>
      </Link>
    </div>
  );

  // Navigation Component
  const NavigationSection = () => (
    <div className="flex items-center space-x-1">
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <div
          key={group}
          className="relative"
          onMouseEnter={() => {
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            setActiveGroup(group);
          }}
          onMouseLeave={() => {
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = setTimeout(() => setActiveGroup(null), 150);
          }}
        >
          {groupItems.length === 1 ? (
            <Link
              href={getFullPath(groupItems[0].href)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === getFullPath(groupItems[0].href)
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
                  pathname.startsWith(`${rolePrefix}/${group}`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeGroup === group && (
              <div
                className="absolute top-full left-0 mt-1 w-56 bg-popover rounded-md shadow-md border"
                onMouseEnter={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                  setActiveGroup(group);
                }}
                onMouseLeave={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                  hoverTimerRef.current = setTimeout(() => setActiveGroup(null), 150);
                }}
              >
                <div className="py-1">
                  {groupItems.map((item) => (
                    <Link
                      key={item.href}
                      href={getFullPath(item.href)}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors",
                        pathname === getFullPath(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  // Mobile Menu Component
  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 rounded-md hover:bg-primary/5 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-3">
              <div className="relative h-[72px] w-[72px]">
                <Image
                  src={theme === "dark" ? "/logoNameInvertbg.png" : "/logoNamebg.png"}
                  alt="Mother's Aura Logo"
                  fill
                  className="object-contain"
                  sizes="72px"
                  unoptimized
                />
              </div>
              <span className="text-lg font-semibold">
                {role === "ADMIN"
                  ? "Admin Panel"
                  : role === "EMPLOYEE"
                  ? "Employee Panel"
                  : "Customer Panel"}
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>
        {/* Scrollable content area */}
        <div className="h-[calc(100vh-96px)] overflow-y-auto overscroll-contain px-4 pb-6">
          <div className="mt-8 flex flex-col space-y-2">
            {Object.entries(groupedItems)
              .filter(([group]) => group !== 'ungrouped')
              .map(([group, groupItems]) => (
              <div key={group} className="space-y-1">
                {group !== "ungrouped" && (
                  <button
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                    onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))}
                  >
                    <span>{group}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedGroups[group] ? 'rotate-180' : ''}`} />
                  </button>
                )}
                <div className={`${expandedGroups[group] ? 'block' : 'hidden'}`}>
                  {groupItems.map((item) => (
                    <Link
                      key={item.href}
                      href={getFullPath(item.href)}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-6 py-2 text-sm font-medium rounded-md transition-colors block",
                        pathname === getFullPath(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {groupedItems.ungrouped?.map((item) => (
              <Link
                key={item.href}
                href={getFullPath(item.href)}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors block",
                  pathname === getFullPath(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Render based on props
  if (showLogoOnly) {
    return (
      <nav className="bg-transparent">
        <LogoSection />
      </nav>
    );
  }

  if (showNavigationOnly) {
    return (
      <nav className="bg-transparent">
        <div className="hidden md:flex">
          <NavigationSection />
        </div>
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    );
  }

  // Default full navbar (for backward compatibility)
  return (
    <nav className="bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <LogoSection />
          <div className="hidden md:flex">
            <NavigationSection />
          </div>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}