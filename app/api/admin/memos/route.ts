import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendMemoEmailDetailed } from "@/lib/email";
import { jsPDF } from "jspdf";
const db = prisma as any;

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

    // For employees, only show memos they created
    if ((session.user as any)?.role === "EMPLOYEE") {
      where.createdById = session.user.id;
    }

    // Fetch all memos with related data
    const memos = await db.memo.findMany({
      where,
      select: {
        id: true,
        memoNumber: true,
        date: true,
        dueDate: true,
        totalDue: true,
        createdById: true,
        master: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(memos);
  } catch (error) {
    console.error("Error fetching memos:", error);
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

    // Create memo with items
    const memo = await db.memo.create({
      data: {
        memoNumber: data.memoNumber,
        date: new Date(data.date),
        dueDate: new Date(data.dueDate),
        paymentTerms: data.paymentTerms ? String(data.paymentTerms) : null,
        emailPdf: data.emailPdf,
        masterId: data.masterId,
        description: data.description,
        shipmentCost: data.shipmentCost,
        discount: data.discount,
        crPayment: data.crPayment,
        subtotal: data.subtotal,
        totalDue: data.totalDue,
        createdById: session.user.id,
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            carat: item.carat,
            color: item.color,
            clarity: item.clarity,
            lab: item.lab,
            reportNo: item.reportNo,
            pricePerCarat: item.pricePerCarat,
            total: item.total,
          }))
        }
      },
      include: {
        items: true,
        master: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // If emailPdf is true, send the memo email
    if (data.emailPdf && memo.master.email) {
      try {
        // Generate PDF from memo data
        const pdfBuffer = await generateMemoPDF(memo);
        
        // Send email with PDF attachment
        await sendMemoEmailDetailed({
          to: memo.master.email,
          customerName: memo.master.companyName,
          memoNo: memo.memoNumber,
          totalAmount: Number(memo.totalDue || 0),
          pdfBuffer
        });
      } catch (emailError) {
        console.error("Error sending memo email:", emailError);
        // Don't fail the memo creation if email fails
      }
    }

    return NextResponse.json({
      message: "Memo created successfully",
      memo,
    });
  } catch (error) {
    console.error("Error creating memo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateMemoPDF(memo: any) {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Memo header
  doc.setFontSize(20);
  doc.text("MEMO", 105, 20, { align: "center" });
  
  doc.setFontSize(16);
  doc.text(memo.memoNumber, 105, 30, { align: "center" });
  
  // Memo details
  doc.setFontSize(12);
  let yPos = 50;
  doc.text(`Date: ${new Date(memo.date).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Due Date: ${new Date(memo.dueDate).toLocaleDateString()}`, 20, yPos);
  yPos += 10;
  doc.text(`Company: ${memo.master.companyName}`, 20, yPos);
  yPos += 20;
  
  // Table headers
  doc.setFontSize(10);
  const tableHeaders = ["Description", "Carat", "Color", "Clarity", "Lab", "Report No", "Price/Ct", "Total"];
  const colWidths = [40, 15, 15, 15, 15, 20, 20, 20];
  let xPos = 20;
  
  tableHeaders.forEach((header, index) => {
    doc.text(header, xPos, yPos);
    xPos += colWidths[index];
  });
  
  yPos += 10;
  
  // Draw line under headers
  doc.line(20, yPos - 5, 190, yPos - 5);
  
  // Table data
  memo.items.forEach((item: any) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    xPos = 20;
    const rowData = [
      item.description,
      item.carat.toString(),
      item.color || '-',
      item.clarity || '-',
      item.lab || '-',
      item.reportNo || '-',
      `$${item.pricePerCarat.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ];
    
    rowData.forEach((data, index) => {
      doc.text(data, xPos, yPos);
      xPos += colWidths[index];
    });
    
    yPos += 8;
  });
  
  // Totals section
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Subtotal: $${memo.subtotal.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`Shipment Cost: $${memo.shipmentCost.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`Discount: $${memo.discount.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.text(`CR Payment: $${memo.crPayment.toFixed(2)}`, 150, yPos);
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Due: $${memo.totalDue.toFixed(2)}`, 150, yPos);
  
  return Buffer.from(doc.output('arraybuffer'));
}









