'use client';

import Link from 'next/link';

const links = [
  ['Overview', '/admin'],
  ['Profile', '/admin/profile'],
  ['Narrative', '/admin/narrative'],
  ['Experience', '/admin/experience'],
  ['Skills', '/admin/skills'],
  ['Gaps', '/admin/gaps'],
  ['Values', '/admin/values'],
  ['FAQ', '/admin/faq'],
  ['Instructions', '/admin/instructions'],
  ['Settings', '/admin/settings'],
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[230px,1fr] gap-6">
        <aside className="bg-card border border-border rounded-xl p-4 h-fit">
          <h2 className="font-serif text-xl mb-4">Admin</h2>
          <nav className="space-y-2">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="block text-sm text-muted-foreground hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="bg-card border border-border rounded-xl p-6">
          <h1 className="text-2xl font-serif mb-4">{title}</h1>
          {children}
        </section>
      </div>
    </main>
  );
}
