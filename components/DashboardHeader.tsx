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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-20 items-center px-4">
        {/* Left side - Logo and Role Label */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} showLogoOnly />
        </div>

        {/* Center - Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1 px-8">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} showNavigationOnly />
        </div>

        {/* Right side - Personal items */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <NotificationBar />
          <CartButton />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}



