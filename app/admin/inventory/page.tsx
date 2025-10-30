import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { InventoryContent } from "./components/inventory-content";

export const metadata: Metadata = {
  title: "Inventory Management | Admin Dashboard",
  description: "Manage your diamond inventory",
};

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.role || !["ADMIN", "EMPLOYEE"].includes(session.user.role)) {
    redirect("/signin?callbackUrl=/admin/inventory");
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">
          Track and manage your diamond inventory
        </p>
      </div>
      <InventoryContent userRole={session.user.role as "ADMIN" | "EMPLOYEE"} />
    </div>
  );
}
