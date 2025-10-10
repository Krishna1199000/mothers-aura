"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleBasedHeader } from "@/components/RoleBasedHeader";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Eye, Edit, Trash } from "lucide-react";

interface Master {
  id: string;
  companyName: string;
  email: string;
  phoneNo: string;
  salesExecutive: {
    name: string;
  };
  updatedAt: string;
}

export default function MastersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchMasters();
  }, [session, status, router]);

  const fetchMasters = async () => {
    try {
      const response = await fetch('/api/admin/masters');
      if (response.ok) {
        const data = await response.json();
        setMasters(data);
      }
    } catch (error) {
      console.error("Error fetching masters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this master?")) return;

    try {
      const response = await fetch(`/api/admin/masters/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMasters(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting master:", error);
    }
  };

  const filteredMasters = masters.filter(master => 
    master.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    master.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    master.phoneNo.includes(searchQuery)
  );

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
      <RoleBasedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Masters</h1>
              <p className="text-muted-foreground">
                Manage customer and vendor masters
              </p>
            </div>
            <Button onClick={() => router.push('/admin/masters/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Master
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search masters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Masters Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr No</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Salesman</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMasters.map((master, index) => (
                    <TableRow key={master.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{master.companyName}</TableCell>
                      <TableCell>{master.email}</TableCell>
                      <TableCell>{master.phoneNo}</TableCell>
                      <TableCell>{master.salesExecutive.name}</TableCell>
                      <TableCell>
                        {new Date(master.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/masters/${master.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/masters/${master.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(master.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMasters.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No masters found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

