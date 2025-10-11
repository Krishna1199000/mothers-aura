"use client";

import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceForm } from "./performance-form";
import type { PerformanceReport } from "@/types/performance";

interface PerformanceTableProps {
  isLoading: boolean;
  reports?: PerformanceReport[];
  userRole: "ADMIN" | "EMPLOYEE";
  onDelete: () => void;
}

export function PerformanceTable({
  isLoading,
  reports,
  userRole,
  onDelete,
}: PerformanceTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/performance-reports/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete report");
      }

      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Total Calls</TableHead>
              <TableHead>Total Emails</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Memo #</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Notes</TableHead>
              {userRole === "ADMIN" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports?.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  {format(new Date(report.date), "dd-MM-yyyy")}
                </TableCell>
                <TableCell>{report.createdBy.name}</TableCell>
                <TableCell>{report.totalCalls}</TableCell>
                <TableCell>{report.totalEmails}</TableCell>
                <TableCell>{report.requirementReceived}</TableCell>
                <TableCell>{report.memoNumber || "-"}</TableCell>
                <TableCell>{report.invoiceNumber || "-"}</TableCell>
                <TableCell>{report.notes || "-"}</TableCell>
                {userRole === "ADMIN" && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Performance Report</DialogTitle>
                          </DialogHeader>
                          <PerformanceForm
                            initialData={{
                              date: new Date(report.date),
                              totalCalls: report.totalCalls,
                              totalEmails: report.totalEmails,
                              requirementReceived: report.requirementReceived,
                              memoNumber: report.memoNumber || "",
                              invoiceNumber: report.invoiceNumber || "",
                              notes: report.notes || "",
                            }}
                            isEditing
                            reportId={report.id}
                            onSuccess={onDelete}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Report</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this report? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(report.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {(!reports || reports.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={userRole === "ADMIN" ? 9 : 8}
                  className="text-center"
                >
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[150px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
