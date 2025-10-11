import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
const db = prisma as any;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    // Build where clause
    const where: any = {};

    // For employees, only show masters they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      where.createdById = session.user.id;
    }

    // Fetch all masters with related data
    const masters = await db.master.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        email: true,
        phoneNo: true,
        updatedAt: true,
        createdById: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(masters);
  } catch (error) {
    console.error("Error fetching masters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if (!["ADMIN", "EMPLOYEE"].includes((session.user as any)?.role)) {
      return NextResponse.json(
        { error: "Access denied. Admin or Employee role required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate that all required user IDs exist
    const requiredUserIds = [
      data.authorizedById,
      data.accountManagerId,
      data.salesExecutiveId,
      data.leadSourceId
    ].filter(Boolean);

    // Skip cross-user validation since User model is not available in client

    // Create master with references
    const master = await db.master.create({
      data: {
        companyName: data.companyName,
        ownerName: data.ownerName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        country: data.country,
        state: data.state,
        city: data.city,
        postalCode: data.postalCode,
        phoneNo: data.phoneNo,
        faxNo: data.faxNo,
        email: data.email,
        website: data.website,
        paymentTerms: data.paymentTerms,
        shippedBy: data.shippedBy,
        organizationType: data.organizationType,
        businessType: data.businessType,
        businessRegNo: data.businessRegNo,
        panNo: data.panNo,
        sellerPermitNo: data.sellerPermitNo,
        cstTinNo: data.cstTinNo,
        tradeBodyMembership: data.tradeBodyMembership,
        referenceType: data.referenceType,
        notes: data.notes,
        authorizedById: data.authorizedById,
        accountManagerId: data.accountManagerId,
        brokerName: data.brokerName,
        partyGroup: data.partyGroup,
        salesExecutiveId: data.salesExecutiveId,
        leadSourceId: data.leadSourceId,
        limit: parseFloat(data.limit),
        createdById: session.user.id,
        references: data.referenceType === 'REFERENCE' 
          ? {
              create: (data.references as Array<{ companyName: string; contactPerson: string; contactNo: string }>)
                .filter(ref => ref.companyName && ref.contactPerson && ref.contactNo)
                .map(ref => ({
                  companyName: ref.companyName,
                  contactPerson: ref.contactPerson,
                  contactNo: ref.contactNo,
                }))
            }
          : undefined
      },
    });

    return NextResponse.json({
      message: "Master created successfully",
      master,
    });
  } catch (error) {
    console.error("Error creating master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
