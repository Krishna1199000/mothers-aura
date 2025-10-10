"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiamondSearchProps {
  className?: string;
}

export const DiamondSearch = ({ className }: DiamondSearchProps) => {
  const [filters, setFilters] = useState({
    shapes: [] as string[],
    caratFrom: "",
    caratTo: "",
    stoneId: "",
    priceFrom: "",
    priceTo: "",
    colors: [] as string[],
    clarities: [] as string[],
    cuts: [] as string[],
    labs: [] as string[],
    polishes: [] as string[],
    symmetries: [] as string[],
    fluorescences: [] as string[],
    locations: [] as string[]
  });

  const shapes = [
    { name: "ROUND", icon: "⬢" },
    { name: "OVAL", icon: "⭕" },
    { name: "PEAR", icon: "💧" },
    { name: "MARQUISE", icon: "🔶" },
    { name: "HEART", icon: "💎" },
    { name: "EMERALD", icon: "⬜" },
    { name: "CUSHION", icon: "◆" },
    { name: "PRINCESS", icon: "⬛" },
    { name: "RADIANT", icon: "📐" },
    { name: "ASSCHER", icon: "⬜" },
    { name: "OTHERS", icon: "✨" }
  ];

  const colors = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "FANCY INTENCE PINK", "FANCY BROWN", "BLUE", "FANCY INTENSE BLUE", "FANCY INTENCE YELLOW", "FANCY VIVID PINK", "F+"];
  
  const clarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2", "I3", "VS1-", "VS1+"];
  
  const cuts = ["ID", "EX", "VG", "GD", "FR", "N/A"];
  
  const labs = ["IGI", "GIA", "GSI", "NONC", "GCAL", "NO-CERT"];
  
  const polishes = ["ID", "EX", "VG", "GD", "FR"];
  
  const symmetries = ["EX", "VG", "GD", "FR", "G"];
  
  const fluorescences = ["NON", "FNT", "MED", "SL", "VSL", "STG", "VST"];
  
  const locations = ["USA", "INDIA"];

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
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4">
              {shapes.map((shape) => (
                <button
                  key={shape.name}
                  onClick={() => toggleFilter("shapes", shape.name)}
                  className={`flex flex-col items-center p-3 border rounded-lg transition-all ${
                    filters.shapes.includes(shape.name)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center border rounded-lg mb-2">
                    <span className="text-xl">{shape.icon}</span>
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

          {/* Search Button */}
          <div className="flex justify-center pt-6">
            <Button size="lg" className="px-12 py-3 text-lg">
              Search Diamonds
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
