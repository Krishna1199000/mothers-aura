"use client";

import { useSession } from "next-auth/react";
import { RoleBasedNavbar } from "./RoleBasedNavbar";
import { UserNav } from "./UserNav";
import { ModeToggle } from "./ModeToggle";
import { NotificationBar } from "./NotificationBar";
import CartButton from "./cart/CartButton";

export function DashboardHeader() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as "ADMIN" | "EMPLOYEE" | "CUSTOMER") || "CUSTOMER";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Role-based navigation */}
        <div className="flex-1">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} />
        </div>

        {/* Right side - Theme toggle and user menu */}
        <div className="flex items-center gap-2">
          <NotificationBar />
          <CartButton />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}



