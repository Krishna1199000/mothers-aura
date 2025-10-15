"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SyncStatus {
  id: string;
  lastSyncAt: string;
  status: string;
  message: string | null;
  diamondsCount: number;
  processed: number;
  totalDiamonds: number;
}

export default function CranberriAdminPage() {
  const { toast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchSyncStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/cranberri/sync');
      if (!response.ok) {
        throw new Error('Failed to fetch sync status');
      }
      const data = await response.json();
      setSyncStatus(data.latestSync);
    } catch (error) {
      console.error('Error fetching sync status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sync status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testApi = async () => {
    try {
      setIsTesting(true);
      const response = await fetch('/api/admin/cranberri/test');
      
      if (!response.ok) {
        throw new Error('Failed to test API');
      }
      
      const data = await response.json();
      setTestResult(data);
      
      toast({
        title: data.success ? "API Test Successful" : "API Test Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error testing API:', error);
      toast({
        title: "Error",
        description: "Failed to test API",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const triggerSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch('/api/admin/cranberri/sync', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger sync');
      }
      
      const data = await response.json();
      
      toast({
        title: "Sync Started",
        description: data.message,
      });
      
      setTimeout(() => {
        fetchSyncStatus();
      }, 2000);
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast({
        title: "Error",
        description: "Failed to trigger sync",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
    const interval = setInterval(fetchSyncStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cranberri Diamond Sync Admin</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchSyncStatus}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Status
            </Button>
            <Button
              variant="outline"
              onClick={testApi}
              disabled={isTesting}
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test API
            </Button>
            <Button
              onClick={triggerSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Sync Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {syncStatus ? (
                <>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge
                      variant={
                        syncStatus.status === "COMPLETED"
                          ? "default"
                          : syncStatus.status === "FAILED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {syncStatus.status}
                    </Badge>
                  </p>
                  <p>
                    <strong>Last Sync:</strong>{" "}
                    {new Date(syncStatus.lastSyncAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Diamonds Synced:</strong> {syncStatus.diamondsCount}
                  </p>
                  {syncStatus.totalDiamonds > 0 && (
                    <p>
                      <strong>Progress:</strong> {syncStatus.processed} / {syncStatus.totalDiamonds}
                    </p>
                  )}
                  {syncStatus.message && (
                    <p>
                      <strong>Message:</strong> {syncStatus.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No sync data available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Cranberri Diamonds in DB</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Total Diamonds:</strong> {syncStatus?.diamondsCount ?? 0}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This count reflects the number of Cranberri diamonds currently stored in your local database.
              </p>
            </CardContent>
          </Card>
        </div>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>API Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Test Status:</span>
                  <Badge variant={testResult.success ? 'default' : 'destructive'}>
                    {testResult.success ? 'SUCCESS' : 'FAILED'}
                  </Badge>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
