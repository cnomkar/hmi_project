'use client';

import { useMemo, useState } from 'react';
import { Download, FileDown, FileText, Printer } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';
import { downloadInvoiceBundle, downloadInvoicePdf } from '@/lib/pdf';
import type { Invoice } from '@/lib/types';

function invoiceAmount(invoice: Invoice) {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  return subtotal + subtotal * invoice.taxRate;
}

export default function ClientInvoicesPage() {
  const { state, updateInvoice } = useApp();
  const [selectedId, setSelectedId] = useState('');

  const invoices = useMemo(() => state.invoices.filter(invoice => invoice.clientId === state.session?.userId), [state.invoices, state.session?.userId]);
  const selectedInvoice = invoices.find(invoice => invoice.id === selectedId) ?? invoices[0];

  const totals = {
    paid: invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + invoiceAmount(invoice), 0),
    pending: invoices.filter(invoice => invoice.status === 'pending').reduce((sum, invoice) => sum + invoiceAmount(invoice), 0),
    overdue: invoices.filter(invoice => invoice.status === 'overdue').reduce((sum, invoice) => sum + invoiceAmount(invoice), 0)
  };

  return (
    <PortalFrame role="client" title="Invoices & Payments" subtitle="Manage billing and financial records across projects.">
      <div className="stats-grid">
        <MetricCard title="Total paid" value={formatMoney(totals.paid)} />
        <MetricCard title="Awaiting approval" value={formatMoney(totals.pending)} />
        <MetricCard title="Overdue payments" value={formatMoney(totals.overdue)} detail="Needs action" />
        <MetricCard title="Freelancers paid" value={String(new Set(invoices.filter(invoice => invoice.status === 'paid').map(invoice => invoice.freelancerId)).size)} />
      </div>

      <Card title="Tools" subtitle="Export or download the current billing set">
        <div className="row-actions">
          <button className="secondary-btn" type="button" onClick={() => {
            const rows = ['Invoice,Client,Freelancer,Status,Total'];
            invoices.forEach(invoice => rows.push(`${invoice.pdfLabel ?? invoice.id},${invoice.clientName},${invoice.freelancerName},${invoice.status},${invoiceAmount(invoice)}`));
            const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'freelanceflow-invoices.csv';
            link.click();
            URL.revokeObjectURL(url);
          }}>
            <FileDown size={16} />
            Export CSV
          </button>
          <button className="secondary-btn" type="button" onClick={() => downloadInvoiceBundle(invoices)}>
            <Download size={16} />
            Download All PDFs
          </button>
        </div>
      </Card>

      <div className="detail-grid">
        <Card title="Invoice list" subtitle="Approve or query a line item in one click">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Freelancer</th>
                <th>Project</th>
                <th>Due</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id} onClick={() => setSelectedId(invoice.id)} style={{ cursor: 'pointer', background: selectedInvoice?.id === invoice.id ? 'rgba(86, 70, 255, 0.04)' : 'transparent' }}>
                  <td>{invoice.pdfLabel ?? invoice.id}</td>
                  <td>{invoice.freelancerName}</td>
                  <td>{state.projects.find(project => project.id === invoice.projectId)?.title ?? 'Project'}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatMoney(invoiceAmount(invoice))}</td>
                  <td><StatusBadge status={invoice.status} /></td>
                  <td>
                    <div className="row-actions">
                      <button className="secondary-btn" type="button" onClick={event => { event.stopPropagation(); updateInvoice(invoice.id, { status: 'query' }); }}>Query</button>
                      <button className="primary-btn" type="button" onClick={event => { event.stopPropagation(); updateInvoice(invoice.id, { status: 'paid' }); }}>Approve</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selectedInvoice ? (
          <Card title={selectedInvoice.pdfLabel ?? selectedInvoice.id} subtitle={`${selectedInvoice.freelancerName} • ${selectedInvoice.clientName}`}>
            <div className="stack-2">
              <div className="compact-list">
                {selectedInvoice.lineItems.map(item => (
                  <div className="compact-item" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <p className="caption">{item.description}</p>
                    </div>
                    <strong>{formatMoney(item.quantity * item.rate)}</strong>
                  </div>
                ))}
              </div>
              <div className="panel" style={{ background: 'rgba(86,70,255,0.04)' }}>
                <div className="compact-item"><span>Subtotal</span><strong>{formatMoney(selectedInvoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0))}</strong></div>
                <div className="compact-item"><span>GST ({Math.round(selectedInvoice.taxRate * 100)}%)</span><strong>{formatMoney(selectedInvoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0) * selectedInvoice.taxRate)}</strong></div>
                <div className="compact-item"><span>Total amount</span><strong>{formatMoney(invoiceAmount(selectedInvoice))}</strong></div>
              </div>
              <div className="row-actions">
                <button className="secondary-btn" type="button" onClick={() => downloadInvoicePdf(selectedInvoice)}><Printer size={16} />Download PDF</button>
                <button className="primary-btn" type="button" onClick={() => updateInvoice(selectedInvoice.id, { status: 'paid' })}>Mark paid</button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </PortalFrame>
  );
}
