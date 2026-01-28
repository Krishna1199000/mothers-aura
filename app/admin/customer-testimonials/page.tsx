"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Star, Trash2, Edit3, Plus } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  review: string;
  imageUrl: string | null;
  rating: number;
  createdAt: string;
}

export default function CustomerTestimonialsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formReview, setFormReview] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formRating, setFormRating] = useState(5);

  const loadTestimonials = async () => {
    try {
      const res = await fetch("/api/customer-testimonials");
      if (res.ok) setList(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const role = (session.user as any)?.role;
    if (role !== "ADMIN") {
      router.push("/");
      return;
    }

    loadTestimonials();
  }, [session, status, router]);

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormReview("");
    setFormImageUrl("");
    setFormRating(5);
  };

  const startCreate = () => {
    resetForm();
    setEditingId("new");
  };

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormName(t.name);
    setFormReview(t.review);
    setFormImageUrl(t.imageUrl ?? "");
    setFormRating(t.rating);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formReview.trim()) return;

    try {
      setSaving(true);
      const payload = {
        name: formName.trim(),
        review: formReview.trim(),
        imageUrl: formImageUrl.trim() || null,
        rating: formRating,
      };

      if (editingId === "new") {
        await fetch("/api/admin/customer-testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (editingId) {
        await fetch(`/api/admin/customer-testimonials/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await loadTestimonials();
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      setSaving(true);
      await fetch(`/api/admin/customer-testimonials/${id}`, {
        method: "DELETE",
      });
      await loadTestimonials();
      if (editingId === id) resetForm();
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Loading testimonials...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Testimonials
            </CardTitle>
            <CardDescription>
              These reviews appear on the public landing page. Only admins can create, edit, or delete them.
            </CardDescription>
          </div>
          <Button size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Add Testimonial
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {editingId && (
            <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <h3 className="font-semibold text-sm">
                {editingId === "new" ? "Create Testimonial" : "Edit Testimonial"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Name</label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Rating (1-5)</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Review</label>
                <Textarea
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  placeholder="What did the customer say?"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Image URL (optional)</label>
                <Input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}

          {list.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No testimonials yet.</p>
          ) : (
            <ul className="space-y-6">
              {list.map((t) => (
                <li key={t.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {t.imageUrl ? (
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                          <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
                          {t.name.slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < t.rating ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(t)}
                        disabled={saving}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(t.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-14">{t.review}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
