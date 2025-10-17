import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/prisma";

export async function GET(
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

    // First, get the inventory item to get the stockId
    const inventory = await db.inventory.findUnique({
      where: { id },
      select: { stockId: true }
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    const stockId = inventory.stockId;

    // Get the full inventory item details
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

    // Get comprehensive history from InventoryHistory table
    const history = await db.inventoryHistory.findMany({
      where: {
        inventoryId: id
      },
      orderBy: {
        date: 'asc' // Show chronological order (oldest first)
      }
    });

    // If no history exists, create an initial IMPORT entry
    if (history.length === 0) {
      const initialEntry = await db.inventoryHistory.create({
        data: {
          inventoryId: id,
          stockId: stockId,
          operation: "IMPORT",
          referenceNo: "INITIAL",
          date: inventoryItem.createdAt,
          createdName: inventoryItem.createdBy.name || "System",
          companyName: "Mother's Aura",
          active: true,
          closed: false,
          wgt: inventoryItem.carat,
          rate: inventoryItem.askingAmount,
          discount: 0
        }
      });
      
      // Return comprehensive data including inventory details
      return NextResponse.json({
        inventory: {
          stockId: inventoryItem.stockId,
          shape: inventoryItem.shape,
          carat: inventoryItem.carat,
          color: inventoryItem.color,
          clarity: inventoryItem.clarity,
          cut: inventoryItem.cut,
          polish: inventoryItem.polish,
          symmetry: inventoryItem.symmetry,
          lab: inventoryItem.lab,
          status: inventoryItem.status,
          heldByCompany: inventoryItem.heldByCompany,
          pricePerCarat: inventoryItem.askingAmount,
          askingAmount: inventoryItem.askingAmount,
          location: inventoryItem.location
        },
        history: [initialEntry]
      });
    }

    // Return comprehensive data including inventory details
    return NextResponse.json({
      inventory: {
        stockId: inventoryItem.stockId,
        shape: inventoryItem.shape,
        carat: inventoryItem.carat,
        color: inventoryItem.color,
        clarity: inventoryItem.clarity,
        cut: inventoryItem.cut,
        polish: inventoryItem.polish,
        symmetry: inventoryItem.symmetry,
        lab: inventoryItem.lab,
        status: inventoryItem.status,
        heldByCompany: inventoryItem.heldByCompany,
        pricePerCarat: inventoryItem.askingAmount,
        askingAmount: inventoryItem.askingAmount,
        location: inventoryItem.location
      },
      history: history
    });
  } catch (error) {
    console.error("Error fetching diamond history:", error);
    
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
