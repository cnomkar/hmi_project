'use client';

import { jsPDF } from 'jspdf';
import type { Invoice } from '@/lib/types';
import { formatMoney } from '@/components/common';

function totalForInvoice(invoice: Invoice) {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * invoice.taxRate;
  return { subtotal, tax, total: subtotal + tax };
}

export function downloadInvoicePdf(invoice: Invoice) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const { subtotal, tax, total } = totalForInvoice(invoice);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('FreelanceFlow Invoice', 40, 56);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice: ${invoice.pdfLabel ?? invoice.id}`, 40, 78);
  pdf.text(`Client: ${invoice.clientName}`, 40, 94);
  pdf.text(`Freelancer: ${invoice.freelancerName}`, 40, 110);
  pdf.text(`Status: ${invoice.status}`, 40, 126);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Line items', 40, 160);
  pdf.setFont('helvetica', 'normal');

  let y = 182;
  invoice.lineItems.forEach(item => {
    pdf.text(item.title, 40, y);
    pdf.text(`${item.quantity} x ${formatMoney(item.rate)}`, 320, y);
    pdf.text(formatMoney(item.quantity * item.rate), 470, y);
    y += 18;
    pdf.setFontSize(9);
    pdf.text(item.description, 40, y);
    pdf.setFontSize(11);
    y += 22;
  });

  pdf.setFont('helvetica', 'bold');
  pdf.text(`Subtotal: ${formatMoney(subtotal)}`, 40, y + 20);
  pdf.text(`GST (${Math.round(invoice.taxRate * 100)}%): ${formatMoney(tax)}`, 40, y + 38);
  pdf.text(`Total: ${formatMoney(total)}`, 40, y + 58);

  pdf.save(`${invoice.pdfLabel ?? invoice.id}.pdf`);
}

export function downloadInvoiceBundle(invoices: Invoice[]) {
  invoices.forEach(invoice => downloadInvoicePdf(invoice));
}
