import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateMemoPDFBuffer, MemoData } from "@/lib/pdf-utils";

const db = prisma as any;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memo = await db.memo.findUnique({
      where: { id },
      include: { items: true, master: true },
    });

    if (!memo) {
      return new Response(JSON.stringify({ error: "Memo not found" }), {
        status: 404,
      });
    }

    const memoData: MemoData = {
      id: memo.id,
      memoNo: memo.memoNumber,
      date: new Date(memo.date),
      dueDate: new Date(memo.dueDate),
      paymentTerms: Number(memo.paymentTerms || 0),
      companyName: memo.master.companyName,
      addressLine1: memo.master.addressLine1 || "",
      addressLine2: memo.master.addressLine2 || null,
      city: memo.master.city || "",
      state: memo.master.state || "",
      country: memo.master.country || "",
      postalCode: memo.master.postalCode || "",
      description: memo.description || null,
      amountInWords: "",
      subtotal: Number(memo.subtotal || 0),
      discount: Number(memo.discount || 0),
      crPayment: Number(memo.crPayment || 0),
      shipmentCost: Number(memo.shipmentCost || 0),
      totalAmount: Number(memo.totalDue || 0),
      items: memo.items.map((it: any) => ({
        id: it.id,
        description: it.description || "",
        carat: Number(it.carat || 0),
        color: it.color || "",
        clarity: it.clarity || "",
        lab: it.lab || "",
        reportNo: it.reportNo || "",
        pricePerCarat: Number(it.pricePerCarat || 0),
        total: Number(it.total || 0),
      })),
    };

    const pdfBuffer = await generateMemoPDFBuffer(memoData);
    const safeNo = String(memo.memoNumber || "").replace(/[\/?]/g, "-");

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Memo-${safeNo}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Memo PDF error:", e);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
    });
  }
}
