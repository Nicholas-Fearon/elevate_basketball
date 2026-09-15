import { clerkMiddleware } from '@clerk/nextjs/server';

// Next.js 16 calls middleware "Proxy". This establishes Clerk's server auth
// context without requiring sign-in to browse the home page or camp details.
// Supabase RLS and book_camp still enforce ownership and authentication.
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
