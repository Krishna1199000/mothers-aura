"use client";

// Copy the entire content from app/admin/invoices/[id]/page.tsx and replace:
// - "invoice" with "memo"
// - "Invoice" with "Memo"
// - "invoices" with "memos"
// - "MA-" with "MAM-"
// - "Annexure" with "Memorandum"

// The rest of the code structure and styling remains exactly the same
// This ensures consistent styling and behavior between invoices and memos

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface MemoItem {
  id: string;
  description: string;
  carat: number;
  color: string;
  clarity: string;
  lab: string;
  reportNo: string;
  pricePerCarat: number;
  total: number;
}

interface Master {
  id: string;
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Memo {
  id: string;
  memoNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: number;
  emailPdf: boolean;
  master: Master;
  items: MemoItem[];
  description?: string;
  shipmentCost: number;
  discount: number;
  crPayment: number;
  subtotal: number;
  totalDue: number;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function MemoViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMemo = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/memos/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMemo(data);
      } else {
        setError("Failed to fetch memo details");
      }
    } catch {
      setError("Error loading memo details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
      return;
    }
    
    fetchMemo();
  }, [session, status, router, fetchMemo]);

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      console.log('Starting PDF download...');
      
      const content = document.getElementById('memo-content');
      if (!content) {
        throw new Error('Memo content not found');
      }

      // Import jsPDF and html2canvas
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas-oklch')).default;

      console.log('Libraries loaded successfully');

      // Create a clone of the content
      const contentClone = content.cloneNode(true) as HTMLElement;
      
      // Set styles for the clone
      contentClone.style.position = 'absolute';
      contentClone.style.top = '-9999px';
      contentClone.style.left = '-9999px';
      contentClone.style.width = '210mm';
      contentClone.style.minHeight = '297mm';
      contentClone.style.margin = '0';
      contentClone.style.padding = '15mm';
      contentClone.style.boxSizing = 'border-box';
      contentClone.style.backgroundColor = '#ffffff';
      contentClone.style.fontFamily = 'Arial, sans-serif';

      // Convert logo to data URL in clone to ensure it renders in the PDF
      try {
        const originalLogo = content.querySelector('img[alt="Logo"]') as HTMLImageElement | null;
        const clonedLogo = contentClone.querySelector('img[alt="Logo"]') as HTMLImageElement | null;
        if (originalLogo && clonedLogo) {
          if (originalLogo.complete && originalLogo.naturalWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = originalLogo.naturalWidth;
            canvas.height = originalLogo.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(originalLogo, 0, 0);
              const dataUrl = canvas.toDataURL('image/png');
              clonedLogo.src = dataUrl;
            }
          }
        }
      } catch (e) {
        console.warn('Logo data URL conversion failed:', e);
      }

      // Add the clone to the document temporarily
      document.body.appendChild(contentClone);

      try {
        console.log('Generating canvas...');
        
        // Create canvas with optimized settings
        const canvas = await html2canvas(contentClone, {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: contentClone.offsetWidth,
          height: contentClone.offsetHeight,
          scrollX: 0,
          scrollY: 0
        });

        console.log('Canvas generated:', canvas.width, 'x', canvas.height);

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions to fit A4
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);

        // Calculate scaling to fit content
        const scaleX = contentWidth / canvas.width;
        const scaleY = contentHeight / canvas.height;
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;

        // Center the content
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

        // Save PDF
        const fileName = `Memo-${memo?.memoNumber || 'Unknown'}.pdf`;
        pdf.save(fileName);
        
        console.log('PDF saved successfully:', fileName);
        
      } catch (canvasError) {
        console.error('Canvas generation error:', canvasError);
        alert('Error generating PDF canvas. Please try again.');
      } finally {
        // Clean up
        if (contentClone && contentClone.parentNode) {
          contentClone.parentNode.removeChild(contentClone);
        }
        setIsDownloading(false);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    try {
      setIsPrinting(true);
      window.print();
    } catch (error) {
      console.error('Error printing:', error);
      alert('Error printing. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const sendEmailWithPreviewPdf = async () => {
    try {
      setIsEmailing(true);
      // Let the server generate the PDF to avoid large payloads
      const res = await fetch('/api/admin/memos/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoId: id })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Email Sent', { description: 'Memo email sent successfully to customer' });
    } catch (err) {
      console.error(err);
      toast.error('Email Failed', { description: err instanceof Error ? err.message : 'Failed to send memo email' });
    } finally {
      setIsEmailing(false);
    }
  };



  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error || !memo) {
    return (
      <div className="min-h-screen bg-background">
      <AnnouncementBar />
        
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Memo not found"}</AlertDescription>
          </Alert>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print">
        <AnnouncementBar />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header - Hidden in print */}
          <div className="no-print flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/memos')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Memo Details</h1>
                <p className="text-muted-foreground">
                  View and print memo
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handlePrint}
                disabled={isPrinting || isDownloading}
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'Printing...' : 'Print Memo'}
              </Button>
              <Button 
                onClick={downloadPDF} 
                variant="secondary"
                disabled={isPrinting || isDownloading || isEmailing}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button 
                onClick={sendEmailWithPreviewPdf}
                variant="default"
                disabled={isPrinting || isDownloading || isEmailing}
              >
                {isEmailing ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>

          {/* Print Styles */}
          <style jsx global>{`
            @page {
              size: A4;
              margin: 0 !important;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                font-size: 12px !important;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              .print-only { display: block !important; }
              .page-break { page-break-before: always; }
              
              /* Hide print/download buttons and related text */
              .print-download-section,
              .print-download-text,
              button,
              .button-container,
              .action-buttons {
                display: none !important;
              }
              /* Ensure single page fit and prevent stray images */
              html, body { height: auto !important; overflow: hidden !important; }
              #memo-content { page-break-before: avoid; page-break-after: avoid; page-break-inside: avoid; width: 190mm !important; min-height: 277mm !important; margin: 0 auto !important; zoom: 0.95; }
              /* Hide any images that might be outside the main content (e.g., favicon previews) */
              body > img { display: none !important; }
              
              /* Hide browser-generated content */
              @page {
                margin: 0 !important;
                size: A4 !important;
              }
              
              /* Remove browser headers and footers */
              html, body {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              /* Hide any browser-generated URL or page info */
              body::before,
              body::after,
              html::before,
              html::after {
                display: none !important;
              }
              
          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
            margin-bottom: 1rem;
            table-layout: fixed;
          }
          tr { 
            page-break-inside: avoid; 
            page-break-after: auto; 
          }
          th, td {
            border: 1px solid #000;
            padding: 1px 2px;
            text-align: left;
            font-size: 8px !important;
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.1;
          }
          th { 
            background-color: #e6f3ff !important;
            font-weight: bold;
            font-size: 8px !important;
            white-space: nowrap;
          }
          td:first-child { width: 20%; }  /* Description */
          td:nth-child(2) { width: 7%; } /* Carat */
          td:nth-child(3) { width: 12%; } /* Color & Clarity */
          td:nth-child(4) { width: 7%; } /* Lab */
          td:nth-child(5) { width: 12%; } /* Report No */
          td:nth-child(6) { width: 15%; } /* Price/ct */
          td:nth-child(7) { width: 17%; } /* Total */

          /* Compact text */
          .text-xs { font-size: 8px !important; }
          .text-sm { font-size: 9px !important; }
          p { margin: 0 0 0.3em 0 !important; }
          .mb-8 { margin-bottom: 0.3rem !important; }
          .mb-6 { margin-bottom: 0.2rem !important; }
          .mb-4 { margin-bottom: 0.15rem !important; }
          .mb-2 { margin-bottom: 0.1rem !important; }
          .space-y-1 > * + * { margin-top: 0.1rem !important; }
          
          /* Optimize main container spacing */
          #memo-content {
            padding: 8mm !important;
            margin: 0 !important;
          }
          
          /* Reduce header spacing */
          .memo-header {
            margin-bottom: 0.2rem !important;
          }
          
          /* Optimize table spacing */
          table {
            margin-bottom: 0.2rem !important;
          }

              /* Logo */
              img {
                width: 112px !important;
                height: 112px !important;
                object-fit: cover;
                border-radius: 8px;
                background-color: white !important;
              }
              .logo-container {
                background-color: white !important;
                padding: 8px;
                border-radius: 8px;
                display: inline-block;
                margin-bottom: 8px;
              }

              /* Layout */
              #memo-content {
                max-width: 100%;
                margin: 0 auto;
                background-color: white !important;
              }

              /* Text */
              .text-sm { font-size: 12px; }
              .text-xs { font-size: 10px; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .text-center { text-align: center; }

              /* Spacing */
              .mb-8 { margin-bottom: 2rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .space-y-1 > * + * { margin-top: 0.25rem; }
              .p-8 { padding: 2rem; }

              /* Colors */
              .text-muted-foreground { color: #666 !important; }
              .bg-background { background-color: white !important; }
              .bg-white { background-color: white !important; }
            }
          `}</style>

          {/* Memo Content */}
          <Card>
            <CardContent className="p-8" id="memo-content">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="bg-white p-2 rounded-lg inline-block mb-2">
                  <Image
                    src="/logoNamebg.png" 
                    alt="Logo" 
                    width={96}
                    height={96}
                    className="mx-auto w-24 h-24 object-contain print:w-28 print:h-28"
                    unoptimized
                  />
                </div>
                <p className="text-sm text-muted-foreground font-semibold underline">
                <a
  href="https://www.mothersauradiamonds.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm font-semibold text-muted-foreground hover:text-[#0077b6] hover:underline transition-colors duration-300"
>
  www.mothersauradiamonds.com
</a>

</p>
                <p className="text-sm text-muted-foreground">
                  203-Bhav resiedency, Thane 421304 India
                </p>
              </div>

              {/* Memo Details */}
              <div className="flex justify-between items-start mb-8">
                {/* Memo Number - Left */}
                <div>
                  <h2 className="font-bold">Memo No: {memo.memoNumber}</h2>
                </div>

                {/* Date Details - Right */}
                <div className="text-right">
                  <p>Date: {new Date(memo.date).toLocaleDateString()}</p>
                  <p>Due Date: {new Date(memo.dueDate).toLocaleDateString()}</p>
                  <p>Payment Terms: {memo.paymentTerms} days</p>
                </div>
              </div>

              {/* To Address */}
              <div className="mb-8">
                <h3 className="font-bold">To:</h3>
                <div>
                  <p>{memo.master.companyName}</p>
                  <p>{memo.master.addressLine1}</p>
                  {memo.master.addressLine2 && <p>{memo.master.addressLine2}</p>}
                  <p>{memo.master.city}, {memo.master.state} {memo.master.postalCode}</p>
                  <p>{memo.master.country}</p>
                </div>
              </div>

          {/* Memorandum Table */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Memorandum</h3>
              <div className="w-24 h-0.5 bg-gray-300 mx-auto mt-2"></div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#e6f3ff]">
                  <th className="border border-gray-300 p-2 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 p-2 text-center font-semibold">Carat</th>
                  <th className="border border-gray-300 p-2 text-left font-semibold">Color & Clarity</th>
                  <th className="border border-gray-300 p-2 text-center font-semibold">Lab</th>
                  <th className="border border-gray-300 p-2 text-center font-semibold">Report No.</th>
                  <th className="border border-gray-300 p-2 text-right font-semibold">Price/ct (USD)</th>
                  <th className="border border-gray-300 p-2 text-right font-semibold">Total (USD)</th>
                </tr>
              </thead>
                  <tbody>
                    {memo.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 p-2">{item.description}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.carat}</td>
                        <td className="border border-gray-300 p-2">{item.color} {item.clarity}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.lab}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.reportNo}</td>
                        <td className="border border-gray-300 p-2 text-right">${item.pricePerCarat.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={6} className="border border-gray-300 p-2 text-right font-bold">Grand Total:</td>
                      <td className="border border-gray-300 p-2 text-right font-bold">${memo.subtotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Account Details and Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Account Details */}
                <div className="border border-gray-300 p-4">
                  <h4 className="font-bold mb-3">ACCOUNT DETAILS</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>BENEFICIARY NAME</strong> - MOTHERS AURA</p>
                    <p><strong>BANK NAME</strong> - CITIBANK</p>
                    <p><strong>ADDRESS</strong> - 111 WALL STREET,</p>
                    <p className="ml-16">NEW YORK, NY 10043 USA</p>
                    <p><strong>SWIFT</strong> - CITIUS33</p>
                    <p><strong>ACCOUNT NUMBER</strong> - 70585610001874252</p>
                    <p><strong>ACCOUNT TYPE</strong> - CHECKING</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${memo.subtotal.toFixed(2)}</span>
                  </div>
                  {memo.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>${memo.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {memo.crPayment > 0 && (
                    <div className="flex justify-between">
                      <span>CR Payment:</span>
                      <span>${memo.crPayment.toFixed(2)}</span>
                    </div>
                  )}
                  {memo.shipmentCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${memo.shipmentCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Due:</span>
                      <span>${memo.totalDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mb-6">
                <h4 className="font-bold mb-2">DISCLAIMER:</h4>
                <div className="text-xs space-y-1">
                  <p>1. The goods invoiced herein above are LABORATORY GROWN DIAMONDS. These laboratory grown diamonds are optically, chemically physically identical to mined diamonds.</p>
                  <p>2. All subsequent future sale of these diamonds must be accompanies by disclosure of their origin as LABORATORY GROWN DIAMONDS.</p>
                  <p>3. These goods remain the property of the seller until full payment is received. Full payment only transfers the ownership, regardless the conditions of this memo. In case the purchaser takes delivery of goods prior to full payment he will be considered, not as owner, whilst purchaser remains fully liable for any loss or damage.</p>
                </div>
              </div>

               {/* Signature Section */}
               <div className="flex justify-between items-end mb-6 mt-8">
                 <div className="text-left flex-1 mr-8">
                   <div className="border-b border-black w-full mb-4 h-8"></div>
                   <p className="text-sm font-semibold">For Mothers Aura Diamonds</p>
                   <p className="text-xs">Authorized Signatory</p>
                 </div>
                 <div className="text-right flex-1 ml-8">
                   <div className="border-b border-black w-full mb-4 h-8"></div>
                   <p className="text-sm">For {memo?.master?.companyName}</p>
                   <p className="text-xs">Customer Signatory</p>
                 </div>
               </div>

              {/* Footer Text */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and are compliance with United Nations Resolutions. I hereby guarantee that these diamonds are conflict free, based on personal knowledge and/ or written guarantees provided by the supplier of these diamonds. Mothers aura diamonds deals only in Lab Grown Diamonds. All diamonds invoiced are Lab Grown Diamonds immaterial if its certified or non-certified.</p>
                <br />
                <p>Received the above goods on the terms and conditions set out</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}
