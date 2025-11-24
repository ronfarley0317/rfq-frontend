"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

interface Item {
  qty: number;
  description: string;
  price: number;
}

interface GeneratePdfButtonProps {
  quoteId: string;
  quoteNumber: number;
  customerName: string;
  items: Item[];
  tax?: number;
}

// We need to extend jsPDF to include the lastAutoTable property
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  quoteId,
  quoteNumber,
  customerName,
  items,
  tax = 0,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Midwest HVAC Automation", margin, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("123 Industry Rd, Ohio", margin, 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Quote", pageWidth - margin, 20, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Quote # ${quoteNumber}`, pageWidth - margin, 28, { align: "right" });
    doc.text(`Date: ${formattedDate}`, pageWidth - margin, 34, { align: "right" });


    // Customer Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Bill To:", margin, 50);
    doc.setFont("helvetica", "normal");
    doc.text(customerName, margin, 56);
    
    // Line Items Table
    const tableData = items.length > 0
      ? items.map((item, index) => [
          index + 1,
          item.description,
          item.qty,
          `$${item.price.toFixed(2)}`,
          `$${(item.qty * item.price).toFixed(2)}`,
        ])
      : [[1, "No items", 0, "$0.00", "$0.00"]];

    autoTable(doc, {
      head: [["Item", "Description", "Qty", "Unit Price", "Total"]],
      body: tableData,
      startY: 70,
      headStyles: {
        fillColor: [230, 230, 230], // Light Gray
        textColor: [20, 20, 20],
      },
      theme: 'grid',
    });

    // Anchor point after table
    const finalY = doc.lastAutoTable.finalY || 60;

    // Totals Section
    const subtotal = items.reduce((total, item) => total + item.qty * item.price, 0);
    const grandTotal = subtotal + tax;

    const totalsX = pageWidth - margin;
    let totalsY = finalY + 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", totalsX - 30, totalsY, { align: 'left' });
    doc.text(`$${subtotal.toFixed(2)}`, totalsX, totalsY, { align: "right" });

    totalsY += 10;
    doc.text("Tax:", totalsX - 30, totalsY, { align: 'left' });
    doc.text(`$${tax.toFixed(2)}`, totalsX, totalsY, { align: "right" });

    totalsY += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", totalsX - 50, totalsY, { align: 'left' });
    doc.text(`$${grandTotal.toFixed(2)}`, totalsX, totalsY, { align: "right" });
    
    // Signature Section
    const signatureY = finalY + 60;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.line(20, signatureY, 100, signatureY);
    doc.text("Authorized Signature", 20, signatureY + 5);

    doc.line(120, signatureY, 170, signatureY);
    doc.text("Date", 120, signatureY + 5);

    // Terms
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Valid for 30 days. Payment terms Net 30.",
      margin,
      pageHeight - 10
    );

    // Save
    doc.save(`quote-${quoteId}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-colors flex items-center"
    >
      <Download className="w-4 h-4 mr-2" />
      Generate PDF
    </button>
  );
};

export default GeneratePdfButton;