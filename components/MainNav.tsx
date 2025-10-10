import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type UserRole = "ADMIN" | "EMPLOYEE" | "CUSTOMER";

type NavItem = { href: string; label: string };

interface MainNavProps {
  userRole?: UserRole;
}

export function MainNav({ userRole }: MainNavProps) {
  const pathname = usePathname();

  // Base navigation items (available to all authenticated users)
  const baseNavItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  // Role-specific navigation items
  const roleNavItems: Record<UserRole, NavItem[]> = {
    ADMIN: [
      { href: "/admin/manage-users", label: "Manage Users" },
      { href: "/admin/masters", label: "Masters" },
      { href: "/admin/invoices", label: "Invoices" },
      { href: "/admin/memos", label: "Memos" },
      { href: "/admin/parcel-goods", label: "Parcel Goods" },
    ],
    EMPLOYEE: [
      { href: "/admin/masters", label: "Masters" },
      { href: "/admin/invoices", label: "Invoices" },
      { href: "/admin/memos", label: "Memos" },
      { href: "/admin/parcel-goods", label: "Parcel Goods" },
    ],
    CUSTOMER: [],
  };

  // Combine base items with role-specific items
  const navItems: NavItem[] = [
    ...baseNavItems,
    ...(userRole ? roleNavItems[userRole] : []),
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  );
}





