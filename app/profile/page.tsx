"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthenticatedHeader } from "@/components/AuthenticatedHeader";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, Lock, Bug, Settings, Phone, Loader2 } from "lucide-react";
import { ChangePasswordForm } from "./components/change-password-form";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
  });
  
  const [bugReport, setBugReport] = useState({
    subject: "",
    description: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    setProfileData({
      name: session.user?.name || "",
      email: session.user?.email || "",
      phone: "",
    });
  }, [session, status, router]);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleReportBug = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportLoading(true);

    try {
      const response = await fetch("/api/report-bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bugReport),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send bug report");
      }

      toast({
        title: "Success!",
        description: "Bug report sent successfully. Thank you for your feedback!",
      });

      setBugReport({ subject: "", description: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send bug report",
        variant: "destructive",
      });
    } finally {
      setReportLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (showOTP) {
        // Complete profile update with OTP
        const response = await fetch("/api/profile/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp,
            ...profileData,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update profile");
        }

        toast({
          title: "Success!",
          description: "Profile updated successfully",
        });

        setShowOTP(false);
      } else {
        // Initiate profile update
        const response = await fetch("/api/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to initiate profile update");
        }

        setShowOTP(true);
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <AuthenticatedHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </TabsTrigger>
              <TabsTrigger value="bug">
                <Bug className="w-4 h-4 mr-2" />
                Report Bug
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {showOTP && (
                      <>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold">Verify Your Email</h3>
                          <p className="text-sm text-muted-foreground">
                            We&apos;ve sent a verification code to your email
                          </p>
                        </div>
                        <div className="flex justify-center py-4">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            maxLength={6}
                            className="w-48 h-12 border rounded-md text-center text-2xl font-semibold"
                            placeholder="000000"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="pl-10"
                          required
                          disabled={showOTP || isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="pl-10"
                          required
                          disabled={showOTP || isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="pl-10"
                          disabled={showOTP || isLoading}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {showOTP ? "Verify & Update" : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bug Report Tab */}
            <TabsContent value="bug">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Report a Bug
                  </CardTitle>
                  <CardDescription>
                    Help us improve by reporting any issues you encounter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReportBug} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={bugReport.subject}
                        onChange={(e) => setBugReport({ ...bugReport, subject: e.target.value })}
                        placeholder="Brief description of the issue"
                        required
                        disabled={reportLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={bugReport.description}
                        onChange={(e) => setBugReport({ ...bugReport, description: e.target.value })}
                        placeholder="Please provide detailed information about the bug..."
                        rows={6}
                        required
                        disabled={reportLoading}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={reportLoading}>
                      {reportLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Bug Report
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
