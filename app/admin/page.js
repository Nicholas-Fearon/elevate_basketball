import AdminShell from '@/components/admin-shell';
import AdminDashboard from '@/components/admin-dashboard';
export const dynamic = 'force-dynamic';
export const metadata = {title: 'Camp administration | Elevate Basketball', robots: {index: false, follow: false}};
export default function AdminPage() {
  return <AdminShell><AdminDashboard /></AdminShell>;
}
