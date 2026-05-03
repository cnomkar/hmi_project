'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BriefcaseBusiness, CalendarCheck2, MessageSquare, MapPin, Star, UserRound } from 'lucide-react';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';

const tabs = ['About', 'Portfolio', 'Reviews', 'Rates'] as const;

export default function TalentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, currentUser, createProject, sendMessage } = useApp();
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>('About');

  const talent = useMemo(() => state.talents.find(item => item.id === params.id), [params.id, state.talents]);

  if (!talent) {
    return (
      <PortalFrame role="client" title="Back to results" subtitle="Talent profile not found.">
        <div className="empty-state">This freelancer profile is unavailable.</div>
      </PortalFrame>
    );
  }

  const handleHire = () => {
    createProject({
      title: `${talent.name} Engagement`,
      clientId: state.session?.userId ?? 'user_client_rohan',
      freelancerId: talent.userId,
      freelancerName: talent.name,
      clientName: currentUser?.company ?? currentUser?.name ?? 'Client',
      category: talent.title,
      visibility: 'Invited',
      status: 'active',
      progress: 12,
      budget: talent.rate * 18,
      spent: 0,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
      description: talent.about,
      skills: talent.skills,
      comments: [`Selected from ${talent.name}'s profile.`],
      milestones: []
    });
    router.push('/client/my-projects');
  };

  const handleMessage = () => {
    sendMessage({ fromUserId: state.session?.userId ?? 'user_client_rohan', toUserId: talent.userId, threadId: `thread_${talent.id}`, body: `Hello ${talent.name}, I reviewed your profile and want to discuss a new project.` });
    router.push('/client/messages');
  };

  return (
    <PortalFrame role="client" title="Back to results" subtitle="Freelancer profile and work history" primaryAction={<button className="primary-btn" type="button" onClick={handleHire}>Hire {talent.name}</button>} secondaryAction={<button className="secondary-btn" type="button" onClick={handleMessage}><MessageSquare size={16} />Send Message</button>}>
      <div className="detail-grid">
        <div className="stack-2">
          <Card title="Profile">
            <div className="profile-card">
              <img className="profile-photo" src={talent.avatar} alt={talent.name} />
              <div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>{talent.name}</h2>
                <p className="page-subtitle">{talent.title}</p>
              </div>
              <div className="chips">
                <span className="badge"><MapPin size={12} /> {talent.location}</span>
                <StatusBadge status={talent.availability === 'Available now' ? 'active' : 'waiting'} />
                <span className="badge"><Star size={12} /> {talent.rating.toFixed(1)} ({talent.reviewCount})</span>
              </div>
              <div className="split" style={{ width: '100%' }}>
                <MetricCard title="Hourly rate" value={formatMoney(talent.rate)} detail="Per hour" />
                <MetricCard title="Min engagement" value="20 hrs/wk" detail="Recommended minimum" />
              </div>
              <div className="stacked-actions" style={{ width: '100%' }}>
                <button className="primary-btn" type="button" onClick={handleHire}>Hire {talent.name}</button>
                <button className="secondary-btn" type="button" onClick={handleMessage}>Send Message</button>
              </div>
            </div>
          </Card>

          <div className="cards-grid">
            <MetricCard title="Projects" value={String(talent.projects)} detail="Completed across categories" />
            <MetricCard title="Repeat clients" value={String(talent.repeatClients)} detail="Returning engagements" />
            <MetricCard title="Success rate" value={`${talent.successRate}%`} detail="Positive delivery ratio" />
            <MetricCard title="Total hours" value={talent.totalHours.toLocaleString()} detail="Billed hours across projects" />
          </div>

          <Card title="Core skills">
            <div className="chips">
              {talent.skills.map(skill => <span className="badge" key={skill}>{skill}</span>)}
            </div>
          </Card>
        </div>

        <div className="stack-2">
          <Card title="About">
            <div className="tabs">
              {tabs.map(tab => (
                <button key={tab} className={`tab ${selectedTab === tab ? 'active' : ''}`} type="button" onClick={() => setSelectedTab(tab)}>{tab}</button>
              ))}
            </div>
            {selectedTab === 'About' ? (
              <div className="stack-2">
                <p>{talent.about}</p>
                <p>Previously led product design for startup and enterprise products, with a focus on clarity, accessibility, and rapid handoff from design to development.</p>
              </div>
            ) : null}
            {selectedTab === 'Portfolio' ? <p>Selected case studies and layout systems would appear here in a production build.</p> : null}
            {selectedTab === 'Reviews' ? <p>{talent.reviewCount} reviews show strong collaboration, clear communication, and reliable delivery.</p> : null}
            {selectedTab === 'Rates' ? <p>Rate card: {formatMoney(talent.rate)}/hr, flexible weekly bookings, and fixed-scope project pricing available.</p> : null}
          </Card>

          <Card title="Work history">
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-dot success"></span>
                <span>
                  <strong>Senior Product Designer</strong>
                  <p className="caption">LedgerX • Contract • Mar 2021 - Present</p>
                </span>
                <span className="caption">Redesigned merchant dashboard and design system.</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-dot success"></span>
                <span>
                  <strong>UX Designer</strong>
                  <p className="caption">Acme Corp • Full-time • Jan 2018 - Feb 2021</p>
                </span>
                <span className="caption">Built internal admin tools and workflows.</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-dot warning"></span>
                <span>
                  <strong>UI Designer</strong>
                  <p className="caption">Creative Agency • Contract • Jun 2016 - Dec 2017</p>
                </span>
                <span className="caption">Supported launch assets and marketing materials.</span>
              </div>
            </div>
          </Card>

          <div className="split">
            <Card title="Education">
              <p><strong>B.Des in Interaction Design</strong></p>
              <p className="caption">National Institute of Design • 2012 - 2016</p>
            </Card>
            <Card title="Languages">
              <div className="compact-list">
                <div className="compact-item"><span>English</span><span>Fluent</span></div>
                <div className="compact-item"><span>Hindi</span><span>Native</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PortalFrame>
  );
}
