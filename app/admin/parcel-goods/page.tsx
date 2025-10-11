"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParcelGood {
  id: string;
  sieveSize: number;
  price: number;
}

export default function ParcelGoodsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [parcelGoods, setParcelGoods] = useState<ParcelGood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  // Generate sieve sizes from 0.8 to 7.5 with proper increments
  const generateSieveSizes = () => {
    const sizes: number[] = [];
    for (let i = 0.8; i <= 7.5; i += 0.1) {
      sizes.push(Number(i.toFixed(1)));
    }
    return sizes;
  };

  const sieveSizes = generateSieveSizes();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchParcelGoods();
  }, [session, status, router]);

  const fetchParcelGoods = async () => {
    try {
      const response = await fetch("/api/admin/parcel-goods");
      if (response.ok) {
        const data = await response.json();
        setParcelGoods(data);
      } else {
        setError("Failed to fetch parcel goods");
      }
    } catch (error) {
      setError("Error loading parcel goods");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrice = async () => {
    try {
      const response = await fetch("/api/admin/parcel-goods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sieveSize: selectedSize,
          price: price,
        }),
      });

      if (response.ok) {
        setSelectedSize("");
        setPrice("");
        fetchParcelGoods();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add price");
      }
    } catch (error) {
      setError("Error adding price");
    }
  };

  const handleEdit = async (id: string) => {
    if (editingId === id) {
      try {
        const response = await fetch(`/api/admin/parcel-goods/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: editPrice,
          }),
        });

        if (response.ok) {
          setEditingId(null);
          setEditPrice("");
          fetchParcelGoods();
        } else {
          const data = await response.json();
          setError(data.error || "Failed to update price");
        }
      } catch (error) {
        setError("Error updating price");
      }
    } else {
      const parcelGood = parcelGoods.find((pg) => pg.id === id);
      if (parcelGood) {
        setEditingId(id);
        setEditPrice(parcelGood.price.toString());
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this price?")) return;

    try {
      const response = await fetch(`/api/admin/parcel-goods/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchParcelGoods();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete price");
      }
    } catch (error) {
      setError("Error deleting price");
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
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Parcel Goods Management</h1>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Add New Price */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Sieve Size (mm)
                    </label>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sieveSizes.map((size) => (
                          <SelectItem
                            key={size}
                            value={size.toString()}
                            disabled={parcelGoods.some(
                              (pg) => pg.sieveSize === size
                            )}
                          >
                            {size} mm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price ($)
                    </label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    onClick={handleAddPrice}
                    disabled={!selectedSize || !price}
                    className="w-full"
                  >
                    Add Price
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price List */}
            <Card>
              <CardHeader>
                <CardTitle>Price List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SIEVE SIZE (MM)</TableHead>
                        <TableHead>PRICE</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcelGoods.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.sieveSize} mm</TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-24"
                              />
                            ) : (
                              `$${item.price.toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
