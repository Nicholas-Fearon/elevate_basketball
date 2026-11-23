import '@/app/admin/admin.css';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { isAdmin } from '@/lib/admin-validation.mjs';
export default async function AdminShell({ children }) {
  const {userId}=await auth();
  return <div className="admin-shell"><header className="admin-header"><Link href="/" className="brand"><span className="brand-mark">EB</span><span>ELEVATE<small>BASKETBALL</small></span></Link><div><Link href="/">View website</Link>{userId && <UserButton/>}</div></header>
    {!userId ? <main className="admin-access"><p className="section-kicker">CAMP ADMINISTRATION</p><h1>Sign in to manage camps.</h1><p>This area is only available to the Elevate Basketball administrator.</p><SignInButton mode="modal"><button className="button">Sign in</button></SignInButton></main>
      : !isAdmin(userId,process.env.ADMIN_CLERK_USER_ID) ? <main className="admin-access"><h1>Access restricted.</h1><p>This account does not have access to camp administration.</p><p>Please sign in with your administrator account.</p><Link className="button" href="/">Back to the website</Link></main>
      : <><nav className="admin-navigation" aria-label="Administration"><Link href="/admin/">Camps & bookings</Link><Link href="/admin/notebook/">Coaching notebook</Link></nav>{children}</>}
  </div>;
}
