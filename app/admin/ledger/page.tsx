import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LedgerContent } from "./components/ledger-content";

export const metadata: Metadata = {
  title: "Account Ledger | Admin Dashboard",
  description: "Manage and track financial transactions",
};

export default async function LedgerPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=/admin/ledger");
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Ledger</h1>
        <p className="text-muted-foreground">
          Track and manage financial transactions
        </p>
      </div>
      <LedgerContent />
    </div>
  );
}
