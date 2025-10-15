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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { CategoryForm } from "./components/category-form";
import { SubcategoryForm } from "./components/subcategory-form";
import { ProductForm } from "./components/product-form";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  category: { name: string };
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  carat?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  stock: number;
  images: string[];
  categoryId: string;
  subcategoryId?: string;
  category: { name: string };
  subcategory?: { name: string };
  createdAt: string;
}

export default function UIInventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("categories");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/subcategories"),
        fetch("/api/admin/products"),
      ]);

      if (!categoriesRes.ok) {
        const error = await categoriesRes.text();
        console.error("Categories API Error:", error);
        throw new Error(`Categories API Error: ${error}`);
      }

      if (!subcategoriesRes.ok) {
        const error = await subcategoriesRes.text();
        console.error("Subcategories API Error:", error);
        throw new Error(`Subcategories API Error: ${error}`);
      }

      if (!productsRes.ok) {
        const error = await productsRes.text();
        console.error("Products API Error:", error);
        throw new Error(`Products API Error: ${error}`);
      }

      const [categoriesData, subcategoriesData, productsData] = await Promise.all([
        categoriesRes.json(),
        subcategoriesRes.json(),
        productsRes.json(),
      ]);

      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: "Error",
        description: `Failed to fetch data: ${message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const filteredData = {
    categories: categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    subcategories: subcategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    products: products.filter((prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">UI Inventory</h1>
          <p className="text-muted-foreground">
            Manage your categories, subcategories, and products
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              onClick={() => {
                setModalMode("create");
                setSelectedItem(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        <TabsContent value="categories" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setModalMode("edit");
                            setSelectedItem(category);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete("categories", category.id)}
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
        </TabsContent>

        <TabsContent value="subcategories" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.subcategories.map((subcategory) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>{subcategory.name}</TableCell>
                    <TableCell>{subcategory.category.name}</TableCell>
                    <TableCell>
                      {new Date(subcategory.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setModalMode("edit");
                            setSelectedItem(subcategory);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            handleDelete("subcategories", subcategory.id)
                          }
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
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.subcategory?.name || "-"}</TableCell>
                    <TableCell>${product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setModalMode("edit");
                            setSelectedItem(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete("products", product.id)}
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
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {modalMode === "create" ? "Create" : "Edit"}{" "}
                  {activeTab.slice(0, -1)}
                </DialogTitle>
              </DialogHeader>
              {activeTab === "categories" && (
                <CategoryForm
                  initialData={selectedItem}
                  onSuccess={() => {
                    setIsModalOpen(false);
                    fetchData();
                  }}
                  onCancel={() => setIsModalOpen(false)}
                />
              )}
              {activeTab === "subcategories" && (
                <SubcategoryForm
                  categories={categories}
                  initialData={selectedItem}
                  onSuccess={() => {
                    setIsModalOpen(false);
                    fetchData();
                  }}
                  onCancel={() => setIsModalOpen(false)}
                />
              )}
              {activeTab === "products" && (
                <ProductForm
                  categories={categories}
                  subcategories={subcategories}
                  initialData={selectedItem}
                  onSuccess={() => {
                    setIsModalOpen(false);
                    fetchData();
                  }}
                  onCancel={() => setIsModalOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
