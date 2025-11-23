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
  customerName: string;
  items: Item[];
}

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  quoteId,
  customerName,
  items,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTATION", 190, 20, { align: "right" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Ref: #${quoteId}`, 20, 30);
    doc.text(`To: ${customerName}`, 20, 40);

    // Table
    const tableData = items.map((item) => [
      item.qty,
      item.description,
      `$${item.price.toFixed(2)}`,
      `$${(item.qty * item.price).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [["Qty", "Description", "Unit Price", "Total"]],
      body: tableData,
      startY: 50,
    });

    // Footer
    const grandTotal = items.reduce((total, item) => total + item.qty * item.price, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 190, doc.lastAutoTable.finalY + 20, { align: "right" });

    // Save
    doc.save(`quote-${quoteId}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
    >
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </button>
  );
};

export default GeneratePdfButton;
