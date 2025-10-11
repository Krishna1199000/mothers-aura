import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiamondDetails } from "./components/diamond-details";

export const metadata: Metadata = {
  title: "Diamond Details | Mothers Aura",
  description: "View detailed information about this diamond",
};

async function getDiamond(id: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return null;
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/inventory/${id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`, // This is a simplified approach
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching diamond:", error);
    return null;
  }
}

export default async function DiamondPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    notFound();
  }

  const { id } = await params;
  const diamond = await getDiamond(id);

  if (!diamond) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <DiamondDetails diamond={diamond} userRole={session.user.role || "CUSTOMER"} />
    </div>
  );
}
