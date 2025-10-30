"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Search, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  certificateNo?: string;
  lab?: string;
  stock: number;
  images: string[];
  videoUrl?: string;
  certificateUrl?: string;
  threeSixtyView?: string;
  additionalMedia?: string[];
  priceUSD?: number;
  priceINR?: number;
  priceEUR?: number;
  priceAUD?: number;
}

export default function UIInventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceUSD: "",
    priceINR: "",
    priceEUR: "",
    priceAUD: "",
    shape: "",
    carat: "",
    color: "",
    clarity: "",
    cut: "",
    polish: "",
    symmetry: "",
    certificateNo: "",
    lab: "",
    stock: "",
    images: [] as string[],
  });

  const [mediaInputs, setMediaInputs] = useState(["", "", "", "", ""]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setFormData({
      name: "",
      description: "",
      priceUSD: "",
      priceINR: "",
      priceEUR: "",
      priceAUD: "",
      shape: "",
      carat: "",
      color: "",
      clarity: "",
      cut: "",
      polish: "",
      symmetry: "",
      certificateNo: "",
      lab: "",
      stock: "",
      images: [],
    });
    setMediaInputs(["", "", "", "", ""]);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      priceUSD: product.priceUSD?.toString() || "",
      priceINR: product.priceINR?.toString() || "",
      priceEUR: product.priceEUR?.toString() || "",
      priceAUD: product.priceAUD?.toString() || "",
      shape: product.shape,
      carat: product.carat.toString(),
      color: product.color,
      clarity: product.clarity,
      cut: product.cut || "",
      polish: product.polish || "",
      symmetry: product.symmetry || "",
      certificateNo: product.certificateNo || "",
      lab: product.lab || "",
      stock: product.stock.toString(),
      images: product.images,
    });
    
    // Set media inputs (combining all media sources)
    const allMedia = [
      ...product.images,
      product.videoUrl,
      product.certificateUrl,
      product.threeSixtyView,
      ...(product.additionalMedia || []),
    ].filter(Boolean) as string[];
    
    const medInputs = [...allMedia];
    while (medInputs.length < 5) medInputs.push("");
    setMediaInputs(medInputs.slice(0, 5));
    
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.priceUSD || !formData.priceINR || !formData.priceEUR || !formData.priceAUD) {
      toast({ title: "Error", description: "All currency fields are required", variant: "destructive" });
      return;
    }
    try {
      const media = mediaInputs.filter((url) => url.trim() !== "");
      const images = media; // All media will be treated as images
      
      const data = {
        ...formData,
        priceUSD: parseFloat(formData.priceUSD),
        priceINR: parseFloat(formData.priceINR),
        priceEUR: parseFloat(formData.priceEUR),
        priceAUD: parseFloat(formData.priceAUD),
        carat: parseFloat(formData.carat),
        stock: parseInt(formData.stock),
        images,
      };

      const url = modalMode === "create" 
        ? "/api/admin/products" 
        : `/api/admin/products/${selectedProduct?.id}`;
      
      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast({
        title: "Success",
        description: `Product ${modalMode === "create" ? "created" : "updated"} successfully`,
      });

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold">UI Inventory</h1>
          <p className="text-muted-foreground">
            Manage your products
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button className="w-full sm:w-auto" onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
              <TableHead>Shape</TableHead>
              <TableHead>Carat</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Clarity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
            {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.shape}</TableCell>
                <TableCell>{product.carat}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>{product.clarity}</TableCell>
                    <TableCell>${product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                      onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

      {/* Product Form Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
              {modalMode === "create" ? "Add New Product" : "Edit Product"}
                </DialogTitle>
              </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label>Diamond Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., New Beginnings Diamond Band"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <Label htmlFor="priceUSD">Price (USD)</Label>
                <Input type="number" id="priceUSD" value={formData.priceUSD} min="0"
                  onChange={e => setFormData({ ...formData, priceUSD: e.target.value })}
                  placeholder="0.00" required />
              </div>
              <div>
                <Label htmlFor="priceINR">Price (INR)</Label>
                <Input type="number" id="priceINR" value={formData.priceINR} min="0"
                  onChange={e => setFormData({ ...formData, priceINR: e.target.value })}
                  placeholder="0.00" required />
              </div>
              <div>
                <Label htmlFor="priceEUR">Price (EUR)</Label>
                <Input type="number" id="priceEUR" value={formData.priceEUR} min="0"
                  onChange={e => setFormData({ ...formData, priceEUR: e.target.value })}
                  placeholder="0.00" required />
              </div>
              <div>
                <Label htmlFor="priceAUD">Price (AUD)</Label>
                <Input type="number" id="priceAUD" value={formData.priceAUD} min="0"
                  onChange={e => setFormData({ ...formData, priceAUD: e.target.value })}
                  placeholder="0.00" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Shape *</Label>
                <Input
                  value={formData.shape}
                  onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                  placeholder="Round"
                />
              </div>
              <div>
                <Label>Carat *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.carat}
                  onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                  placeholder="1.50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Color *</Label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="F"
                />
              </div>
              <div>
                <Label>Clarity *</Label>
                <Input
                  value={formData.clarity}
                  onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                  placeholder="VS1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Cut</Label>
                <Input
                  value={formData.cut}
                  onChange={(e) => setFormData({ ...formData, cut: e.target.value })}
                  placeholder="Excellent"
                />
              </div>
              <div>
                <Label>Polish</Label>
                <Input
                  value={formData.polish}
                  onChange={(e) => setFormData({ ...formData, polish: e.target.value })}
                  placeholder="Excellent"
                />
              </div>
              <div>
                <Label>Symmetry</Label>
                <Input
                  value={formData.symmetry}
                  onChange={(e) => setFormData({ ...formData, symmetry: e.target.value })}
                  placeholder="Excellent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Certificate No</Label>
                <Input
                  value={formData.certificateNo}
                  onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                  placeholder="12345"
                />
              </div>
              <div>
                <Label>Lab</Label>
                <Input
                  value={formData.lab}
                  onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                  placeholder="GIA"
                />
              </div>
            </div>

            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Media Links (up to 5) *</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add image or video URLs (supports .jpg, .png, .gif, .mp4, .webm, etc.)
              </p>
              {mediaInputs.map((url, index) => (
                <Input
                  key={index}
                  value={url}
                  onChange={(e) => {
                    const newInputs = [...mediaInputs];
                    newInputs[index] = e.target.value;
                    setMediaInputs(newInputs);
                  }}
                  placeholder={`https://example.com/media-${index + 1}.jpg`}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>
                {modalMode === "create" ? "Create Product" : "Update Product"}
              </Button>
            </div>
          </div>
            </DialogContent>
          </Dialog>
    </div>
  );
}
