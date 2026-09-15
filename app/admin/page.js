import './admin.css';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { isAdmin } from '@/lib/admin-validation.mjs';
import AdminDashboard from '@/components/admin-dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'Camp administration | Elevate Basketball',robots:{index:false,follow:false}};
export default async function AdminPage() {
  const {userId}=await auth();
  const configuredId=process.env.ADMIN_CLERK_USER_ID;
  const adminSetting=!configuredId ? 'Missing on this deployment' : !isAdmin(configuredId,configuredId) ? 'Invalid format — check for spaces, quotes or a backslash' : 'Present, but does not match your signed-in account';
  return <div className="admin-shell"><header className="admin-header"><Link href="/" className="brand"><span className="brand-mark">EB</span><span>ELEVATE<small>BASKETBALL</small></span></Link><div><Link href="/">View website</Link>{userId && <UserButton/>}</div></header>
    {!userId ? <main className="admin-access"><p className="section-kicker">CAMP ADMINISTRATION</p><h1>Sign in to manage camps.</h1><p>This area is only available to the Elevate Basketball administrator.</p><SignInButton mode="modal"><button className="button">Sign in</button></SignInButton></main>
      : !isAdmin(userId,process.env.ADMIN_CLERK_USER_ID) ? <main className="admin-access"><h1>Access restricted.</h1><p>This account does not have access to camp administration.</p><dl><dt>Your signed-in Clerk user ID</dt><dd style={{overflowWrap:'anywhere',margin:'8px 0 20px'}}><code>{userId}</code></dd><dt>Admin setting</dt><dd style={{margin:'8px 0 20px'}}>{adminSetting}</dd></dl><p>If you own this site, compare this user ID with ADMIN_CLERK_USER_ID in the environment used by this deployment. Use the Clerk account you intend to administer the site with.</p><Link className="button" href="/">Back to the website</Link></main>
      : <AdminDashboard/>}
  </div>;
}
