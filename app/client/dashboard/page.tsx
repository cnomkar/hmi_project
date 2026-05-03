'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, FileCheck2, LayoutGrid, Users, Wallet } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, SectionTitle, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function ClientDashboardPage() {
  const { state, updateInvoice, markNotificationRead } = useApp();
  const [search, setSearch] = useState('');

  const projects = useMemo(
    () => state.projects.filter(project => project.clientId === state.session?.userId && project.title.toLowerCase().includes(search.toLowerCase())),
    [search, state.projects, state.session?.userId]
  );

  const invoices = useMemo(
    () => state.invoices.filter(invoice => invoice.clientId === state.session?.userId && invoice.clientName.toLowerCase().includes(search.toLowerCase())),
    [search, state.invoices, state.session?.userId]
  );

  const totalPaid = state.invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.lineItems.reduce((entrySum, item) => entrySum + item.rate * item.quantity, 0), 0);
  const awaitingApproval = state.invoices.filter(invoice => invoice.status === 'pending').reduce((sum, invoice) => sum + invoice.lineItems.reduce((entrySum, item) => entrySum + item.rate * item.quantity, 0), 0);
  const overdue = state.invoices.filter(invoice => invoice.status === 'overdue').reduce((sum, invoice) => sum + invoice.lineItems.reduce((entrySum, item) => entrySum + item.rate * item.quantity, 0), 0);
  const freelancersPaid = new Set(state.invoices.filter(invoice => invoice.status === 'paid').map(invoice => invoice.freelancerId)).size;

  return (
    <PortalFrame role="client" title="Good morning, Rohan" subtitle="Here is what is happening across your projects and invoices." search={search} onSearch={setSearch}>
      <div className="stats-grid">
        <MetricCard title="Total paid" value={formatMoney(totalPaid)} detail="Across all approved invoices" />
        <MetricCard title="Awaiting approval" value={formatMoney(awaitingApproval)} detail="Needs your review" />
        <MetricCard title="Overdue payments" value={formatMoney(overdue)} detail="Follow up immediately" />
        <MetricCard title="Freelancers paid" value={String(freelancersPaid)} detail="Unique freelancers cleared" />
      </div>

      <div className="workspace-grid">
        <Card title="Active projects" subtitle="Track delivery and progress across open engagements" action={<Link className="ghost-btn" href="/client/my-projects">View all</Link>}>
          <div className="compact-list">
            {projects.slice(0, 3).map(project => (
              <div className="compact-item" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <p className="caption">{project.freelancerName ?? 'Unassigned'} • Due {formatDate(project.dueDate)}</p>
                </div>
                <div style={{ display: 'grid', justifyItems: 'end', gap: 8 }}>
                  <StatusBadge status={project.status} />
                  <strong>{project.progress}%</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Action required" subtitle="Invoices waiting on your decision" action={<Link className="ghost-btn" href="/client/invoices">Open invoices</Link>}>
          <div className="stacked-actions">
            {invoices.slice(0, 2).map(invoice => {
              const amount = invoice.lineItems.reduce((sum, item) => sum + item.rate * item.quantity, 0);
              return (
                <div className="timeline-item" key={invoice.id}>
                  <span className={`timeline-dot ${invoice.status === 'pending' ? 'warning' : 'danger'}`}></span>
                  <span>
                    <strong>{invoice.pdfLabel ?? invoice.id}</strong>
                    <p className="caption">{invoice.freelancerName} • Due {formatDate(invoice.dueDate)}</p>
                  </span>
                  <strong>{formatMoney(amount)}</strong>
                  <div className="row-actions">
                    <button className="secondary-btn" type="button" onClick={() => updateInvoice(invoice.id, { status: 'query' })}>Query</button>
                    <button className="primary-btn" type="button" onClick={() => updateInvoice(invoice.id, { status: 'paid' })}>
                      <FileCheck2 size={16} />
                      Approve
                    </button>
                  </div>
                </div>
              );
            })}
            {!invoices.length ? <div className="empty-state">No invoices need attention.</div> : null}
          </div>
        </Card>
      </div>

      <div className="workspace-grid dual">
        <Card title="Spend over time" subtitle="A compact view of this quarter's spend" action={<div className="mini-legend"><span className="legend success">Development</span><span className="legend warning">Design</span><span className="legend danger">Marketing</span></div>}>
          <div className="chart">
            {[24, 46, 31, 60, 74, 82].map((height, index) => (
              <div className="bar" key={index}>
                <div className="bar-track">
                  <div className="bar-fill" style={{ minHeight: `${height}%` }}></div>
                </div>
                <span className="caption">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'][index]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick actions" subtitle="Frequently used shortcuts">
          <div className="cards-grid">
            <Link className="feature-card" href="/client/find-talent">
              <div className="pill"><Users size={16} /></div>
              <h4>Find talent</h4>
              <p>Browse freelancers and open a new engagement.</p>
            </Link>
            <Link className="feature-card" href="/client/post-project">
              <div className="pill"><LayoutGrid size={16} /></div>
              <h4>Post a project</h4>
              <p>Create a brief and invite talent directly.</p>
            </Link>
            <Link className="feature-card" href="/client/invoices">
              <div className="pill"><Wallet size={16} /></div>
              <h4>Review invoices</h4>
              <p>Approve or query line items in one place.</p>
            </Link>
          </div>
          <button className="secondary-btn" type="button" onClick={() => markNotificationRead('note_1')}>
            <Download size={16} />
            Clear notification badge
          </button>
        </Card>
      </div>
    </PortalFrame>
  );
}
