"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileText, Share2, ChevronDown } from "lucide-react";
import { DiamondSearch } from "@/components/DiamondSearch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

interface Diamond {
  id: string;
  stockId: string;
  shape: string;
  carat?: number;
  size?: number;
  color: string;
  clarity: string;
  cut?: string;
  polish: string;
  symmetry?: string;
  sym?: string;
  lab: string;
  status?: string;
  pricePerCarat: number;
  amount?: number;
  finalAmount?: number;
  imageUrl?: string;
  videoUrl?: string;
  certificateUrl?: string;
  certUrl?: string;
  source: 'kyrah' | 'mothersaura' | 'cranberri';
}

function DiamondsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiamonds, setSelectedDiamonds] = useState<string[]>([]);
  const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        setIsLoading(true);
        
        // Use the combined diamonds API endpoint
        const response = await fetch(`/api/admin/diamonds?${searchParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch diamonds');
        }
        
        const data = await response.json();
        setDiamonds(data);
      } catch (error) {
        console.error('Error fetching diamonds:', error);
        toast({
          title: "Error",
          description: "Failed to fetch diamonds. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiamonds();
  }, [searchParams, toast]);

  const handleDiamondClick = (id: string, source: 'kyrah' | 'mothersaura') => {
    router.push(`/diamond/${source}/${id}`);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedDiamonds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading diamonds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground mt-1">
              Found {diamonds.length} diamonds
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                const currentParams = searchParams.toString();
                window.location.href = `/dashboard?${currentParams}`;
              }}
            >
              Modify Search
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              disabled={selectedDiamonds.length === 0}
            >
              Export Selected ({selectedDiamonds.length})
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-3 text-left">
                  <Checkbox 
                    checked={selectedDiamonds.length === diamonds.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDiamonds(diamonds.map(d => d.id));
                      } else {
                        setSelectedDiamonds([]);
                      }
                    }}
                  />
                </th>
                <th className="p-3 text-left">Sr No.</th>
                <th className="p-3 text-left">Stock ID</th>
                <th className="p-3 text-left">Media</th>
                <th className="p-3 text-left">Shape</th>
                <th className="p-3 text-left">Carat</th>
                <th className="p-3 text-left">Color</th>
                <th className="p-3 text-left">Clarity</th>
                <th className="p-3 text-left">Cut</th>
                <th className="p-3 text-left">Polish</th>
                <th className="p-3 text-left">Sym</th>
                <th className="p-3 text-left">Lab</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Price/Ct</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {diamonds.map((diamond, index) => (
                <tr 
                  key={`${diamond.source}-${diamond.id}`}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleDiamondClick(diamond.id, diamond.source as "mothersaura" | "kyrah")}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedDiamonds.includes(diamond.id)}
                      onCheckedChange={() => handleCheckboxChange(diamond.id)}
                    />
                  </td>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{diamond.stockId}</td>
                  <td className="p-3">
                    {diamond.videoUrl && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                  <td className="p-3">{diamond.shape}</td>
                  <td className="p-3">{((diamond.carat || diamond.size) || 0).toFixed(2)}</td>
                  <td className="p-3">{diamond.color}</td>
                  <td className="p-3">{diamond.clarity}</td>
                  <td className="p-3">{diamond.cut || "EX"}</td>
                  <td className="p-3">{diamond.polish}</td>
                  <td className="p-3">{diamond.symmetry || diamond.sym}</td>
                  <td className="p-3">{diamond.lab}</td>
                  <td className="p-3">
                    <Badge variant={
                      diamond.source === 'mothersaura' ? 'default' : 
                      diamond.source === 'cranberri' ? 'outline' : 
                      'secondary'
                    }>
                      {diamond.source === 'mothersaura' ? 'Mothers Aura' : 
                       diamond.source === 'cranberri' ? 'Cranberri Diamonds' : 
                       'Kyrah'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={diamond.status === "AVAILABLE" ? "default" : "secondary"}>
                      {diamond.status?.toLowerCase() || "unknown"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">${(diamond.pricePerCarat || 0).toLocaleString()}</td>
                  <td className="p-3 text-right">${((diamond.amount || diamond.finalAmount) || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DiamondsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading diamonds...</p>
        </div>
      </div>
    }>
      <DiamondsContent />
    </Suspense>
  );
}