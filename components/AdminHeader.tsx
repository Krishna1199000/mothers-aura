"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "@/components/UserNav";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import { useTheme } from "next-themes";

export function AdminHeader() {
  const { data: session } = useSession();
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Hide logo after sign-in */}
        {!session?.user ? (
          <Link href="/" className="mr-6">
            <Image
              src={theme === "dark" ? "/logoNameInvertbg.png" : "/logoNamebg.png"}
              alt="Mother's Aura Logo"
              className="h-10 w-10 object-contain"
              unoptimized
            />
          </Link>
        ) : (
          <div className="mr-6" />
        )}
        <MainNav userRole={session?.user?.role as "ADMIN" | "EMPLOYEE" | "CUSTOMER"} />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
          </div>
        </div>
      </header>
  );
}