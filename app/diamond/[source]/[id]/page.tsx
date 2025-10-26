"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Share2, MessageCircle, Mail, Copy, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface Diamond {
  id: string;
  stockId: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  lab: string;
  status: string;
  pricePerCarat: number;
  amount: number;
  imageUrl?: string;
  videoUrl?: string;
  certificateUrl?: string;
  fluorescence?: string;
  source?: 'kyrah' | 'mothersaura' | 'cranberri';
  // Additional fields for Kyrah diamonds
  measurement?: string;
  length?: number;
  width?: number;
  height?: number;
  depth?: number;
  table?: number;
  ratio?: number;
  comment?: string;
  girdle?: string;
  culet?: string;
  crownAngle?: number;
  crownHeight?: string;
  pavilionAngle?: number;
  pavilionDepth?: number;
  // Additional fields for Cranberri diamonds
  size?: number;
  sym?: string;
  finalAmount?: number;
  certUrl?: string;
  fancyIntensity?: string;
  fancyOvertone?: string;
  fancyColor?: string;
  location?: string;
  inscription?: string;
}

export default function DiamondPage() {
  const params = useParams();
  const { toast } = useToast();
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDiamond = async () => {
      try {
        setIsLoading(true);
        
        // Determine the API endpoint based on source
        const source = params.source as string;
        let apiUrl = '';
        
        if (source === 'kyrah') {
          apiUrl = `/api/admin/kyrah/${params.id}`;
        } else if (source === 'cranberri') {
          apiUrl = `/api/admin/cranberri/${params.id}`;
        } else {
          apiUrl = `/api/admin/inventory/${params.id}`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch diamond details');
        }
        
        const data = await response.json();
        setDiamond({ ...data, source: source as 'kyrah' | 'mothersaura' | 'cranberri' });
      } catch (error) {
        console.error('Error fetching diamond:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.source && params.id) {
      fetchDiamond();
    }
  }, [params.source, params.id]);

  const handleShare = async (type: 'whatsapp' | 'email' | 'copy') => {
    const url = window.location.href;
    const title = diamond ? `${diamond.shape} Diamond - ${diamond.carat}ct ${diamond.color} ${diamond.clarity}` : '';
    
    switch (type) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast({
            title: "Link copied",
            description: "Diamond link has been copied to clipboard",
          });
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading diamond details...</p>
        </div>
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Diamond not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">
                {diamond.shape} Diamond - {diamond.carat}ct {diamond.color} {diamond.clarity}
              </h1>
              <span className="px-2 py-1 text-xs bg-muted rounded">
                {diamond.source === 'kyrah' ? 'Kyrah' : diamond.source === 'cranberri' ? 'Cranberri Diamonds' : 'Mothers Aura'}
              </span>
            </div>
            <p className="text-muted-foreground">Stock ID: {diamond.stockId}</p>
          </div>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share via WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Section */}
          <div>
            <Card>
              <CardContent className="p-6">
                {diamond.videoUrl ? (
                  <video 
                    controls 
                    className="w-full aspect-video rounded-lg"
                    poster={diamond.imageUrl}
                  >
                    <source src={diamond.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : diamond.imageUrl ? (
                  <Image
                    src={diamond.imageUrl} 
                    alt={`${diamond.shape} Diamond ${diamond.carat}ct`}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No media available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Stock ID</p>
                        <p className="font-medium">{diamond.stockId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Shape</p>
                        <p className="font-medium">{diamond.shape}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Carat</p>
                        <p className="font-medium">{diamond.carat || diamond.size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Color</p>
                        <p className="font-medium">{diamond.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Clarity</p>
                        <p className="font-medium">{diamond.clarity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lab</p>
                        <p className="font-medium">{diamond.lab}</p>
                      </div>
                      {diamond.source === 'kyrah' && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{diamond.location || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Inscription</p>
                            <p className="font-medium">{diamond.inscription || 'N/A'}</p>
                          </div>
                        </>
                      )}
                      {diamond.source === 'cranberri' && (
                        <div>
                          <p className="text-sm text-muted-foreground">Size</p>
                          <p className="font-medium">{diamond.size}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specifications">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Cut</p>
                        <p className="font-medium">{diamond.cut || "EX"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Polish</p>
                        <p className="font-medium">{diamond.polish || "EX"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Symmetry</p>
                        <p className="font-medium">{diamond.symmetry || diamond.sym || "EX"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fluorescence</p>
                        <p className="font-medium">{diamond.fluorescence || "None"}</p>
                      </div>
                      {diamond.source === 'kyrah' && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Depth</p>
                            <p className="font-medium">{diamond.depth ? `${diamond.depth}%` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Table</p>
                            <p className="font-medium">{diamond.table ? `${diamond.table}%` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Girdle</p>
                            <p className="font-medium">{diamond.girdle || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Culet</p>
                            <p className="font-medium">{diamond.culet || 'N/A'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Price Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Price per Carat</p>
                    <p className="font-medium">${diamond.pricePerCarat.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4">
                    <p className="font-medium">Total Price</p>
                    <p className="text-xl font-bold">${Number((diamond.amount ?? diamond.finalAmount) ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg">
              Request More Information
            </Button>

            {(diamond.certificateUrl || diamond.certUrl) && (
              <Button variant="outline" className="w-full" size="lg">
                View Certificate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
