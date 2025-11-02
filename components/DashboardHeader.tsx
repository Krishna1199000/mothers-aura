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
      {/* Mobile header: 3 columns -> [menu] [logo centered] [actions] */}
      <div className="container grid grid-cols-3 h-16 items-center px-4 md:px-6 md:hidden">
        <div className="flex items-center">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} showNavigationOnly />
        </div>
        <div className="flex justify-center items-center">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} showLogoOnly />
        </div>
        <div className="flex justify-end items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>

      {/* Desktop header */}
      <div className="w-full max-w-7xl mx-auto hidden md:flex h-20 items-center px-4 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-1 justify-start min-w-0">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} showLogoOnly />
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center justify-center flex-1 min-w-0">
          <RoleBasedNavbar role={userRole as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} showNavigationOnly />
        </div>

        {/* Right: Personal items */}
        <div className="flex items-center gap-2 justify-end flex-1 min-w-0">
          <div className="hidden md:flex items-center gap-2">
            <NotificationBar />
            <CartButton />
          </div>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}



