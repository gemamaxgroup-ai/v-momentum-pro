/**
 * Demo authentication utility
 * Auth mechanism: localStorage key "vmomentum_demo_user" stores user email
 * Session: Client-side only, no server-side session store
 */

/**
 * Check if user is authenticated (client-side only)
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const user = localStorage.getItem("vmomentum_demo_user");
  return !!user;
}

/**
 * Get current authenticated user email (client-side only)
 */
export function getCurrentUser(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("vmomentum_demo_user");
}

/**
 * Clear authentication (client-side only)
 */
export function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vmomentum_demo_user");
  }
}

