'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FileText, Plus, TimerReset, TrendingUp, Wallet } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function FreelancerDashboardPage() {
  const { state, updateProject, updateInvoice } = useApp();
  const [search, setSearch] = useState('');

  const projects = useMemo(
    () => state.projects.filter(project => project.freelancerId === state.session?.userId && project.title.toLowerCase().includes(search.toLowerCase())),
    [search, state.projects, state.session?.userId]
  );

  const invoices = useMemo(
    () => state.invoices.filter(invoice => invoice.freelancerId === state.session?.userId),
    [state.invoices, state.session?.userId]
  );

  const earned = invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.lineItems.reduce((entrySum, item) => entrySum + item.quantity * item.rate, 0), 0);
  const activeProjects = projects.filter(project => project.status === 'active').length;
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;
  const loggedTime = state.timeEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

  return (
    <PortalFrame role="freelancer" title="Good morning, Aarav" subtitle="Here is the summary of your freelance business." search={search} onSearch={setSearch}>
      <div className="stats-grid">
        <MetricCard title="This month" value={formatMoney(124500)} detail="Estimated revenue" />
        <MetricCard title="Hours logged" value={`${(loggedTime / 60).toFixed(1)}h`} detail="Across all tracked work" />
        <MetricCard title="Unpaid invoices" value={formatMoney(state.invoices.filter(invoice => invoice.status !== 'paid').reduce((sum, invoice) => sum + invoice.lineItems.reduce((entrySum, item) => entrySum + item.quantity * item.rate, 0), 0))} detail={`${overdueInvoices} overdue`} />
        <MetricCard title="Active projects" value={String(activeProjects)} detail="Current workload" />
      </div>

      <div className="workspace-grid">
        <Card title="Active projects" subtitle="Track delivery and milestones" action={<Link className="ghost-btn" href="/freelancers/projects">View all</Link>}>
          <div className="stack-2">
            {projects.slice(0, 3).map(project => (
              <div className="compact-item" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <p className="caption">{project.clientName} • Due {formatDate(project.dueDate)}</p>
                </div>
                <div style={{ display: 'grid', justifyItems: 'end', gap: 8 }}>
                  <StatusBadge status={project.status} />
                  <strong>{project.progress}%</strong>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Needs attention" subtitle="Invoices waiting on approval or payment">
          <div className="stack-2">
            {invoices.slice(0, 2).map(invoice => (
              <div className="timeline-item" key={invoice.id}>
                <span className={`timeline-dot ${invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'danger'}`}></span>
                <span>
                  <strong>{invoice.pdfLabel ?? invoice.id}</strong>
                  <p className="caption">{invoice.clientName} • {invoice.status}</p>
                </span>
                <strong>{formatMoney(invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0))}</strong>
                <div className="row-actions">
                  <button className="secondary-btn" type="button" onClick={() => updateInvoice(invoice.id, { status: 'query' })}>Query</button>
                  <button className="primary-btn" type="button" onClick={() => updateInvoice(invoice.id, { status: 'paid' })}>Mark paid</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="workspace-grid dual">
        <Card title="Spend / revenue over time" subtitle="Illustrative monthly trend">
          <div className="chart">
            {[34, 58, 45, 72, 88, 95].map((height, index) => (
              <div className="bar" key={index}>
                <div className="bar-track"><div className="bar-fill" style={{ minHeight: `${height}%` }}></div></div>
                <span className="caption">{['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'][index]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick actions" subtitle="Common tasks">
          <div className="cards-grid">
            <Link className="feature-card" href="/freelancers/time-log"><div className="pill"><TimerReset size={16} /></div><h4>Log time</h4><p>Add a manual entry or stop the running timer.</p></Link>
            <Link className="feature-card" href="/freelancers/invoices"><div className="pill"><FileText size={16} /></div><h4>New invoice</h4><p>Create a fresh billing draft from work completed.</p></Link>
            <Link className="feature-card" href="/freelancers/earnings"><div className="pill"><TrendingUp size={16} /></div><h4>Review earnings</h4><p>Inspect monthly revenue and client mix.</p></Link>
          </div>
          <button className="secondary-btn" type="button" onClick={() => updateProject(projects[0]?.id ?? '', { progress: Math.min((projects[0]?.progress ?? 0) + 5, 100) })}>
            <Plus size={16} />Advance first project
          </button>
        </Card>
      </div>
    </PortalFrame>
  );
}
