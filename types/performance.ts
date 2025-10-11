export interface PerformanceReport {
  id: string;
  date: Date;
  totalCalls: number;
  totalEmails: number;
  requirementReceived: number;
  memoNumber?: string | null;
  invoiceNumber?: string | null;
  notes?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export interface PerformanceFormData {
  date: Date;
  totalCalls: number;
  totalEmails: number;
  requirementReceived: number;
  memoNumber?: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface PerformanceFilterData {
  startDate?: Date;
  endDate?: Date;
}
