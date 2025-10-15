"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SyncStatus {
  latestSync?: {
    id: string;
    lastSyncAt: string;
    status: string;
    message?: string;
    diamondsCount: number;
  };
  diamondCount: number;
}

export default function KyrahAdminPage() {
  const { toast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchSyncStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/kyrah/sync');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sync status');
      }
      
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sync status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testApi = async () => {
    try {
      setIsTesting(true);
      const response = await fetch('/api/admin/kyrah/test');
      
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
      const response = await fetch('/api/admin/kyrah/sync', {
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
      
      // Refresh status after a short delay
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Kyrah Diamond Sync</h1>
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
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              {syncStatus ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Diamond Count:</span>
                    <span className="font-medium">{syncStatus.diamondCount}</span>
                  </div>
                  
                  {syncStatus.latestSync && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Last Sync:</span>
                        <span className="font-medium">
                          {new Date(syncStatus.latestSync.lastSyncAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge 
                          variant={
                            syncStatus.latestSync.status === 'COMPLETED' ? 'default' :
                            syncStatus.latestSync.status === 'FAILED' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {syncStatus.latestSync.status}
                        </Badge>
                      </div>
                      
                      {syncStatus.latestSync.message && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <span className="text-sm text-muted-foreground">Message:</span>
                          <p className="text-sm mt-1">{syncStatus.latestSync.message}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Click &quot;Refresh Status&quot; to load current status</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sync diamonds from the Kyrah API to your local database.
                  This will replace all existing Kyrah diamond data.
                </p>
                
                <Button
                  onClick={triggerSync}
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Diamonds
                    </>
                  )}
                </Button>
              </div>
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
