"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingScreen } from "@/components/ui/loading-screen";

function LoadingProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading screen on route changes
    setIsLoading(true);
    
    // Hide loading screen after a short delay to ensure smooth transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <>
      <LoadingScreen show={isLoading} />
      {children}
    </>
  );
}

export function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
}
