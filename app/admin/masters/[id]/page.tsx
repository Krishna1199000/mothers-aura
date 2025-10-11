"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, ArrowLeft } from "lucide-react";

interface Master {
  id: string;
  companyName: string;
  email: string;
  phoneNo: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  salesExecutive: {
    name: string;
  };
  updatedAt: string;
}

export default function MasterDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [master, setMaster] = useState<Master | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMaster = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/masters/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMaster(data);
      } else {
        setError("Failed to fetch master details");
      }
    } catch (error) {
      setError("Error loading master details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchMaster();
  }, [session, status, router, id, fetchMaster]);

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

  if (error || !master) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Master not found"}</AlertDescription>
          </Alert>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/masters')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Master Details</h1>
                <p className="text-muted-foreground">
                  View customer/vendor information
                </p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <CardTitle>Company Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Company Name</h4>
                  <p className="mt-1">{master.companyName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                  <p className="mt-1">{master.email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Phone Number</h4>
                  <p className="mt-1">{master.phoneNo}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Sales Executive</h4>
                  <p className="mt-1">{master.salesExecutive.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Address Line 1</h4>
                  <p className="mt-1">{master.addressLine1}</p>
                </div>
                {master.addressLine2 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Address Line 2</h4>
                    <p className="mt-1">{master.addressLine2}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">City</h4>
                  <p className="mt-1">{master.city}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">State</h4>
                  <p className="mt-1">{master.state}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Postal Code</h4>
                  <p className="mt-1">{master.postalCode}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Country</h4>
                  <p className="mt-1">{master.country}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
                  <p className="mt-1">{new Date(master.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

