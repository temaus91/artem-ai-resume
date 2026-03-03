import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminOverviewPage() {
  return (
    <AdminShell title="Overview">
      <p className="text-muted-foreground">Manage profile context used by chat and JD analyzer. Complete each section before publishing.</p>
    </AdminShell>
  );
}
