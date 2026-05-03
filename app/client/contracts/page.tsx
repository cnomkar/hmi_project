'use client';

import { useMemo, useState } from 'react';
import { FileCheck2, MessageSquare, ShieldAlert } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function ContractsPage() {
  const { state, updateProject, updateMilestone, addProjectComment } = useApp();
  const [selectedId, setSelectedId] = useState('');

  const projects = useMemo(() => state.projects.filter(project => project.clientId === state.session?.userId), [state.projects, state.session?.userId]);
  const selectedProject = projects.find(project => project.id === selectedId) ?? projects[0];

  const handleApprove = () => {
    if (!selectedProject) {
      return;
    }
    const milestone = [...selectedProject.milestones].reverse().find(item => !item.completed);
    if (!milestone) {
      return;
    }
    updateMilestone(selectedProject.id, milestone.id, { completed: true, status: 'done' });
    updateProject(selectedProject.id, { status: 'active', progress: Math.min(selectedProject.progress + 10, 100) });
  };

  return (
    <PortalFrame role="client" title="Contracts" subtitle="View contract status, milestones, and approval actions.">
      <div className="cards-grid">
        <MetricCard title="Active contracts" value={String(projects.filter(project => project.status === 'active').length)} />
        <MetricCard title="Overdue" value={String(projects.filter(project => project.status === 'overdue').length)} />
        <MetricCard title="In review" value={String(projects.filter(project => project.status === 'in-review').length)} />
      </div>

      <div className="detail-grid">
        <Card title="Contracts list">
          <div className="compact-list">
            {projects.map(project => (
              <button className="compact-item" key={project.id} type="button" onClick={() => setSelectedId(project.id)} style={{ textAlign: 'left', width: '100%', background: selectedProject?.id === project.id ? 'rgba(86,70,255,0.04)' : 'transparent' }}>
                <div>
                  <strong>{project.title}</strong>
                  <p className="caption">{project.freelancerName ?? 'Unassigned'} • Due {formatDate(project.dueDate)}</p>
                </div>
                <div style={{ display: 'grid', justifyItems: 'end', gap: 6 }}>
                  <StatusBadge status={project.status} />
                  <span>{formatMoney(project.budget)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {selectedProject ? (
          <Card title={selectedProject.title} subtitle={selectedProject.description}>
            <div className="stack-2">
              <div className="split">
                <MetricCard title="Budget" value={formatMoney(selectedProject.budget)} />
                <MetricCard title="Spent" value={formatMoney(selectedProject.spent)} />
              </div>
              <div className="timeline">
                {selectedProject.milestones.map(milestone => (
                  <div className="timeline-item" key={milestone.id}>
                    <span className={`timeline-dot ${milestone.completed ? 'success' : 'warning'}`}></span>
                    <span>
                      <strong>{milestone.title}</strong>
                      <p className="caption">{formatDate(milestone.dueDate)}</p>
                    </span>
                    <strong>{formatMoney(milestone.amount)}</strong>
                  </div>
                ))}
              </div>
              <div className="row-actions">
                <button className="secondary-btn" type="button" onClick={() => addProjectComment(selectedProject.id, 'Client requested a status update on the contract.') }><MessageSquare size={16} />Request update</button>
                <button className="secondary-btn" type="button" onClick={() => updateProject(selectedProject.id, { status: 'in-review' })}><ShieldAlert size={16} />Mark in review</button>
                <button className="primary-btn" type="button" onClick={handleApprove}><FileCheck2 size={16} />Approve milestone</button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </PortalFrame>
  );
}
