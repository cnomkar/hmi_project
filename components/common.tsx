'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { formatCurrency, formatCompactDate } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status ${status}`}>{status.replaceAll('-', ' ')}</span>;
}

export function MetricCard({ title, value, detail, trend }: { title: string; value: string; detail?: string; trend?: string }) {
  return (
    <article className="stat-card">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      {detail ? <p className={trend?.startsWith('-') ? 'trend-down small' : 'trend-up small'}>{detail}</p> : null}
      {trend ? <p className="caption">{trend}</p> : null}
    </article>
  );
}

export function Card({ title, subtitle, children, action }: { title: string; subtitle?: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search...'
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="topbar-search">
      <Search size={16} />
      <input className="input" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function SummaryList({
  rows,
  emptyMessage = 'Nothing to show yet.'
}: {
  rows: Array<{ label: string; value: string; hint?: string }>;
  emptyMessage?: string;
}) {
  if (!rows.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="compact-list">
      {rows.map(row => (
        <div className="compact-item" key={`${row.label}-${row.value}`}>
          <div>
            <strong>{row.label}</strong>
            {row.hint ? <p className="caption">{row.hint}</p> : null}
          </div>
          <strong>{row.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function QuickLink({ href, label, description }: { href: string; label: string; description?: string }) {
  return (
    <Link className="nav-link" href={href}>
      <span style={{ display: 'grid', gap: 2 }}>
        <strong>{label}</strong>
        {description ? <span className="caption">{description}</span> : null}
      </span>
      <ChevronRight size={16} />
    </Link>
  );
}

export function formatMoney(amount: number) {
  return formatCurrency(amount, 'INR');
}

export function formatDate(value: string) {
  return formatCompactDate(value);
}
