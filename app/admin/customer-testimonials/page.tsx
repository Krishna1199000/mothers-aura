"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Trash2, Edit2, X, Star } from 'lucide-react';

interface CustomerTestimonial {
  id: string;
  name: string;
  review: string;
  imageUrl: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerTestimonialsAdminPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<CustomerTestimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    review: '', 
    imageUrl: '', 
    rating: 5 
  });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/customer-testimonials');
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const resetForm = () => {
    setForm({ name: '', review: '', imageUrl: '', rating: 5 });
    setEditingId(null);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!form.name.trim() || !form.review.trim()) {
        setError('Name and Review are required');
        setLoading(false);
        return;
      }

      const url = editingId 
        ? `/api/admin/customer-testimonials/${editingId}`
        : '/api/admin/customer-testimonials';
      
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          review: form.review.trim(),
          imageUrl: form.imageUrl.trim() || undefined,
          rating: form.rating,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save testimonial');
        return;
      }

      resetForm();
      await load();
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: CustomerTestimonial) => {
    setForm({
      name: testimonial.name,
      review: testimonial.review,
      imageUrl: testimonial.imageUrl || '',
      rating: testimonial.rating,
    });
    setEditingId(testimonial.id);
    setError('');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const res = await fetch(`/api/admin/customer-testimonials/${id}`, { 
        method: 'DELETE' 
      });
      if (res.ok) {
        await load();
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('An error occurred while deleting');
    }
  };

  const canAddMore = list.length < 3;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Testimonial' : 'Add Customer Testimonial'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You can add up to 3 testimonials. Currently: {list.length}/3
          </p>
        </CardHeader>
        <CardContent>
          {!canAddMore && !editingId && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Maximum of 3 testimonials reached. Please edit or delete an existing one to add a new testimonial.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
                disabled={!canAddMore && !editingId}
                placeholder="e.g., Cameron Williamson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Review *</label>
              <Textarea 
                value={form.review} 
                onChange={(e) => setForm({ ...form, review: e.target.value })} 
                required 
                disabled={!canAddMore && !editingId}
                placeholder="Enter customer review/testimonial"
                rows={5}
                className="resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
              <Input 
                type="url"
                value={form.imageUrl} 
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} 
                disabled={!canAddMore && !editingId}
                placeholder="https://example.com/image.jpg"
              />
              {form.imageUrl && (
                <div className="mt-2 relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={form.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setForm({ ...form, imageUrl: '' })}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}
                  className="w-20 px-3 py-2 border rounded-lg"
                  disabled={!canAddMore && !editingId}
                />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= form.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading || (!canAddMore && !editingId)}
              >
                {editingId ? 'Update Testimonial' : 'Add Testimonial'}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="font-semibold mb-4 text-lg">Customer Testimonials ({list.length}/3)</h3>
        {list.length === 0 ? (
          <p className="text-muted-foreground">No testimonials added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {list.map((testimonial) => (
              <Card key={testimonial.id} className="relative">
                <CardContent className="p-4">
                  {testimonial.imageUrl && (
                    <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <h4 className="font-semibold mb-2">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                    {testimonial.review}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                      className="flex-1"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

