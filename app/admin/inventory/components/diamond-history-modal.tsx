"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface DiamondHistoryEntry {
  id: string;
  operation: string;
  referenceNo?: string;
  date: string;
  lotNo?: string;
  lotLocation?: string;
  createdName?: string;
  companyName?: string;
  active?: boolean;
  closed?: boolean;
  wgt?: number;
  rate?: number;
  discount?: number;
}

interface InventoryDetails {
  stockId: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  polish: string;
  symmetry: string;
  lab: string;
  status: string;
  heldByCompany?: string;
  pricePerCarat: number;
  askingAmount: number;
  location?: string;
}

interface DiamondHistoryData {
  inventory: InventoryDetails;
  history: DiamondHistoryEntry[];
}

interface DiamondHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryId: string;
}

export default function DiamondHistoryModal({
  open,
  onOpenChange,
  inventoryId,
}: DiamondHistoryModalProps) {
  const [historyData, setHistoryData] = useState<DiamondHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!open) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/inventory/${inventoryId}/history`);
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching diamond history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [open, inventoryId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Stone History Report</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : historyData ? (
          <div className="space-y-6">
            {/* Stone Summary Header */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold mb-2">
                {historyData.inventory.stockId} {historyData.inventory.color} {historyData.inventory.clarity} {historyData.inventory.cut} {historyData.inventory.polish} {historyData.inventory.symmetry} {historyData.inventory.lab} {historyData.inventory.carat}
              </div>
              <div className="text-sm text-gray-600">
                Transfer Date: {format(new Date(), "MM/dd/yyyy HH:mm")} | 
                Status: {historyData.inventory.status} | 
                Discount: {historyData.inventory.heldByCompany ? "0.00" : "0.00"} | 
                Rate: {historyData.inventory.pricePerCarat} | 
                Location: {historyData.inventory.location || "NY"}
              </div>
            </div>

            {/* History Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Sr No.</th>
                    <th className="px-4 py-2 text-left font-semibold">Operation</th>
                    <th className="px-4 py-2 text-left font-semibold">Receive No</th>
                    <th className="px-4 py-2 text-left font-semibold">Invoice Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Lot No</th>
                    <th className="px-4 py-2 text-left font-semibold">Lot Location</th>
                    <th className="px-4 py-2 text-left font-semibold">Created Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Company Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Active</th>
                    <th className="px-4 py-2 text-left font-semibold">Closed</th>
                    <th className="px-4 py-2 text-left font-semibold">WGT</th>
                    <th className="px-4 py-2 text-left font-semibold">Rate</th>
                    <th className="px-4 py-2 text-left font-semibold">Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.history.map((entry, index) => (
                    <tr key={entry.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}`}>
                      <td className="px-4 py-2 font-semibold">{index + 1}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.operation === 'SOLD' ? 'bg-green-100 text-green-800' :
                          entry.operation === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
                          entry.operation === 'MEMO' ? 'bg-blue-100 text-blue-800' :
                          entry.operation === 'IMPORT' ? 'bg-purple-100 text-purple-800' :
                          entry.operation.includes('RETURN') ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.operation.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2">{entry.referenceNo || "-"}</td>
                      <td className="px-4 py-2">{format(new Date(entry.date), "MM/dd/yyyy")}</td>
                      <td className="px-4 py-2">{entry.lotNo || historyData.inventory.stockId}</td>
                      <td className="px-4 py-2">{entry.lotLocation || historyData.inventory.location || "NY"}</td>
                      <td className="px-4 py-2">{entry.createdName || "-"}</td>
                      <td className="px-4 py-2">{entry.companyName || "-"}</td>
                      <td className="px-4 py-2">{entry.active ? "YES" : "NO"}</td>
                      <td className="px-4 py-2">{entry.closed ? "YES" : "NO"}</td>
                      <td className="px-4 py-2">{entry.wgt || historyData.inventory.carat || 0}</td>
                      <td className="px-4 py-2">{(entry.rate || historyData.inventory.pricePerCarat || 0).toFixed(2)}</td>
                      <td className="px-4 py-2">{(entry.discount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No history data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
