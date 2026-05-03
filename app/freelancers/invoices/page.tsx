'use client';

import { useMemo, useState } from 'react';
import { Download, Plus, RotateCcw } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';
import { downloadInvoicePdf } from '@/lib/pdf';
import type { InvoiceLineItem } from '@/lib/types';

export default function FreelancerInvoicesPage() {
  const { state, currentUser, createInvoice, addInvoiceLineItem } = useApp();
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? '');
  const [lineTitle, setLineTitle] = useState('Homepage wireframes');
  const [lineDescription, setLineDescription] = useState('Desktop and mobile variations');
  const [quantity, setQuantity] = useState('8');
  const [rate, setRate] = useState('3500');

  const invoices = useMemo(() => state.invoices.filter(invoice => invoice.freelancerId === state.session?.userId), [state.invoices, state.session?.userId]);

  const selectedProject = state.projects.find(project => project.id === projectId);

  const createDraft = () => {
    if (!selectedProject) {
      return;
    }

    const lineItems: InvoiceLineItem[] = [{
      id: `line_${Date.now()}`,
      title: lineTitle,
      description: lineDescription,
      quantity: Number(quantity),
      rate: Number(rate)
    }];

    createInvoice({
      projectId: selectedProject.id,
      clientId: selectedProject.clientId,
      clientName: selectedProject.clientName,
      freelancerId: state.session?.userId ?? selectedProject.freelancerId ?? '',
      freelancerName: currentUser?.name ?? selectedProject.freelancerName ?? 'Freelancer',
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      status: 'draft',
      currency: 'INR',
      taxRate: 0.18,
      lineItems,
      notes: 'Generated from freelancer invoice wizard.',
      pdfLabel: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`
    });
  };

  const activeDraft = invoices[0];

  return (
    <PortalFrame role="freelancer" title="Invoices" subtitle="Create and track invoices across projects.">
      <div className="stats-grid">
        <MetricCard title="Drafts" value={String(invoices.filter(invoice => invoice.status === 'draft').length)} />
        <MetricCard title="Pending" value={String(invoices.filter(invoice => invoice.status === 'pending').length)} />
        <MetricCard title="Paid" value={String(invoices.filter(invoice => invoice.status === 'paid').length)} />
        <MetricCard title="Overdue" value={String(invoices.filter(invoice => invoice.status === 'overdue').length)} />
      </div>

      <div className="detail-grid">
        <Card title="Create invoice">
          <div className="form-grid">
            <label className="field"><span>Project</span><select className="select" value={projectId} onChange={event => setProjectId(event.target.value)}>{state.projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}</select></label>
            <label className="field"><span>Title</span><input className="input" value={lineTitle} onChange={event => setLineTitle(event.target.value)} /></label>
            <label className="field"><span>Description</span><input className="input" value={lineDescription} onChange={event => setLineDescription(event.target.value)} /></label>
            <div className="split">
              <label className="field"><span>Quantity</span><input className="input" value={quantity} onChange={event => setQuantity(event.target.value)} /></label>
              <label className="field"><span>Rate</span><input className="input" value={rate} onChange={event => setRate(event.target.value)} /></label>
            </div>
            <div className="row-actions">
              <button className="secondary-btn" type="button" onClick={() => selectedProject && addInvoiceLineItem(activeDraft?.id ?? '', { id: `line_${Date.now()}`, title: lineTitle, description: lineDescription, quantity: Number(quantity), rate: Number(rate) })}><Plus size={16} />Add line item to latest draft</button>
              <button className="primary-btn" type="button" onClick={createDraft}><RotateCcw size={16} />Save draft</button>
            </div>
          </div>
        </Card>

        <Card title="Invoice review" subtitle="Preview the latest records">
          <div className="timeline">
            {invoices.map(invoice => {
              const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
              return (
                <div className="timeline-item" key={invoice.id}>
                  <span className="timeline-dot warning"></span>
                  <span>
                    <strong>{invoice.pdfLabel ?? invoice.id}</strong>
                    <p className="caption">{invoice.clientName} • Due {formatDate(invoice.dueDate)}</p>
                  </span>
                  <strong>{formatMoney(subtotal + subtotal * invoice.taxRate)}</strong>
                  <StatusBadge status={invoice.status} />
                </div>
              );
            })}
          </div>
          {activeDraft ? <button className="secondary-btn" type="button" onClick={() => downloadInvoicePdf(activeDraft)}><Download size={16} />Download latest PDF</button> : null}
        </Card>
      </div>
    </PortalFrame>
  );
}
