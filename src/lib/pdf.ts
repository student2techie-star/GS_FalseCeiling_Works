import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
// import { supabase } from './supabase';

export async function generateDocumentPDF(docType: 'Quotation' | 'Invoice' | 'Receipt', data: any, profile: any) {
  const doc = new jsPDF();
  
  // Custom font for Rupee symbol would be loaded here.
  // Example: doc.addFileToVFS("NotoSans-Regular.ttf", base64Font);
  // doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
  // doc.setFont("NotoSans");

  // 1. Header
  doc.setFontSize(20);
  doc.text(profile.name || 'GS False Ceiling Works', 14, 20);
  
  doc.setFontSize(10);
  doc.text(profile.address || '', 14, 28);
  doc.text(`Phone: ${profile.contact || ''}`, 14, 34);
  if (profile.gstin) {
    doc.text(`GSTIN: ${profile.gstin}`, 14, 40);
  }

  // Document Title
  doc.setFontSize(16);
  doc.text(docType.toUpperCase(), 150, 20);
  
  doc.setFontSize(10);
  doc.text(`No: ${data.number || 'DRAFT'}`, 150, 28);
  doc.text(`Date: ${data.date}`, 150, 34);

  // 2. Bill To
  doc.text('Bill To:', 14, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(data.customer_name || 'Customer Name', 14, 61);
  doc.setFont('helvetica', 'normal');
  doc.text(data.site_name || 'Site Address', 14, 67);

  // 3. Table
  const tableData: any[] = [];
  // Example loop if data.rooms exists:
  // for (const room of data.rooms) {
  //   tableData.push([{ content: room.name, colSpan: 5, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
  //   for (const item of room.items) {
  //     tableData.push([item.description, item.quantity + ' ' + item.unit, item.rate, item.discount, (item.quantity * item.rate - item.discount).toFixed(2)]);
  //   }
  // }

  (doc as any).autoTable({
    startY: 80,
    head: [['Description', 'Qty', 'Rate', 'Disc', 'Amount']],
    body: tableData.length > 0 ? tableData : [['Item 1', '10 sq ft', '100', '0', '1000']],
    theme: 'grid',
    headStyles: { fillColor: [14, 26, 43] }, // --ink color
  });

  // 4. Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Subtotal: ${data.subtotal || 0}`, 150, finalY);
  doc.text(`Tax: ${data.tax_amount || 0}`, 150, finalY + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${data.grand_total || 0}`, 150, finalY + 12);
  doc.setFont('helvetica', 'normal');

  // 5. Payment details (QR Code)
  if (profile.upi_id) {
    try {
      const upiUrl = `upi://pay?pa=${profile.upi_id}&pn=${encodeURIComponent(profile.name)}&am=${data.grand_total}&cu=INR`;
      const qrDataUrl = await QRCode.toDataURL(upiUrl, { width: 100, margin: 1 });
      doc.addImage(qrDataUrl, 'PNG', 14, finalY, 30, 30);
      doc.text(`Scan to pay via UPI (${profile.upi_id})`, 14, finalY + 35);
    } catch (err) {
      console.error("QR Code generation failed", err);
    }
  }

  // 6. Terms
  doc.setFontSize(8);
  doc.text("Terms & Conditions:", 14, 270);
  const splitTerms = doc.splitTextToSize(profile.terms || '', 180);
  doc.text(splitTerms, 14, 275);

  doc.save(`${docType.toLowerCase()}-${data.number || 'draft'}.pdf`);
}
