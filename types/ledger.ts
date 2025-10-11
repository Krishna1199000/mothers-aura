export interface LedgerEntry {
  id: string;
  date: Date;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  invoiceId?: string;
  invoice?: {
    invoiceNumber: string;
    totalDue: number;
  };
  masterId: string;
  master: {
    companyName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LedgerFormData {
  date: Date;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  invoiceId?: string;
  masterId: string;
}

export interface LedgerFilterData {
  startDate?: Date;
  endDate?: Date;
  type?: "CREDIT" | "DEBIT";
  masterId?: string;
}
