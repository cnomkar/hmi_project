'use client';

import { useMemo, useState } from 'react';
import { BellRing, MessageSquare, SendHorizonal } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function FreelancerClientsPage() {
  const { state, sendMessage } = useApp();
  const [selectedId, setSelectedId] = useState(state.users.find(user => user.role === 'client')?.id ?? '');
  const [message, setMessage] = useState('');

  const clients = useMemo(() => state.users.filter(user => user.role === 'client'), [state.users]);
  const selectedClient = clients.find(client => client.id === selectedId) ?? clients[0];
  const clientProjects = state.projects.filter(project => project.clientId === selectedClient?.id);
  const totalBilled = state.invoices.filter(invoice => invoice.clientId === selectedClient?.id).reduce((sum, invoice) => sum + invoice.lineItems.reduce((lineSum, line) => lineSum + line.quantity * line.rate, 0), 0);

  return (
    <PortalFrame role="freelancer" title="Clients" subtitle="Manage your client directory and active engagements.">
      <div className="detail-grid">
        <Card title="Client directory" subtitle={`${clients.length} total`}>
          <div className="compact-list">
            {clients.map(client => (
              <button className="compact-item" type="button" key={client.id} onClick={() => setSelectedId(client.id)} style={{ textAlign: 'left', width: '100%', background: selectedClient?.id === client.id ? 'rgba(86,70,255,0.04)' : 'transparent' }}>
                <div>
                  <strong>{client.company ?? client.name}</strong>
                  <p className="caption">{client.email}</p>
                </div>
                <span className="badge">{state.projects.filter(project => project.clientId === client.id).length} Active</span>
              </button>
            ))}
          </div>
        </Card>

        {selectedClient ? (
          <Card title={selectedClient.company ?? selectedClient.name} subtitle={selectedClient.email}>
            <div className="stack-2">
              <div className="row-actions">
                <button className="secondary-btn" type="button" onClick={() => sendMessage({ fromUserId: state.session?.userId ?? '', toUserId: selectedClient.id, threadId: `thread_${selectedClient.id}`, body: `Reminder: please review the latest invoice and project update.` })}><BellRing size={16} />Send reminder</button>
                <button className="secondary-btn" type="button" onClick={() => setMessage(`Hi ${selectedClient.name}, I wanted to share a quick update on your project.`)}><MessageSquare size={16} />Open messages</button>
                <button className="primary-btn" type="button" onClick={() => sendMessage({ fromUserId: state.session?.userId ?? '', toUserId: selectedClient.id, threadId: `thread_${selectedClient.id}`, body: message || `Hello ${selectedClient.name}, sharing a quick status update.` })}><SendHorizonal size={16} />Send note</button>
              </div>
              <MetricCard title="Total billed" value={formatMoney(totalBilled)} />
              <MetricCard title="Active projects" value={String(clientProjects.length)} />
              <MetricCard title="Avg. payment time" value="14 days" />
              <div className="compact-list">
                {clientProjects.map(project => (
                  <div className="compact-item" key={project.id}>
                    <div>
                      <strong>{project.title}</strong>
                      <p className="caption">{project.category} • Due {formatDate(project.dueDate)}</p>
                    </div>
                    <strong>{formatMoney(project.spent)}</strong>
                  </div>
                ))}
              </div>
              <label className="field">
                <span>Quick note</span>
                <textarea className="textarea" value={message} onChange={event => setMessage(event.target.value)} placeholder="Write a reminder or update." />
              </label>
            </div>
          </Card>
        ) : null}
      </div>
    </PortalFrame>
  );
}
