"use client";
import { ClerkProvider } from "@clerk/clerk-react";
export const authConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
export default function Providers({ children }) {
  return authConfigured ? (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  ) : (
    children
  );
}
