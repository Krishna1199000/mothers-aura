export interface SalesReportSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topCustomers: Array<{
    masterId: string;
    companyName?: string;
    _sum: {
      totalDue: number | null;
    };
  }>;
}

export interface DailySales {
  date: Date;
  total: number;
}

export interface RecentInvoice {
  id: string;
  invoiceNumber: string;
  date: Date | null;
  companyName: string;
  total: number | null;
}

export interface SalesReportResponse {
  summary: SalesReportSummary;
  dailySales: DailySales[];
  categoryDistribution: Record<string, number>;
  recentInvoices: RecentInvoice[];
}

export interface SalesFilterFormData {
  startDate: Date | null;
  endDate: Date | null;
  customerId?: string;
}

