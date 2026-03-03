'use client';

import { AdminShell } from '@/components/admin/AdminShell';

export default function Page() {
  return (
    <AdminShell title="Instructions">
      <p className="text-sm text-muted-foreground mb-4">This section stores instructions data for AI context assembly.</p>
      <textarea className="w-full min-h-52 bg-secondary rounded-lg p-3" placeholder="Enter instructions details here..." />
      <button className="mt-4 bg-accent text-accent-foreground rounded-lg px-4 py-2">Save</button>
    </AdminShell>
  );
}
