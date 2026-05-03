'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function FreelancerSettingsPage() {
  const { currentUser, updateUser } = useApp();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [title, setTitle] = useState(currentUser?.title ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');

  return (
    <PortalFrame role="freelancer" title="Settings" subtitle="Edit your profile and availability.">
      <div className="detail-grid">
        <Card title="Profile">
          <div className="form-grid">
            <label className="field"><span>Name</span><input className="input" value={name} onChange={event => setName(event.target.value)} /></label>
            <label className="field"><span>Title</span><input className="input" value={title} onChange={event => setTitle(event.target.value)} /></label>
            <label className="field"><span>Location</span><input className="input" value={location} onChange={event => setLocation(event.target.value)} /></label>
            <button className="primary-btn" type="button" onClick={() => currentUser && updateUser(currentUser.id, { name, title, location })}><Save size={16} />Save profile</button>
          </div>
        </Card>

        <Card title="Availability">
          <div className="stack-2">
            <div className="compact-item"><span>Status</span><span className="badge">Available</span></div>
            <div className="compact-item"><span>Billing</span><span className="badge">Invoice-ready</span></div>
            <div className="compact-item"><span>Notifications</span><span className="badge">On</span></div>
          </div>
        </Card>
      </div>
    </PortalFrame>
  );
}
