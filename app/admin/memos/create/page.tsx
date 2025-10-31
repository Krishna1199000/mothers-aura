"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, FileText, Trash2, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";

interface Master {
  id: string;
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface DiamondItem {
  description: string;
  carat: string;
  color: string;
  clarity: string;
  lab: string;
  reportNo: string;
  pricePerCarat: string;
  total: string;
}

export default function CreateMemoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    memoNumber: "",
    date: new Date(),
    dueDate: new Date(),
    paymentTerms: "7",
    emailPdf: false,
    masterId: "",
    description: "",
    shipmentCost: "0",
    discount: "0",
    crPayment: "0",
  });

  const [items, setItems] = useState<DiamondItem[]>([
    {
      description: "",
      carat: "0.01",
      color: "",
      clarity: "",
      lab: "",
      reportNo: "",
      pricePerCarat: "0.01",
      total: "0.00",
    },
  ]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchMasters();
    generateMemoNumber();
    // Prefill items from sessionStorage if present
    try {
      const raw = sessionStorage.getItem("prefillMemoItems");
      if (raw) {
        const parsed = JSON.parse(raw) as DiamondItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed.map(it => ({
            description: it.description || "",
            carat: String(it.carat ?? "0"),
            color: it.color || "",
            clarity: it.clarity || "",
            lab: it.lab || "",
            reportNo: it.reportNo || "",
            pricePerCarat: String(it.pricePerCarat ?? "0"),
            total: String(it.total ?? "0"),
          })));
        }
        sessionStorage.removeItem("prefillMemoItems");
      }
    } catch {}
  }, [session, status, router]);

  // Auto-calculate due date based on payment terms
  useEffect(() => {
    if (formData.date && formData.paymentTerms) {
      const days = parseInt(formData.paymentTerms) || 0;
      const dueDate = new Date(formData.date);
      dueDate.setDate(dueDate.getDate() + days);
      setFormData(prev => ({ ...prev, dueDate }));
    }
  }, [formData.date, formData.paymentTerms]);

  const fetchMasters = async () => {
    try {
      const response = await fetch('/api/admin/masters');
      if (response.ok) {
        const data = await response.json();
        setMasters(data);
      }
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  };

  const generateMemoNumber = async () => {
    try {
      const response = await fetch('/api/admin/memos/generate-number');
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, memoNumber: data.memoNumber }));
      }
    } catch (error) {
      console.error("Error generating memo number:", error);
    }
  };

  const handleMasterChange = (masterId: string) => {
    const master = masters.find(m => m.id === masterId);
    setSelectedMaster(master || null);
    setFormData(prev => ({ ...prev, masterId }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total for this item
    if (field === 'carat' || field === 'pricePerCarat') {
      const carat = parseFloat(newItems[index].carat) || 0;
      const pricePerCarat = parseFloat(newItems[index].pricePerCarat) || 0;
      newItems[index].total = (carat * pricePerCarat).toFixed(2);
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      description: "",
      carat: "0.01",
      color: "",
      clarity: "",
      lab: "",
      reportNo: "",
      pricePerCarat: "0.01",
      total: "0.00",
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipment = parseFloat(formData.shipmentCost) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const crPayment = parseFloat(formData.crPayment) || 0;
    return subtotal + shipment - discount - crPayment;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const totalDue = calculateTotal();

      const response = await fetch('/api/admin/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            ...item,
            carat: parseFloat(item.carat),
            pricePerCarat: parseFloat(item.pricePerCarat),
            total: parseFloat(item.total),
          })),
          paymentTerms: parseInt(formData.paymentTerms),
          shipmentCost: parseFloat(formData.shipmentCost),
          discount: parseFloat(formData.discount),
          crPayment: parseFloat(formData.crPayment),
          subtotal,
          totalDue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create memo");
      }

      toast.success("Memo Created", {
        description: formData.emailPdf ? "Memo created and email sent successfully" : "Memo created successfully",
      });

      router.push('/admin/memos');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      setError(errorMessage);
      toast.error("Failed to Create Memo", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Create New Memo</h1>
            <p className="text-muted-foreground">
              Generate a new memo for diamond sales
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Memo Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <CardTitle>Memo Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memoNumber">Memo Number</Label>
                    <Input
                      id="memoNumber"
                      value={formData.memoNumber}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
                    <Input
                      id="paymentTerms"
                      type="number"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, dueDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailPdf"
                      checked={formData.emailPdf}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailPdf: checked }))}
                    />
                    <Label htmlFor="emailPdf">Email PDF</Label>
                    <span className="text-sm text-muted-foreground">
                      {formData.emailPdf ? "PDF will be emailed to customer" : "PDF will not be emailed"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="master">Company (Select from Shipments)</Label>
                  <Select
                    value={formData.masterId}
                    onValueChange={handleMasterChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {masters.map((master) => (
                        <SelectItem key={master.id} value={master.id}>
                          {master.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Diamond Items */}
            <Card>
              <CardHeader>
                <CardTitle>Diamond Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item #{index + 1}</h4>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Carat</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.carat}
                          onChange={(e) => handleItemChange(index, "carat", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price ct (USD)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.pricePerCarat}
                          onChange={(e) => handleItemChange(index, "pricePerCarat", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={item.total}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Due:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/memos')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Memo"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

