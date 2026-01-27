"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Filter, Heart } from "lucide-react";
import Image from "next/image";

interface SettingStepProps {
    onNext: () => void;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    priceUSD: number;
    shape: string;
    carat: number;
    color: string;
    clarity: string;
    images: string[];
    categoryId?: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export function SettingStep({ onNext }: SettingStepProps) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [quickShip, setQuickShip] = useState(false);

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories
                const catRes = await fetch('/api/categories');
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }

                // Fetch products (settings/rings)
                const prodRes = await fetch('/api/products');
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = !searchQuery || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <h2 className="text-2xl font-serif">Engagement Rings & Settings</h2>

            {/* Category Grid */}
            {categories.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((cat) => (
                        <div 
                            key={cat.id} 
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden aspect-square bg-[#1B2A4A] transition-all ${
                                selectedCategory === cat.id ? 'ring-2 ring-[#4169E1] ring-offset-2' : ''
                            }`}
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <span className="text-white text-sm font-medium">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:border-gray-600"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            id="quick-ship" 
                            checked={quickShip}
                            onCheckedChange={(checked) => setQuickShip(checked as boolean)}
                        />
                        <label htmlFor="quick-ship" className="text-sm cursor-pointer whitespace-nowrap">Quick ship 🚚</label>
                    </div>

                    {selectedCategory && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedCategory(null)}
                            className="text-sm"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProducts.length} results</span>
                {selectedCategory && (
                    <>
                        <span className="mx-2">•</span>
                        <span>in {categories.find(c => c.id === selectedCategory)?.name}</span>
                    </>
                )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <p className="text-muted-foreground mb-4">No settings found</p>
                    <Button variant="outline" onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery("");
                    }}>
                        Clear filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="group bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer" 
                            onClick={onNext}
                        >
                            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                <button className="absolute top-2 right-2 p-2 rounded-full bg-white/50 hover:bg-white text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                                <div className="text-xs text-muted-foreground">
                                    {product.carat} ct • {product.color} • {product.clarity}
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-[#1B2A4A] dark:text-blue-400">
                                        ${product.priceUSD?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
