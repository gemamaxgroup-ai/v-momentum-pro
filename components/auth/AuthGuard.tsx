"use client";

import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side auth guard component
 * Redirects to /login if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useLayoutEffect(() => {
    // Check authentication status synchronously before render
    const authenticated = isAuthenticated();
    
    if (!authenticated) {
      router.push("/login");
      return;
    }
    
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setShouldRender(true);
    }, 0);
  }, [router]);

  // Show nothing while checking or if not authenticated (prevents flash of content)
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}

