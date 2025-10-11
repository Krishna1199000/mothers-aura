"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DiamondDetailsProps {
  diamond: {
    id: string;
    stockId: string;
    heldByCompany: string | null;
    status: string;
    shape: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string | null;
    polish: string;
    symmetry: string;
    certificateNo: string | null;
    lab: string;
    pricePerCarat: number;
    amount: number;
    imageUrl: string | null;
    videoUrl: string | null;
    certificateUrl: string | null;
    measurement: string | null;
    location: string | null;
    createdBy: {
      name: string | null;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  userRole: string;
}

export function DiamondDetails({ diamond, userRole }: DiamondDetailsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"details" | "media">("details");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "MEMO":
        return "bg-blue-100 text-blue-800";
      case "SOLD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {diamond.stockId}
            </h1>
            <p className="text-muted-foreground">
              Diamond Details
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(diamond.status)}>
            {diamond.status}
          </Badge>
          {userRole === "ADMIN" && (
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Stock ID
                  </label>
                  <p className="text-lg font-semibold">{diamond.stockId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Shape
                  </label>
                  <p className="text-lg">{diamond.shape}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Carat Weight
                  </label>
                  <p className="text-lg">{diamond.carat} ct</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Color
                  </label>
                  <p className="text-lg">{diamond.color}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Clarity
                  </label>
                  <p className="text-lg">{diamond.clarity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cut
                  </label>
                  <p className="text-lg">{diamond.cut || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Polish
                  </label>
                  <p className="text-lg">{diamond.polish}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Symmetry
                  </label>
                  <p className="text-lg">{diamond.symmetry}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certification & Lab</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Lab
                  </label>
                  <p className="text-lg">{diamond.lab}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Certificate Number
                  </label>
                  <p className="text-lg">{diamond.certificateNo || "N/A"}</p>
                </div>
                {diamond.measurement && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Measurement
                    </label>
                    <p className="text-lg">{diamond.measurement}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {diamond.heldByCompany && (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Held By Company
                  </label>
                  <p className="text-lg">{diamond.heldByCompany}</p>
                </div>
                {diamond.location && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">
                      Location
                    </label>
                    <p className="text-lg">{diamond.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Price per Carat
                  </label>
                  <p className="text-2xl font-bold text-primary">
                    ${diamond.pricePerCarat.toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </label>
                  <p className="text-3xl font-bold">
                    ${diamond.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media & Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diamond.imageUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(diamond.imageUrl!, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Image
                  </Button>
                )}
                {diamond.videoUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(diamond.videoUrl!, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Video
                  </Button>
                )}
                {diamond.certificateUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(diamond.certificateUrl!, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Certificate
                  </Button>
                )}
                {!diamond.imageUrl && !diamond.videoUrl && !diamond.certificateUrl && (
                  <p className="text-muted-foreground text-center py-4">
                    No media available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Info */}
          {userRole === "ADMIN" && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Created By:
                    </label>
                    <p>{diamond.createdBy.name || diamond.createdBy.email}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Created:
                    </label>
                    <p>{new Date(diamond.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">
                      Last Updated:
                    </label>
                    <p>{new Date(diamond.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
