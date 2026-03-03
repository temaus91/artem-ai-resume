'use client';

import { AdminShell } from '@/components/admin/AdminShell';

export default function Page() {
  return (
    <AdminShell title="Profile">
      <p className="text-sm text-muted-foreground mb-4">This section stores profile data for AI context assembly.</p>
      <textarea className="w-full min-h-52 bg-secondary rounded-lg p-3" placeholder="Enter profile details here..." />
      <button className="mt-4 bg-accent text-accent-foreground rounded-lg px-4 py-2">Save</button>
    </AdminShell>
  );
}
