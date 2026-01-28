"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RoleBasedHeader } from "@/components/RoleBasedHeader";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { DiamondSearch } from "@/components/DiamondSearch";
import { Footer } from "@/components/Footer";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/signin");
      return;
    }
  }, [session, status, router]);

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
    return null; // Will redirect to signin
  }

  const user = session.user as any;

  // If customer is not yet approved, show waiting screen instead of dashboard
  if (user.role === "CUSTOMER" && user.approvalStatus !== "APPROVED") {
    const status = user.approvalStatus as string | undefined;
    const isRejected = status === "REJECTED";

    const WaitingContent = () => {
      const router = useRouter();

      const requestApproval = async () => {
        try {
          const res = await fetch("/api/customer/approval/request", {
            method: "POST",
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert(
              data.error ||
                "Unable to submit approval request. Please try again later.",
            );
            return;
          }
          alert(
            "Your approval request has been submitted. Please wait for admin to approve.",
          );
          router.refresh();
        } catch (e) {
          console.error(e);
          alert("Something went wrong. Please try again later.");
        }
      };

      return (
        <div className="min-h-screen bg-background flex flex-col">
          <RoleBasedHeader />
          <AnnouncementBar />
          <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
            <div className="max-w-lg w-full bg-white dark:bg-gray-900 border border-border rounded-xl p-8 shadow-sm text-center space-y-4">
              <h1 className="text-2xl font-bold">
                {isRejected ? "Account rejected" : "Approval pending"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Your customer account is not yet approved. An administrator
                must approve it before you can access the customer panel.
              </p>
              {isRejected ? (
                <>
                  <p className="text-sm text-red-500 font-medium">
                    Your previous approval request was declined.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You can request approval again up to 3 times. After that,
                    please contact support if you still need access.
                  </p>
                  <button
                    onClick={requestApproval}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Request approval again
                  </button>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Status: <span className="font-semibold">Approval pending</span>.
                  You will receive an email once your account has been reviewed.
                  You can safely sign out and sign in later to check the status.
                </p>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
    };

    return <WaitingContent />;
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <AnnouncementBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            Discover exceptional diamonds with our advanced search tools
          </p>
        </div>

        {/* Diamond Search */}
        <DiamondSearch />
      </main>

      <Footer />
    </div>
  );
}
