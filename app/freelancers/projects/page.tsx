'use client';

import { useMemo, useState } from 'react';
import { FileCheck2, MessageSquare, PencilLine, TimerReset } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function FreelancerProjectsPage() {
  const { state, updateProject, updateMilestone, addProjectComment } = useApp();
  const [selectedId, setSelectedId] = useState('');

  const projects = useMemo(() => state.projects.filter(project => project.freelancerId === state.session?.userId), [state.projects, state.session?.userId]);
  const selectedProject = projects.find(project => project.id === selectedId) ?? projects[0];

  const approveLatest = () => {
    if (!selectedProject) {
      return;
    }
    const milestone = [...selectedProject.milestones].reverse().find(item => !item.completed);
    if (!milestone) {
      return;
    }
    updateMilestone(selectedProject.id, milestone.id, { completed: true, status: 'done' });
    updateProject(selectedProject.id, { progress: Math.min(selectedProject.progress + 12, 100), status: 'active' });
  };

  return (
    <PortalFrame role="freelancer" title="Projects" subtitle="Review your active contracts and milestone status.">
      <div className="cards-grid">
        <MetricCard title="Active" value={String(projects.filter(project => project.status === 'active').length)} />
        <MetricCard title="On hold" value={String(projects.filter(project => project.status === 'on-hold').length)} />
        <MetricCard title="In review" value={String(projects.filter(project => project.status === 'in-review').length)} />
      </div>

      <div className="detail-grid">
        <Card title="Projects">
          <div className="cards-grid">
            {projects.map(project => (
              <button className="card" key={project.id} type="button" onClick={() => setSelectedId(project.id)} style={{ textAlign: 'left', borderColor: selectedProject?.id === project.id ? 'rgba(86,70,255,0.7)' : 'var(--line)', boxShadow: selectedProject?.id === project.id ? '0 20px 42px rgba(86,70,255,0.08)' : 'none' }}>
                <div className="row-head">
                  <div>
                    <h4>{project.title}</h4>
                    <p className="caption">{project.clientName}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="compact-item"><span>Milestones</span><span>{project.milestones.filter(item => item.completed).length}/{project.milestones.length} done</span></div>
                <div className="progress"><span style={{ width: `${project.progress}%` }} /></div>
                <div className="compact-item"><span>Due {formatDate(project.dueDate)}</span><span>{formatMoney(project.budget)}</span></div>
              </button>
            ))}
          </div>
        </Card>

        {selectedProject ? (
          <Card title={selectedProject.title} subtitle={selectedProject.description}>
            <div className="stack-2">
              <div className="split">
                <MetricCard title="Total budget" value={formatMoney(selectedProject.budget)} />
                <MetricCard title="Time logged" value={`${state.timeEntries.filter(entry => entry.projectId === selectedProject.id).reduce((sum, entry) => sum + entry.durationMinutes, 0)} min`} />
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
                <button className="secondary-btn" type="button" onClick={() => addProjectComment(selectedProject.id, 'Developer added a quick progress note.') }><MessageSquare size={16} />Send update</button>
                <button className="secondary-btn" type="button" onClick={() => updateProject(selectedProject.id, { status: 'in-review' })}><PencilLine size={16} />Request review</button>
                <button className="primary-btn" type="button" onClick={approveLatest}><FileCheck2 size={16} />Approve latest milestone</button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </PortalFrame>
  );
}
