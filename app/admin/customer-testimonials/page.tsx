"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";
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

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    const load = async () => {
      try {
        const res = await fetch("/api/customer-testimonials");
        if (res.ok) setList(await res.json());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Loading testimonials...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Testimonials
          </CardTitle>
          <CardDescription>
            Reviews shown on the site. Add or edit testimonials via your database or a future admin form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No testimonials yet.</p>
          ) : (
            <ul className="space-y-6">
              {list.map((t) => (
                <li key={t.id} className="border rounded-lg p-4 space-y-2">
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
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pl-14">{t.review}</p>
                  <p className="text-xs text-muted-foreground pl-14">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
