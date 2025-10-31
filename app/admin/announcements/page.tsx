"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Announcement {
  id: string;
  text: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AnnouncementsAdminPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ text: '', buttonText: '', buttonUrl: '', isActive: true });

  const load = async () => {
    const res = await fetch('/api/admin/announcements');
    if (res.ok) setList(await res.json());
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: form.text.trim(),
          buttonText: form.buttonText.trim() || undefined,
          buttonUrl: form.buttonUrl.trim() || undefined,
          isActive: form.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setForm({ text: '', buttonText: '', buttonUrl: '', isActive: true });
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Text</label>
              <Input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Button Text (optional)</label>
                <Input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Button URL (optional)</label>
                <Input value={form.buttonUrl} onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="active" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <label htmlFor="active" className="text-sm">Active</label>
            </div>
            <Button type="submit" disabled={loading}>Save</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Recent Announcements</h3>
        <ul className="space-y-2">
          {list.map((a) => (
            <li key={a.id} className="p-3 border rounded flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{a.text}</div>
                {a.buttonText && <div className="text-xs text-muted-foreground truncate">{a.buttonText} — {a.buttonUrl}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    const text = prompt('Edit announcement text', a.text) || a.text;
                    const buttonText = prompt('Edit button text (optional)', a.buttonText || '') || '';
                    const buttonUrl = prompt('Edit button URL (optional)', a.buttonUrl || '') || '';
                    await fetch(`/api/admin/announcements/${a.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ text, buttonText: buttonText || undefined, buttonUrl: buttonUrl || undefined }),
                    });
                    await load();
                  }}
                >Edit</Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!confirm('Delete this announcement?')) return;
                    await fetch(`/api/admin/announcements/${a.id}`, { method: 'DELETE' });
                    await load();
                  }}
                >Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


