import { NextResponse } from "next/server";

/**
 * Logout API route
 * Clears authentication and redirects to login
 * Idempotent: safe to call multiple times
 */
export async function POST() {
  // In a real implementation, this would clear server-side sessions/cookies
  // For demo auth using localStorage, the client will handle clearing
  return NextResponse.json({ success: true, message: "Logged out" });
}

