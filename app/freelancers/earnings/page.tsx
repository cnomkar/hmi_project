'use client';

import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function FreelancerEarningsPage() {
  const { state } = useApp();
  const invoices = state.invoices.filter(invoice => invoice.freelancerId === state.session?.userId);

  return (
    <PortalFrame role="freelancer" title="Earnings" subtitle="Inspect revenue, top clients, and monthly trends.">
      <div className="stats-grid">
        <MetricCard title="Total earned" value={formatMoney(324500)} detail="Across the selected range" />
        <MetricCard title="Avg / month" value={formatMoney(108166)} detail="Based on current projection" />
        <MetricCard title="Best client" value={invoices[0]?.clientName ?? 'Zeta Corp'} detail={formatMoney(145000)} />
        <MetricCard title="Effective rate" value={`${formatMoney(2317)}/hr`} detail="Across logged hours" />
      </div>

      <div className="workspace-grid">
        <Card title="Revenue over time" subtitle="Weekly and monthly trend view">
          <div className="chart">
            {[28, 34, 62, 58, 82, 88].map((height, index) => (
              <div className="bar" key={index}>
                <div className="bar-track"><div className="bar-fill" style={{ minHeight: `${height}%` }}></div></div>
                <span className="caption">{['Apr W1', 'Apr W3', 'May W1', 'May W3', 'Jun W1', 'Jun W3'][index]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Revenue by skill" subtitle="Billings grouped by discipline">
          <div className="stack-2">
            {[
              ['UI Design', 180000],
              ['Frontend Dev', 95500],
              ['UX Research', 35000],
              ['Consulting', 14000]
            ].map(([label, value]) => (
              <div key={label} className="stack-2">
                <div className="compact-item"><span>{label}</span><strong>{formatMoney(Number(value))}</strong></div>
                <div className="progress"><span style={{ width: `${Math.min(Number(value) / 180000 * 100, 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="detail-grid">
        <Card title="Client value ranking">
          <div className="compact-list">
            {['Zeta Corp', 'Nexus Labs', 'Acme Studios', 'Omni Partners'].map((client, index) => (
              <div className="compact-item" key={client}>
                <div>
                  <strong>{client}</strong>
                  <p className="caption">{index + 1} Active Projects</p>
                </div>
                <strong>{formatMoney([145000, 85000, 60000, 34500][index])}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Annual heatmap (YTD)">
          <div className="grid-lines">
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].reduce<string[][]>((rows, month, index) => {
              const rowIndex = Math.floor(index / 4);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(month);
              return rows;
            }, []).map((row, rowIndex) => (
              <div className="grid-row" key={rowIndex}>
                {row.map((month, index) => <div className={`grid-cell level-${(rowIndex + index) % 4}`} key={month} style={{ aspectRatio: '1.2' }}>{month}</div>)}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PortalFrame>
  );
}
