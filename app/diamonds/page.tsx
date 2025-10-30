"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileText, Share2, ChevronDown, Search } from "lucide-react";
import { DiamondSearch } from "@/components/DiamondSearch";
import { RoleBasedHeader } from "@/components/RoleBasedHeader";
import { Footer } from "@/components/Footer";
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
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiamonds, setSelectedDiamonds] = useState<string[]>([]);
  const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const handleDelete = async (id: string, source?: string) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this diamond?')) return;
    try {
      if (source === 'mothersaura') {
        const res = await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
      }
      // For external sources (previously kyrah/cranberri), persist hide in localStorage and remove from list
      if (source !== 'mothersaura') {
        try {
          const key = 'hiddenDiamonds';
          const current = JSON.parse(localStorage.getItem(key) || '[]');
          const entry = `${source}-${id}`;
          if (!current.includes(entry)) current.push(entry);
          localStorage.setItem(key, JSON.stringify(current));
        } catch {}
      }
      setDiamonds(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

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
        // Apply blacklist for external items so they don't return on refresh
        let hidden: string[] = [];
        try {
          hidden = JSON.parse(localStorage.getItem('hiddenDiamonds') || '[]');
        } catch {}
        const filtered = Array.isArray(hidden) && hidden.length
          ? data.filter((d: any) => !hidden.includes(`${d.source}-${d.id}`))
          : data;
        setDiamonds(filtered);
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
                {/* Status hidden per request */}
                <th className="p-3 text-right">Price/Ct</th>
                <th className="p-3 text-right">Amount</th>
                {isAdmin && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {diamonds.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 17 : 16} className="py-16">
                    <div className="text-center">
                      <Search size={64} className="mx-auto text-muted-foreground mb-6" />
                      <h3 className="text-2xl font-bold mb-4">
                        We currently don&apos;t have this
                      </h3>
                      <p className="text-muted-foreground mb-8 text-lg">
                        All stocks are sold out, but we&apos;d love to help you find what you&apos;re looking for!
                      </p>
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-primary">📧</span>
                          <span className="text-muted-foreground">Email us:</span>
                          <a 
                            href="mailto:admintejas@mothersauradiamonds.com" 
                            className="text-primary hover:underline font-medium"
                          >
                            admintejas@mothersauradiamonds.com
                          </a>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-primary">📞</span>
                          <span className="text-muted-foreground">Call us:</span>
                          <div className="flex flex-col gap-1">
                            <a href="tel:+918657585167" className="text-primary hover:underline font-medium">
                              +91 86575 85167
                            </a>
                            <a href="tel:+917841834563" className="text-primary hover:underline font-medium">
                              +91 78418 34563
                            </a>
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-6 text-base">
                          We&apos;ll arrange it for you and give you something you would also love!
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push('/products')}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <FileText className="mr-2 h-5 w-5" />
                        View Our Whole Collection
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                diamonds.map((diamond, index) => (
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
                    {/* Status cell removed */}
                    <td className="p-3 text-right">${(diamond.pricePerCarat || 0).toLocaleString()}</td>
                    <td className="p-3 text-right">${((diamond.amount || diamond.finalAmount) || 0).toLocaleString()}</td>
                    {isAdmin && (
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(diamond.id, diamond.source)}
                          title={diamond.source !== 'mothersaura' ? 'Removes this external diamond from results' : undefined}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DiamondsPage() {
  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <Suspense fallback={
        <div className="min-h-[60vh] bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading diamonds...</p>
          </div>
        </div>
      }>
        <DiamondsContent />
      </Suspense>
      <Footer />
    </div>
  );
}