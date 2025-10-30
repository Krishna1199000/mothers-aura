"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MoreVertical, Eye, Edit, Trash, Printer, Search } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  master: {
    companyName: string;
  };
  date: string;
  dueDate: string;
  totalDue: number;
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchInvoices();
  }, [session, status, router]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
        setFilteredInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter invoices based on search term
  useEffect(() => {
    const filtered = invoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.master.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const response = await fetch(`/api/admin/invoices/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInvoices(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
              <h1 className="text-3xl font-bold">Invoices</h1>
              <p className="text-muted-foreground">
                Manage your invoices and billing
              </p>
            </div>
          <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => router.push('/admin/invoices/from-inventory')}>
                <Plus className="w-4 h-4 mr-2" />
                From Inventory
              </Button>
            <Button className="w-full sm:w-auto" onClick={() => router.push('/admin/invoices/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Invoice
              </Button>
            </div>
          </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
          <div className="relative flex-1 max-w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
              />
            </div>
          <div className="text-sm text-muted-foreground md:text-right">
              {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>

          {/* Invoices Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.master.companyName}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ${invoice.totalDue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/invoices/${invoice.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInvoices.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                          {searchTerm ? "No invoices found matching your search" : "No invoices found"}
                        </p>
                        <Button onClick={() => router.push('/admin/invoices/create')}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create your first invoice
                        </Button>
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

