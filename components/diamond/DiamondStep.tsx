"use client";

import { useState, useEffect } from "react";
import { DiamondFilters } from "./DiamondFilters";
import { DiamondList } from "./DiamondList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { toast } from "sonner";

interface DiamondStepProps {
    onNext: () => void;
}

export function DiamondStep({ onNext }: DiamondStepProps) {
    const { addItem } = useCart();
    const [filters, setFilters] = useState<any>({
        type: "natural", // 'natural' or 'lab'
        shape: [],
        price: [350, 4000000],
        carat: [0.15, 35],
        color: [0, 7],
        clarity: [0, 7],
        cut: [0, 4],
        view: "grid"
    });

    const [diamonds, setDiamonds] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch diamonds from inventory
    useEffect(() => {
        const fetchDiamonds = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                // Filter by status AVAILABLE
                params.append('status', 'AVAILABLE');
                if (filters.type === 'lab') {
                    params.append('lab', 'IGI,GIA');
                }

                // Try inventory API first, fallback to admin diamonds
                let res = await fetch(`/api/admin/inventory?${params.toString()}`);
                
                if (!res.ok) {
                    // Fallback to old API
                    res = await fetch(`/api/admin/diamonds?${params.toString()}`);
                }

                if (res.ok) {
                    let data = await res.json();
                    
                    // Client-side filtering logic
                    if (filters.shape && filters.shape.length > 0) {
                        data = data.filter((d: any) => 
                            filters.shape.includes(d.shape?.toUpperCase())
                        );
                    }
                    if (filters.price) {
                        data = data.filter((d: any) => {
                            const price = d.askingAmount || d.amount || (d.pricePerCarat * d.carat) || 0;
                            return price >= filters.price[0] && price <= filters.price[1];
                        });
                    }
                    if (filters.carat) {
                        data = data.filter((d: any) => 
                            d.carat >= filters.carat[0] && d.carat <= filters.carat[1]
                        );
                    }
                    
                    const colorMap: Record<string, number> = {
                        'D': 7, 'E': 6, 'F': 5, 'G': 4, 'H': 3, 'I': 2, 'J': 1, 'K': 0, 'L': -1, 'M': -2
                    };
                    if (filters.color && filters.color.length === 2) {
                        const [min, max] = filters.color;
                        data = data.filter((d: any) => {
                            const val = colorMap[d.color] ?? -999;
                            return val >= min && val <= max;
                        });
                    }
                    
                    setDiamonds(data);
                }
            } catch (error) {
                console.error("Failed to fetch diamonds", error);
                setDiamonds([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDiamonds();
    }, [filters]);

    // Handle diamond selection
    const handleSelectDiamond = (diamond: any) => {
        const price = diamond.askingAmount || diamond.amount || (diamond.pricePerCarat * diamond.carat);
        
        addItem({
            productId: diamond.id,
            name: `${diamond.carat} Carat ${diamond.shape} Diamond - ${diamond.color}/${diamond.clarity}`,
            price: price,
            quantity: 1,
            image: diamond.imageUrl || '',
        });
        
        toast.success("Diamond added to your selection!");
        onNext();
    };

    return (
        <div className="space-y-8">
            {/* Top Header & Toggle */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-serif dark:text-white">Search for Diamonds</h1>
                <p className="text-muted-foreground text-sm">Find your perfect diamond from our curated collection</p>

                <div className="flex justify-center mt-4">
                    <div className="inline-flex rounded-md shadow-sm border dark:border-gray-700 overflow-hidden" role="group">
                        <button
                            type="button"
                            onClick={() => setFilters({ ...filters, type: 'lab' })}
                            className={`px-6 py-2 text-sm font-medium transition-colors ${
                                filters.type === 'lab' 
                                    ? 'bg-[#1B2A4A] text-white' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            Lab Grown
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilters({ ...filters, type: 'natural' })}
                            className={`px-6 py-2 text-sm font-medium transition-colors ${
                                filters.type === 'natural' 
                                    ? 'bg-[#1B2A4A] text-white' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            Natural
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Horizontal Filters */}
            <div className="hidden lg:block">
                <DiamondFilters
                    filters={filters}
                    setFilters={setFilters}
                    mode="top"
                />
            </div>

            {/* Mobile Filter Trigger & Layout */}
            <div className="lg:hidden mb-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                        <div className="py-4">
                            <h3 className="font-serif text-xl mb-4">Filters</h3>
                            <DiamondFilters filters={filters} setFilters={setFilters} mode="side" />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                {/* Sidebar Filters */}
                <aside className="hidden lg:block w-[280px] flex-shrink-0">
                    <DiamondFilters
                        filters={filters}
                        setFilters={setFilters}
                        mode="side"
                    />
                </aside>

                {/* Results Area */}
                <div className="flex-1">
                    <DiamondList
                        diamonds={diamonds}
                        loading={loading}
                        view={filters.view}
                        onViewChange={(v) => setFilters({ ...filters, view: v })}
                        onSelect={handleSelectDiamond}
                    />
                </div>
            </div>
        </div>
    );
}
