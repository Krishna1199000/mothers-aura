"use client";

import { LayoutGrid, List as ListIcon, Loader2, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/lib/contexts/cart-context";
import { toast } from "sonner";

interface DiamondListProps {
    diamonds: any[];
    loading: boolean;
    view: "grid" | "list";
    onViewChange: (view: "grid" | "list") => void;
    onSelect?: (diamond: any) => void;
}

export function DiamondList({ diamonds, loading, view, onViewChange, onSelect }: DiamondListProps) {

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (diamonds.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <p className="text-muted-foreground mb-2">No diamonds found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div>
            {/* Top Controls Row */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    {/* Track Search Toggle */}
                    <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border dark:border-gray-700 shadow-sm flex items-center gap-2">
                        <span className="text-sm font-medium">Track this search</span>
                        <Switch className="scale-75" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">{diamonds.length.toLocaleString()} diamonds found</span>

                    <div className="flex bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 shadow-sm p-1">
                        <button
                            onClick={() => onViewChange("grid")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "grid" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Visual
                        </button>
                        <button
                            onClick={() => onViewChange("list")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "list" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                            <ListIcon className="w-4 h-4" /> List
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <select className="bg-white dark:bg-gray-900 px-3 py-2 rounded-lg border dark:border-gray-700 shadow-sm text-sm font-medium cursor-pointer">
                        <option>Best Value</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Carat: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['<1ct', '1 - 1.5ct', '1.5 - 2ct', '2 - 2.5ct', '2.5 - 3ct', '3ct+', 'Colorless', 'Eye clean'].map(chip => (
                    <button key={chip} className="px-4 py-1.5 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-full text-xs font-medium hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm">
                        {chip}
                    </button>
                ))}
            </div>

            {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {diamonds.map((diamond) => (
                        <DiamondCard key={diamond.id} diamond={diamond} onSelect={onSelect} />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableHead>Shape</TableHead>
                                <TableHead>Carat</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Clarity</TableHead>
                                <TableHead>Cut</TableHead>
                                <TableHead>Lab</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {diamonds.map((diamond) => (
                                <TableRow key={diamond.id} className="group">
                                    <TableCell className="font-medium capitalize">
                                        {diamond.shape}
                                    </TableCell>
                                    <TableCell>{diamond.carat}</TableCell>
                                    <TableCell>{diamond.color}</TableCell>
                                    <TableCell>{diamond.clarity}</TableCell>
                                    <TableCell>{diamond.cut || '-'}</TableCell>
                                    <TableCell>{diamond.lab || '-'}</TableCell>
                                    <TableCell>
                                        <span className="font-bold">
                                            ${(diamond.askingAmount || diamond.amount || (diamond.pricePerCarat * diamond.carat))?.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => onSelect?.(diamond)}
                                        >
                                            Select
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

function DiamondCard({ diamond, onSelect }: { diamond: any; onSelect?: (diamond: any) => void }) {
    const { addItem } = useCart();
    const price = diamond.askingAmount || diamond.amount || (diamond.pricePerCarat * diamond.carat);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            productId: diamond.id,
            name: `${diamond.carat} Carat ${diamond.shape} Diamond`,
            price: price,
            quantity: 1,
            image: diamond.imageUrl || '',
        });
        toast.success("Added to cart!");
    };

    return (
        <Card 
            className="overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-700 hover:shadow-xl transition-all duration-300 group rounded-xl cursor-pointer"
            onClick={() => onSelect?.(diamond)}
        >
            <div className="relative aspect-square bg-[#F5F5F7] dark:bg-gray-800 flex items-center justify-center">
                {/* Heart Icon */}
                <button 
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-colors z-10 text-gray-400 hover:text-red-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Heart className="w-5 h-5" />
                </button>

                {/* Image */}
                {diamond.imageUrl ? (
                    <div className="relative w-full h-full p-8">
                        <Image src={diamond.imageUrl} alt={diamond.shape} fill className="object-contain" unoptimized />
                    </div>
                ) : (
                    <div className="text-muted-foreground text-xs">No Image</div>
                )}

                {/* Lab Badge */}
                {diamond.lab && (
                    <Badge className="absolute top-2 left-2 bg-[#1B2A4A] dark:bg-blue-600 text-white text-xs">
                        {diamond.lab}
                    </Badge>
                )}
            </div>

            <CardContent className="p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-lg text-[#1B2A4A] dark:text-white">
                        {diamond.carat} ct • {diamond.color} • {diamond.clarity}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {diamond.shape} {diamond.cut && `• ${diamond.cut} Cut`}
                    </p>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-xl text-[#1B2A4A] dark:text-blue-400">
                        ${price?.toLocaleString()}
                    </span>
                </div>

                {diamond.certificateNo && (
                    <p className="text-xs text-muted-foreground">
                        Cert: {diamond.certificateNo}
                    </p>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button 
                    className="flex-1 bg-[#4169E1] hover:bg-[#3157d0] text-white gap-2 h-9 text-xs font-semibold rounded-full"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
