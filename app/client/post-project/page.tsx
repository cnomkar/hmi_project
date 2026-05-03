'use client';

import { useState } from 'react';
import { ClipboardList, Rocket, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PortalFrame } from '@/components/portal-frame';
import { Card } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function PostProjectPage() {
  const router = useRouter();
  const { currentUser, createProject } = useApp();
  const [title, setTitle] = useState('Senior React Developer for Fintech Dashboard');
  const [description, setDescription] = useState('We are looking for an experienced frontend developer to build out our core dashboard for a new fintech product.');
  const [budget, setBudget] = useState('80000');
  const [skill, setSkill] = useState('React, TypeScript, Node.js, Tailwind CSS');

  return (
    <PortalFrame role="client" title="Post a Project" subtitle="Create a brief and invite the best matching freelancers.">
      <div className="detail-grid">
        <Card title="Project details">
          <div className="form-grid">
            <label className="field"><span>Project title</span><input className="input" value={title} onChange={event => setTitle(event.target.value)} /></label>
            <label className="field"><span>Description</span><textarea className="textarea" value={description} onChange={event => setDescription(event.target.value)} /></label>
            <label className="field"><span>Budget</span><input className="input" value={budget} onChange={event => setBudget(event.target.value)} /></label>
            <label className="field"><span>Required skills</span><input className="input" value={skill} onChange={event => setSkill(event.target.value)} /></label>
            <button className="primary-btn" type="button" onClick={() => {
              createProject({
                title,
                clientId: currentUser?.id ?? 'user_client_rohan',
                clientName: currentUser?.company ?? currentUser?.name ?? 'Client',
                budget: Number(budget),
                spent: 0,
                progress: 0,
                status: 'draft',
                type: 'Fixed',
                category: 'Web Development',
                visibility: 'Public Listing',
                dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
                description,
                skills: skill.split(',').map(entry => entry.trim()).filter(Boolean),
                comments: [],
                milestones: []
              });
              router.push('/client/my-projects');
            }}><Rocket size={16} />Post project</button>
          </div>
        </Card>

        <Card title="Preview" subtitle="How it appears to freelancers">
          <div className="hero-card">
            <div className="compact-item"><strong>{title}</strong><span className="badge">Fixed</span></div>
            <p>{description}</p>
            <div className="chips">{skill.split(',').map(entry => <span className="badge" key={entry}>{entry.trim()}</span>)}</div>
            <div className="split">
              <div className="hero-stat"><strong>₹{budget}</strong><span className="caption">Budget</span></div>
              <div className="hero-stat"><strong>Draft</strong><span className="caption">Status</span></div>
            </div>
            <button className="secondary-btn" type="button" onClick={() => router.back()}><ClipboardList size={16} />Back</button>
          </div>
        </Card>
      </div>
    </PortalFrame>
  );
}
