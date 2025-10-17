import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const data = await request.json();
    const { operation, companyName, referenceNo, lotLocation } = data;

    // Validate required fields
    if (!operation || !["HOLD", "MEMO", "SOLD", "HOLD_RETURN", "MEMO_RETURN"].includes(operation)) {
      return NextResponse.json(
        { error: "Invalid operation. Must be HOLD, MEMO, SOLD, HOLD_RETURN, or MEMO_RETURN" },
        { status: 400 }
      );
    }

    // Get the inventory item
    const inventoryItem = await db.inventory.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!inventoryItem) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Determine new status based on operation
    let newStatus = inventoryItem.status;
    let newHeldByCompany = inventoryItem.heldByCompany;

    switch (operation) {
      case "HOLD":
        newStatus = "HOLD";
        newHeldByCompany = companyName || inventoryItem.heldByCompany;
        break;
      case "MEMO":
        newStatus = "MEMO";
        newHeldByCompany = companyName || inventoryItem.heldByCompany;
        break;
      case "SOLD":
        newStatus = "SOLD";
        newHeldByCompany = companyName || inventoryItem.heldByCompany;
        break;
      case "HOLD_RETURN":
        newStatus = "AVAILABLE";
        newHeldByCompany = null;
        break;
      case "MEMO_RETURN":
        newStatus = "AVAILABLE";
        newHeldByCompany = null;
        break;
    }

    // Update inventory status
    const updatedInventory = await db.inventory.update({
      where: { id },
      data: {
        status: newStatus,
        heldByCompany: newHeldByCompany,
        updatedAt: new Date()
      }
    });

    // Create history entry
    const historyEntry = await db.inventoryHistory.create({
      data: {
        inventoryId: id,
        stockId: inventoryItem.stockId,
        operation: operation,
        referenceNo: referenceNo || `${operation}_${Date.now()}`,
        date: new Date(),
        lotNo: inventoryItem.stockId,
        lotLocation: lotLocation || inventoryItem.location || "NY",
        createdName: session.user.name || "Admin",
        companyName: companyName || "Mother's Aura",
        active: operation === "SOLD" ? false : true,
        closed: operation === "SOLD" ? true : false,
        wgt: inventoryItem.carat,
        rate: inventoryItem.askingAmount,
        discount: 0
      }
    });

    return NextResponse.json({
      message: `${operation} operation completed successfully`,
      inventory: updatedInventory,
      historyEntry: historyEntry
    });

  } catch (error) {
    console.error("Error performing inventory operation:", error);
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes("Can't reach database server")) {
      return NextResponse.json(
        { error: "Database connection failed. Please try again in a moment." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
