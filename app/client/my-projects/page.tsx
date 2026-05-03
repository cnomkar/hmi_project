'use client';

import { useMemo, useState } from 'react';
import { MessageSquare, PenLine, ShieldAlert, TimerReset } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatDate, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function MyProjectsPage() {
  const { state, updateProject, updateMilestone, addProjectComment } = useApp();
  const [tab, setTab] = useState<'all' | 'active' | 'in-review' | 'completed' | 'draft'>('all');
  const [selectedId, setSelectedId] = useState('');

  const projects = useMemo(() => {
    return state.projects.filter(project => project.clientId === state.session?.userId && (tab === 'all' || project.status === tab));
  }, [state.projects, state.session?.userId, tab]);

  const selectedProject = projects.find(project => project.id === selectedId) ?? projects[0];

  const handleApproveMilestone = () => {
    if (!selectedProject) {
      return;
    }

    const pendingMilestone = [...selectedProject.milestones].reverse().find(milestone => !milestone.completed);
    if (!pendingMilestone) {
      return;
    }

    updateMilestone(selectedProject.id, pendingMilestone.id, { completed: true, status: 'done' });
    updateProject(selectedProject.id, {
      progress: Math.min(selectedProject.progress + 15, 100),
      status: selectedProject.progress + 15 >= 100 ? 'completed' : 'active'
    });
  };

  const handleRevision = () => {
    if (!selectedProject) {
      return;
    }

    addProjectComment(selectedProject.id, 'Client requested a revision on the current milestone.');
    updateProject(selectedProject.id, { status: 'in-review' });
  };

  return (
    <PortalFrame role="client" title="My Projects" subtitle="Track active contracts and milestone progress.">
      <div className="tabs">
        {(['all', 'active', 'in-review', 'completed', 'draft'] as const).map(value => (
          <button key={value} className={`tab ${tab === value ? 'active' : ''}`} type="button" onClick={() => setTab(value)}>{value.replace('-', ' ')}</button>
        ))}
      </div>

      <div className="detail-grid">
        <Card title="Projects" subtitle="Click a row to inspect details">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Freelancer</th>
                <th>Type</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} onClick={() => setSelectedId(project.id)} style={{ cursor: 'pointer', background: selectedProject?.id === project.id ? 'rgba(86, 70, 255, 0.04)' : 'transparent' }}>
                  <td>
                    <strong>{project.title}</strong>
                    <p className="caption">Due {formatDate(project.dueDate)}</p>
                  </td>
                  <td>{project.freelancerName ?? 'Unassigned'}</td>
                  <td>{project.type}</td>
                  <td>{formatMoney(project.budget)}</td>
                  <td>{formatMoney(project.spent)}</td>
                  <td><StatusBadge status={project.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {selectedProject ? (
          <Card title={selectedProject.title} subtitle={`${selectedProject.freelancerName ?? 'No freelancer assigned'} • ${selectedProject.category}`}>
            <div className="stack-2">
              <div className="compact-item">
                <div>
                  <strong>Spend track</strong>
                  <p className="caption">{formatMoney(selectedProject.spent)} / {formatMoney(selectedProject.budget)}</p>
                </div>
                <strong>{selectedProject.progress}%</strong>
              </div>
              <div className="progress"><span style={{ width: `${selectedProject.progress}%` }} /></div>
              <div className="chips">
                {selectedProject.skills.map(skill => <span key={skill} className="badge">{skill}</span>)}
              </div>
              <div className="timeline">
                {selectedProject.milestones.map(milestone => (
                  <div className="timeline-item" key={milestone.id}>
                    <span className={`timeline-dot ${milestone.completed ? 'success' : milestone.status === 'review' ? 'warning' : 'danger'}`}></span>
                    <span>
                      <strong>{milestone.title}</strong>
                      <p className="caption">{formatDate(milestone.dueDate)}</p>
                    </span>
                    <strong>{formatMoney(milestone.amount)}</strong>
                  </div>
                ))}
              </div>
              <div className="row-actions">
                <button className="secondary-btn" type="button" onClick={handleRevision}><PenLine size={16} />Request revision</button>
                <button className="secondary-btn" type="button" onClick={() => addProjectComment(selectedProject.id, 'Client sent a status reminder.') }><MessageSquare size={16} />Send reminder</button>
                <button className="primary-btn" type="button" onClick={handleApproveMilestone}><ShieldAlert size={16} />Approve latest milestone</button>
              </div>
            </div>
          </Card>
        ) : (
          <Card title="No project selected">
            <div className="empty-state">Pick a project to inspect milestones and actions.</div>
          </Card>
        )}
      </div>

      <div className="cards-grid">
        <MetricCard title="Active contracts" value={String(state.projects.filter(project => project.clientId === state.session?.userId && project.status === 'active').length)} detail="Currently in progress" />
        <MetricCard title="Milestones approved" value={String(state.projects.reduce((sum, project) => sum + project.milestones.filter(milestone => milestone.completed).length, 0))} detail="Across all projects" />
        <MetricCard title="Needs attention" value={String(state.projects.filter(project => project.clientId === state.session?.userId && project.status === 'in-review').length)} detail="Waiting for a response" />
      </div>
    </PortalFrame>
  );
}
