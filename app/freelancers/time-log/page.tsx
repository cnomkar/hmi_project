'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, Plus, Square, TimerReset } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, formatDate } from '@/components/common';
import { useApp } from '@/lib/storage';
import { formatTimeEntry } from '@/lib/utils';

export default function FreelancerTimeLogPage() {
  const { state, addTimeEntry } = useApp();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? '');
  const [task, setTask] = useState('Frontend Rework');
  const [description, setDescription] = useState('Polished the dashboard layout and approval modal.');

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => setSeconds(value => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const entries = useMemo(() => state.timeEntries.filter(entry => !projectId || entry.projectId === projectId), [projectId, state.timeEntries]);

  const stopTimer = () => {
    setRunning(false);
    if (!projectId) {
      return;
    }

    addTimeEntry({
      projectId,
      projectTitle: state.projects.find(project => project.id === projectId)?.title ?? 'Project',
      task,
      skill: 'Frontend',
      date: new Date().toISOString(),
      durationMinutes: Math.max(Math.round(seconds / 60), 1),
      note: description,
      billable: true
    });
    setSeconds(0);
  };

  return (
    <PortalFrame role="freelancer" title="Time Log" subtitle="Track billable work and manual entries.">
      <div className="stats-grid">
        <MetricCard title="Recording" value={formatTimeEntry(Math.max(seconds / 60, 0))} detail="Current timer" />
        <MetricCard title="Logged today" value={formatTimeEntry(state.timeEntries.filter(entry => new Date(entry.date).toDateString() === new Date().toDateString()).reduce((sum, entry) => sum + entry.durationMinutes, 0))} />
        <MetricCard title="Billable" value={String(state.timeEntries.filter(entry => entry.billable).length)} />
        <MetricCard title="Activity" value="28 days" detail="Consistency view" />
      </div>

      <Card title="Running timer">
        <div className="row-head">
          <div>
            <p className="caption">Project</p>
            <strong>{state.projects.find(project => project.id === projectId)?.title ?? 'Select a project'}</strong>
          </div>
          <div className="row-actions">
            <button className="icon-btn" type="button" onClick={() => setRunning(false)}><Pause size={16} /></button>
            <button className="icon-btn" type="button" onClick={() => setRunning(true)}><Play size={16} /></button>
            <button className="icon-btn" type="button" onClick={stopTimer}><Square size={16} /></button>
          </div>
        </div>
        <div className="progress success" style={{ marginTop: 14 }}><span style={{ width: `${Math.min((seconds % 3600) / 3600 * 100, 100)}%` }} /></div>
      </Card>

      <div className="detail-grid">
        <Card title="Recent entries" subtitle="Your tracked work list">
          <div className="compact-list">
            {entries.map(entry => (
              <div className="compact-item" key={entry.id}>
                <div>
                  <strong>{entry.projectTitle}</strong>
                  <p className="caption">{entry.task} • {entry.skill} • {formatDate(entry.date)}</p>
                </div>
                <strong>{formatTimeEntry(entry.durationMinutes)}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Manual entry">
          <div className="form-grid">
            <label className="field">
              <span>Project</span>
              <select className="select" value={projectId} onChange={event => setProjectId(event.target.value)}>
                {state.projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}
              </select>
            </label>
            <label className="field"><span>Task</span><input className="input" value={task} onChange={event => setTask(event.target.value)} /></label>
            <label className="field"><span>Description</span><textarea className="textarea" value={description} onChange={event => setDescription(event.target.value)} /></label>
            <button className="primary-btn" type="button" onClick={() => addTimeEntry({ projectId, projectTitle: state.projects.find(project => project.id === projectId)?.title ?? 'Project', task, skill: 'Frontend', date: new Date().toISOString(), durationMinutes: 75, note: description, billable: true })}><Plus size={16} />Add time entry</button>
          </div>
        </Card>
      </div>

      <Card title="Activity (28 days)">
        <div className="grid-lines">
          {[1, 2, 3].map(row => (
            <div className="grid-row" key={row}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(index => <span className={`grid-cell level-${(row + index) % 4}`} key={`${row}-${index}`}></span>)}
            </div>
          ))}
        </div>
      </Card>
    </PortalFrame>
  );
}
