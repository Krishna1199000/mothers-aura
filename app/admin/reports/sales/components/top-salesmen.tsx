"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";

interface TopSalesman {
  salesExecutiveId: string;
  name: string;
  email: string;
  totalSales: number;
}

interface TopSalesmenProps {
  salesmen: TopSalesman[];
}

export function TopSalesmen({ salesmen }: TopSalesmenProps) {
  if (!salesmen || salesmen.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Salesmen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No sales data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Salesmen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesmen.map((salesman, index) => (
            <div key={salesman.salesExecutiveId} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {salesman.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {salesman.name || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {salesman.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  ${salesman.totalSales.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

