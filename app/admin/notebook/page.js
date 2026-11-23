import AdminShell from '@/components/admin-shell';
import CoachingNotebook from '@/components/coaching-notebook';
export const dynamic = 'force-dynamic';
export const metadata = {title: 'Private coaching notebook | Elevate Basketball', robots: {index: false, follow: false}};
export default function NotebookPage() {
  return <AdminShell><CoachingNotebook /></AdminShell>;
}
