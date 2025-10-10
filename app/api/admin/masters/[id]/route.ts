import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
const db = prisma as any;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if ((session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const master = await db.master.findUnique({
      where: { id },
      include: {
        references: true,
      },
    });

    if (!master) {
      return NextResponse.json(
        { error: "Master not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(master);
  } catch (error) {
    console.error("Error fetching master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if ((session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Update master
    const master = await db.master.update({
      where: { id },
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
      },
    });

    // Update references
    if (data.referenceType === 'REFERENCE') {
      // Delete existing references
      await db.reference.deleteMany({
        where: { masterId: id },
      });

      // Create new references
      await db.reference.createMany({
        data: data.references
          .filter((ref: { companyName?: string; contactPerson?: string; contactNo?: string }) => ref.companyName && ref.contactPerson && ref.contactNo)
          .map((ref: { companyName: string; contactPerson: string; contactNo: string }) => ({
            masterId: id,
            companyName: ref.companyName,
            contactPerson: ref.contactPerson,
            contactNo: ref.contactNo,
          })),
      });
    }

    return NextResponse.json({
      message: "Master updated successfully",
      master,
    });
  } catch (error) {
    console.error("Error updating master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Authorize using role from session token
    if ((session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    // Delete references first
    await db.reference.deleteMany({
      where: { masterId: id },
    });

    // Delete master
    await db.master.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Master deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting master:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}






