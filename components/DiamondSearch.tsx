"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { DIAMOND_SHAPES } from "@/lib/constants/diamond-shapes";
import Image from "next/image";

interface Diamond {
  id: string;
  stockId: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  certificateNo?: string;
  lab: string;
  pricePerCarat: number;
  amount: number;
  status: string;
  imageUrl?: string;
  createdBy: {
    name: string;
    email: string;
  };
}

interface DiamondSearchProps {
  className?: string;
  initialFilters?: Record<string, string>;
}

export const DiamondSearch = ({ className, initialFilters = {} }: DiamondSearchProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(() => {
    // Parse initial filters
    const shapes = initialFilters.shape ? initialFilters.shape.split(',') : [];
    const colors = initialFilters.color ? initialFilters.color.split(',') : [];
    const clarities = initialFilters.clarity ? initialFilters.clarity.split(',') : [];
    const cuts = initialFilters.cut ? initialFilters.cut.split(',') : [];
    const labs = initialFilters.lab ? initialFilters.lab.split(',') : [];
    const polishes = initialFilters.polish ? initialFilters.polish.split(',') : [];
    const symmetries = initialFilters.symmetry ? initialFilters.symmetry.split(',') : [];
    
    return {
      shapes,
      caratFrom: initialFilters.minCarat || "",
      caratTo: initialFilters.maxCarat || "",
      stoneId: initialFilters.search || "",
      priceFrom: initialFilters.minPrice || "",
      priceTo: initialFilters.maxPrice || "",
      colors,
      clarities,
      cuts,
      labs,
      polishes,
      symmetries,
      fluorescences: [] as string[],
      locations: [] as string[],
      statuses: [] as string[]
    };
  });

  const colors = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "FANCY INTENCE PINK", "FANCY BROWN", "BLUE", "FANCY INTENSE BLUE", "FANCY INTENCE YELLOW", "FANCY VIVID PINK", "F+"];
  
  const clarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2", "I3", "VS1-", "VS1+"];
  
  const cuts = ["ID", "EX", "VG", "GD", "FR", "N/A"];
  
  const labs = ["IGI", "GIA", "GSI", "NONC", "GCAL", "NO-CERT"];
  
  const polishes = ["ID", "EX", "VG", "GD", "FR"];
  
  const symmetries = ["EX", "VG", "GD", "FR", "G"];
  
  const fluorescences = ["NON", "FNT", "MED", "SL", "VSL", "STG", "VST"];
  
  const locations = ["USA", "INDIA"];
  
  const statuses = ["AVAILABLE", "SOLD", "MEMO", "HOLD"];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(value) 
        ? (prev[category] as string[]).filter((item: string) => item !== value)
        : [...(prev[category] as string[]), value]
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add filters to params if they have values
      if (filters.shapes.length > 0) {
        filters.shapes.forEach(shape => params.append('shape', shape));
      }
      if (filters.caratFrom) params.append('minCarat', filters.caratFrom);
      if (filters.caratTo) params.append('maxCarat', filters.caratTo);
      if (filters.stoneId) params.append('search', filters.stoneId);
      if (filters.priceFrom) params.append('minPrice', filters.priceFrom);
      if (filters.priceTo) params.append('maxPrice', filters.priceTo);
      if (filters.colors.length > 0) {
        filters.colors.forEach(color => params.append('color', color));
      }
      if (filters.clarities.length > 0) {
        filters.clarities.forEach(clarity => params.append('clarity', clarity));
      }
      if (filters.cuts.length > 0) {
        filters.cuts.forEach(cut => params.append('cut', cut));
      }
      if (filters.labs.length > 0) {
        filters.labs.forEach(lab => params.append('lab', lab));
      }
      if (filters.polishes.length > 0) {
        filters.polishes.forEach(polish => params.append('polish', polish));
      }
      if (filters.symmetries.length > 0) {
        filters.symmetries.forEach(symmetry => params.append('symmetry', symmetry));
      }
      if (filters.statuses.length > 0) {
        filters.statuses.forEach(status => params.append('status', status));
      }

      // Redirect to search results page with filters
      window.location.href = `/diamonds?${params.toString()}`;
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Diamond Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Diamond Shapes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Diamond Shapes</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-3">
              {DIAMOND_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => toggleFilter("shapes", shape.id)}
                  className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                    filters.shapes.includes(shape.id)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center border rounded-lg mb-2 relative">
                    <Image
                      src={shape.icon}
                      alt={shape.name}
                      width={32}
                      height={32}
                      className={filters.shapes.includes(shape.id) ? "text-blue-700" : "text-gray-600"}
                    />
                  </div>
                  <span className="text-xs text-center font-medium">{shape.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carat Range */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Carat Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="From"
                  value={filters.caratFrom}
                  onChange={(e) => handleInputChange("caratFrom", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="To"
                  value={filters.caratTo}
                  onChange={(e) => handleInputChange("caratTo", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Stone ID / Certificate */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Stone ID / Certificate</Label>
              <Input
                placeholder="Enter ID or Certificate Number"
                value={filters.stoneId}
                onChange={(e) => handleInputChange("stoneId", e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Price Range ($/CT)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="From"
                  value={filters.priceFrom}
                  onChange={(e) => handleInputChange("priceFrom", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="To"
                  value={filters.priceTo}
                  onChange={(e) => handleInputChange("priceTo", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <Badge
                  key={color}
                  variant={filters.colors.includes(color) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => toggleFilter("colors", color)}
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filters Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Clarity */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Clarity</Label>
              <div className="flex flex-wrap gap-2">
                {clarities.map((clarity) => (
                  <Badge
                    key={clarity}
                    variant={filters.clarities.includes(clarity) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("clarities", clarity)}
                  >
                    {clarity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cut */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Cut</Label>
              <div className="flex flex-wrap gap-2">
                {cuts.map((cut) => (
                  <Badge
                    key={cut}
                    variant={filters.cuts.includes(cut) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("cuts", cut)}
                  >
                    {cut}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Lab */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Lab</Label>
              <div className="flex flex-wrap gap-2">
                {labs.map((lab) => (
                  <Badge
                    key={lab}
                    variant={filters.labs.includes(lab) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("labs", lab)}
                  >
                    {lab}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Polish */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Polish</Label>
              <div className="flex flex-wrap gap-2">
                {polishes.map((polish) => (
                  <Badge
                    key={polish}
                    variant={filters.polishes.includes(polish) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("polishes", polish)}
                  >
                    {polish}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Filters Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Symmetry */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Symmetry</Label>
              <div className="flex flex-wrap gap-2">
                {symmetries.map((symmetry) => (
                  <Badge
                    key={symmetry}
                    variant={filters.symmetries.includes(symmetry) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("symmetries", symmetry)}
                  >
                    {symmetry}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Fluorescence */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Fluorescence</Label>
              <div className="flex flex-wrap gap-2">
                {fluorescences.map((fluor) => (
                  <Badge
                    key={fluor}
                    variant={filters.fluorescences.includes(fluor) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("fluorescences", fluor)}
                  >
                    {fluor}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Location</Label>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <Badge
                    key={location}
                    variant={filters.locations.includes(location) ? "default" : "outline"}
                    className="cursor-pointer px-2 py-1 text-xs"
                    onClick={() => toggleFilter("locations", location)}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Status</Label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={filters.statuses.includes(status) ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 ${
                    status === "AVAILABLE" ? "hover:bg-green-50 hover:border-green-300" :
                    status === "SOLD" ? "hover:bg-red-50 hover:border-red-300" :
                    status === "MEMO" ? "hover:bg-yellow-50 hover:border-yellow-300" :
                    status === "HOLD" ? "hover:bg-blue-50 hover:border-blue-300" :
                    ""
                  }`}
                  onClick={() => toggleFilter("statuses", status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-6">
            <Button 
              size="lg" 
              className="px-12 py-3 text-lg"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search Diamonds"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
