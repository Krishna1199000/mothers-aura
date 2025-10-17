export interface Inventory {
  id: string;
  stockId: string;
  heldByCompany: string | null;
  status: "AVAILABLE" | "HOLD" | "MEMO" | "SOLD";
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
  askingAmount: number;
  greenAmount: number;
  redAmount: number;
  superRedAmount: number;
  greenPercentage: number;
  redPercentage: number;
  superRedPercentage: number;
  imageUrl: string | null;
  videoUrl: string | null;
  certificateUrl: string | null;
  measurement: string | null;
  location: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export interface InventoryFormData {
  stockId: string;
  heldByCompany?: string;
  status: "AVAILABLE" | "HOLD" | "MEMO" | "SOLD";
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  polish: string;
  symmetry: string;
  certificateNo?: string;
  lab: string;
  pricePerCarat: number;
  askingAmount: number;
  greenAmount: number;
  redAmount: number;
  superRedAmount: number;
  greenPercentage: number;
  redPercentage: number;
  superRedPercentage: number;
  imageUrl?: string;
  videoUrl?: string;
  certificateUrl?: string;
  measurement?: string;
  location?: string;
}

export interface InventoryFilterData {
  search?: string;
  status?: "AVAILABLE" | "HOLD" | "MEMO" | "SOLD";
  caratRange?: {
    min?: number;
    max?: number;
  };
  color?: string[];
  clarity?: string[];
  shape?: string[];
  sortBy?: "carat" | "color" | "clarity" | "shape" | "pricePerCarat" | "amount";
  order?: "asc" | "desc";
}

export const COLORS = [
  "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"
];

export const CLARITIES = [
  "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"
];

export const SHAPES = [
  "Round", "Princess", "Cushion", "Emerald", "Oval", "Pear", "Marquise", 
  "Radiant", "Asscher", "Heart", "Other"
];

export const SORT_OPTIONS = [
  { value: "carat", label: "Carat" },
  { value: "color", label: "Color" },
  { value: "clarity", label: "Clarity" },
  { value: "shape", label: "Shape" },
  { value: "pricePerCarat", label: "Price/Ct" },
  { value: "amount", label: "Amount" }
];
