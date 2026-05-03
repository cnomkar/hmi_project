'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card } from '@/components/common';
import { useApp } from '@/lib/storage';

export default function ClientSettingsPage() {
  const { currentUser, updateUser } = useApp();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [company, setCompany] = useState(currentUser?.company ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');

  return (
    <PortalFrame role="client" title="Settings" subtitle="Update your profile and account preferences.">
      <div className="detail-grid">
        <Card title="Profile">
          <div className="form-grid">
            <label className="field"><span>Name</span><input className="input" value={name} onChange={event => setName(event.target.value)} /></label>
            <label className="field"><span>Company</span><input className="input" value={company} onChange={event => setCompany(event.target.value)} /></label>
            <label className="field"><span>Location</span><input className="input" value={location} onChange={event => setLocation(event.target.value)} /></label>
            <button className="primary-btn" type="button" onClick={() => currentUser && updateUser(currentUser.id, { name, company, location })}><Save size={16} />Save changes</button>
          </div>
        </Card>

        <Card title="Preferences">
          <div className="stack-2">
            <div className="compact-item"><span>Email notifications</span><span className="badge">Enabled</span></div>
            <div className="compact-item"><span>Invoice alerts</span><span className="badge">Enabled</span></div>
            <div className="compact-item"><span>Project reminders</span><span className="badge">Enabled</span></div>
          </div>
        </Card>
      </div>
    </PortalFrame>
  );
}
