import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendMemoEmailDetailed } from "@/lib/email";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as fs from "fs";
import * as path from "path";
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
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  let yPos = 15;
  
  // Try to load logo - use URL in production/serverless environments
  try {
    // Try filesystem first (works in dev)
    let logoPath = path.join(process.cwd(), 'public', 'logoWithDescbg.png');
    let logoFormat = 'PNG';
    let logoBase64: string | null = null;
    
    if (typeof fs.existsSync === 'function' && fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,` + logoData.toString('base64');
    } else {
      // Fallback: try logo.jpg
      logoPath = path.join(process.cwd(), 'public', 'logo.jpg');
      if (typeof fs.existsSync === 'function' && fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        logoFormat = 'JPEG';
        logoBase64 = `data:image/jpeg;base64,` + logoData.toString('base64');
      }
    }
    
    // If filesystem failed, try fetching from URL
    if (!logoBase64) {
      const logoUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/logoWithDescbg.png`
        : 'https://mothersauradiamonds.com/logoWithDescbg.png';
      
      try {
        const response = await fetch(logoUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          logoBase64 = `data:image/png;base64,` + buffer.toString('base64');
        }
      } catch (fetchError) {
        console.log('Could not fetch logo from URL:', fetchError);
      }
    }
    
    if (logoBase64) {
      doc.addImage(logoBase64, logoFormat, 105 - 12, yPos, 24, 24, undefined, 'FAST');
    }
  } catch (error) {
    console.log('Could not load logo:', error);
    // Continue without logo if it fails
  }
  
  yPos += 30;
  
  // Address
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('203-Bhav resiedency, Thane 421304 India', 105, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Memo Number and Date Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Memo No: ${memo.memoNumber}`, 20, yPos);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateX = 190;
  doc.text(`Date: ${new Date(memo.date).toLocaleDateString()}`, dateX, yPos, { align: 'right' });
  yPos += 7;
  doc.text(`Due Date: ${new Date(memo.dueDate).toLocaleDateString()}`, dateX, yPos, { align: 'right' });
  yPos += 7;
  doc.text(`Payment Terms: ${memo.paymentTerms} days`, dateX, yPos, { align: 'right' });
  
  yPos += 12;
  
  // To Address
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('To:', 20, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(memo.master.companyName, 20, yPos);
  yPos += 6;
  if (memo.master.addressLine1) {
    doc.text(memo.master.addressLine1, 20, yPos);
    yPos += 6;
  }
  if (memo.master.addressLine2) {
    doc.text(memo.master.addressLine2, 20, yPos);
    yPos += 6;
  }
  const addressLine = `${memo.master.city || ''}, ${memo.master.state || ''} ${memo.master.postalCode || ''}`.trim();
  if (addressLine) {
    doc.text(addressLine, 20, yPos);
    yPos += 6;
  }
  if (memo.master.country) {
    doc.text(memo.master.country, 20, yPos);
    yPos += 6;
  }
  
  yPos += 8;
  
  // Memorandum Heading
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text('Memorandum', 105, yPos, { align: 'center' });
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(90, yPos, 120, yPos);
  yPos += 8;
  
  // Table data preparation
  const tableData = memo.items.map((item: any) => [
    item.description || '-',
    item.carat.toString() || '-',
    `${item.color || ''} ${item.clarity || ''}`.trim() || '-',
    item.lab || '-',
    item.reportNo || '-',
    `$${Number(item.pricePerCarat || 0).toFixed(2)}`,
    `$${Number(item.total || 0).toFixed(2)}`
  ]);
  
  // Add Grand Total row
  tableData.push([
    { content: 'Grand Total:', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
    { content: `$${Number(memo.subtotal || 0).toFixed(2)}`, styles: { halign: 'right', fontStyle: 'bold' } }
  ]);
  
  // Create table with autoTable
  autoTable(doc, {
    head: [['Description', 'Carat', 'Color & Clarity', 'Lab', 'Report No.', 'Price/ct (USD)', 'Total (USD)']],
    body: tableData,
    startY: yPos,
    theme: 'grid',
    headStyles: {
      fillColor: [230, 243, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 'auto', halign: 'center' },
      2: { cellWidth: 'auto', halign: 'left' },
      3: { cellWidth: 'auto', halign: 'center' },
      4: { cellWidth: 'auto', halign: 'center' },
      5: { cellWidth: 'auto', halign: 'right' },
      6: { cellWidth: 'auto', halign: 'right' },
    },
    margin: { left: 20, right: 20 },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Account Details and Financial Summary side by side
  const leftX = 20;
  const rightX = 110;
  const boxWidth = 80;
  
  // Account Details Box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(leftX, yPos, boxWidth, 50);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('ACCOUNT DETAILS', leftX + 5, yPos + 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let accountY = yPos + 15;
  doc.text('BENEFICIARY NAME - MOTHERS AURA', leftX + 5, accountY);
  accountY += 5;
  doc.text('BANK NAME - CITIBANK', leftX + 5, accountY);
  accountY += 5;
  doc.text('ADDRESS - 111 WALL STREET,', leftX + 5, accountY);
  accountY += 5;
  doc.text('NEW YORK, NY 10043 USA', leftX + 20, accountY);
  accountY += 5;
  doc.text('SWIFT - CITIUS33', leftX + 5, accountY);
  accountY += 5;
  doc.text('ACCOUNT NUMBER - 70585610001874252', leftX + 5, accountY);
  accountY += 5;
  doc.text('ACCOUNT TYPE - CHECKING', leftX + 5, accountY);
  
  // Financial Summary
  let summaryY = yPos + 5;
  doc.setFontSize(10);
  doc.text('Subtotal:', rightX, summaryY, { align: 'right' });
  doc.text(`$${Number(memo.subtotal || 0).toFixed(2)}`, 190, summaryY, { align: 'right' });
  summaryY += 7;
  
  if (Number(memo.discount || 0) > 0) {
    doc.text('Discount:', rightX, summaryY, { align: 'right' });
    doc.text(`$${Number(memo.discount || 0).toFixed(2)}`, 190, summaryY, { align: 'right' });
    summaryY += 7;
  }
  
  if (Number(memo.crPayment || 0) > 0) {
    doc.text('CR Payment:', rightX, summaryY, { align: 'right' });
    doc.text(`$${Number(memo.crPayment || 0).toFixed(2)}`, 190, summaryY, { align: 'right' });
    summaryY += 7;
  }
  
  if (Number(memo.shipmentCost || 0) > 0) {
    doc.text('Shipping:', rightX, summaryY, { align: 'right' });
    doc.text(`$${Number(memo.shipmentCost || 0).toFixed(2)}`, 190, summaryY, { align: 'right' });
    summaryY += 7;
  }
  
  doc.setDrawColor(0, 0, 0);
  doc.line(rightX, summaryY, 190, summaryY);
  summaryY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text('Total Due:', rightX, summaryY, { align: 'right' });
  doc.text(`$${Number(memo.totalDue || 0).toFixed(2)}`, 190, summaryY, { align: 'right' });
  
  yPos += 60;
  
  // Disclaimer
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text('DISCLAIMER:', 20, yPos);
  yPos += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const disclaimerLines = [
    '1. The goods invoiced herein above are LABORATORY GROWN DIAMONDS. These laboratory grown diamonds are optically, chemically physically identical to mined diamonds.',
    '2. All subsequent future sale of these diamonds must be accompanies by disclosure of their origin as LABORATORY GROWN DIAMONDS.',
    '3. These goods remain the property of the seller until full payment is received. Full payment only transfers the ownership, regardless the conditions of this memo. In case the purchaser takes delivery of goods prior to full payment he will be considered, not as owner, whilst purchaser remains fully liable for any loss or damage.'
  ];
  
  disclaimerLines.forEach(line => {
    const splitLines = doc.splitTextToSize(line, 170);
    splitLines.forEach((textLine: string) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(textLine, 20, yPos);
      yPos += 5;
    });
    yPos += 2;
  });
  
  yPos += 5;
  
  // Signature Section
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  const signatureY = yPos;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, signatureY, 95, signatureY);
  doc.line(115, signatureY, 190, signatureY);
  
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text('For Mothers Aura Diamonds', 20, yPos);
  yPos += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text('Authorized Signatory', 20, yPos);
  
  yPos = signatureY + 10;
  doc.setFontSize(9);
  doc.text(`For ${memo.master.companyName}`, 190, yPos, { align: 'right' });
  yPos += 5;
  doc.setFontSize(8);
  doc.text('Customer Signatory', 190, yPos, { align: 'right' });
  
  yPos += 10;
  
  // Footer Text
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  const footerText = 'The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and are compliance with United Nations Resolutions. I hereby guarantee that these diamonds are conflict free, based on personal knowledge and/ or written guarantees provided by the supplier of these diamonds. Mothers aura diamonds deals only in Lab Grown Diamonds. All diamonds invoiced are Lab Grown Diamonds immaterial if its certified or non-certified.\n\nReceived the above goods on the terms and conditions set out';
  
  const footerLines = doc.splitTextToSize(footerText, 170);
  footerLines.forEach((line: string) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 20, yPos);
    yPos += 4;
  });
  
  return Buffer.from(doc.output('arraybuffer'));
}









