"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Eye, Edit, Trash } from "lucide-react";

interface Memo {
  id: string;
  memoNumber: string;
  master: {
    companyName: string;
  };
  date: string;
  dueDate: string;
  totalDue: number;
}

export default function MemosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchMemos();
  }, [session, status, router]);

  const fetchMemos = async () => {
    try {
      const response = await fetch('/api/admin/memos');
      if (response.ok) {
        const data = await response.json();
        setMemos(data);
      }
    } catch (error) {
      console.error("Error fetching memos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this memo?")) return;

    try {
      const response = await fetch(`/api/admin/memos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMemos(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Memos</h1>
              <p className="text-muted-foreground">
                Manage your memos and memorandums
              </p>
            </div>
            <Button onClick={() => router.push('/admin/memos/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Memo
            </Button>
          </div>

          {/* Memos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memos.map((memo) => (
              <Card key={memo.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{memo.memoNumber}</h3>
                      <p className="text-sm text-muted-foreground">{memo.master.companyName}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold">${memo.totalDue.toFixed(2)}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/memos/${memo.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/memos/${memo.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(memo.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(memo.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due:</span>
                      <span>{new Date(memo.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {memos.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No memos found</p>
                <Button onClick={() => router.push('/admin/memos/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first memo
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

