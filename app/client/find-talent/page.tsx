'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Filter, MapPin, Search, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PortalFrame } from '@/components/portal-frame';
import { Card, MetricCard, StatusBadge, formatMoney } from '@/components/common';
import { useApp } from '@/lib/storage';
import type { TalentProfile } from '@/lib/types';

export default function FindTalentPage() {
  const router = useRouter();
  const { state, createProject, sendMessage } = useApp();
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [minRating, setMinRating] = useState(false);

  const talents = useMemo(() => {
    return state.talents.filter(talent => {
      const matchesSearch = [talent.name, talent.title, talent.location, ...talent.skills].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesLocation = selectedLocation === 'All' || talent.location === selectedLocation;
      const matchesRating = !minRating || talent.rating >= 4;
      return matchesSearch && matchesLocation && matchesRating;
    });
  }, [minRating, search, selectedLocation, state.talents]);

  const locations = ['All', ...Array.from(new Set(state.talents.map(talent => talent.location)))];

  const handleHire = (talent: TalentProfile) => {
    const currentUser = state.users.find(user => user.id === state.session?.userId);
    createProject({
      title: `${talent.name} Engagement`,
      clientId: currentUser?.id ?? 'user_client_rohan',
      freelancerId: talent.userId,
      freelancerName: talent.name,
      clientName: currentUser?.company ?? currentUser?.name ?? 'Client',
      category: talent.title,
      visibility: 'Invited',
      status: 'active',
      progress: 5,
      budget: talent.rate * 20,
      spent: 0,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      description: talent.about,
      skills: talent.skills,
      comments: ['Talent hired from search results.'],
      milestones: []
    });
    sendMessage({ fromUserId: state.session?.userId ?? 'user_client_rohan', toUserId: talent.userId, threadId: `thread_${talent.id}`, body: `Hi ${talent.name}, we would like to discuss a new project. Please check your dashboard.` });
    router.push('/client/my-projects');
  };

  return (
    <PortalFrame role="client" title="Find Talent" subtitle="Browse freelancers, filter by skill, and start a project." search={search} onSearch={setSearch}>
      <div className="workspace-grid">
        <Card title="Filters" subtitle="Tighten the search by location and quality" action={<Filter size={18} />}>
          <div className="stack-2">
            <div className="chips">
              {locations.map(location => (
                <button key={location} className={`tab ${selectedLocation === location ? 'active' : ''}`} type="button" onClick={() => setSelectedLocation(location)}>
                  {location}
                </button>
              ))}
            </div>
            <label className="field">
              <span>Minimum rating</span>
              <button className={`tab ${minRating ? 'active' : ''}`} type="button" onClick={() => setMinRating(value => !value)}>
                <Star size={14} />
                4+ only
              </button>
            </label>
            <MetricCard title="Showing freelancers" value={String(talents.length)} detail={`${state.talents.length} total in the directory`} />
          </div>
        </Card>

        <Card title="Featured freelancers" subtitle="Hire directly from the shortlist">
          <div className="cards-grid">
            {talents.map(talent => (
              <article className="card" key={talent.id}>
                <div className="row-head">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img className="avatar" src={talent.avatar} alt={talent.name} style={{ width: 48, height: 48 }} />
                    <div>
                      <h4>{talent.name}</h4>
                      <p className="caption">{talent.title}</p>
                    </div>
                  </div>
                  <Bookmark size={16} />
                </div>
                <div className="mini-legend" style={{ marginTop: 10 }}>
                  <span className="legend success"><MapPin size={12} /> {talent.location}</span>
                  <span className="legend warning"><Star size={12} /> {talent.rating.toFixed(1)} ({talent.reviewCount})</span>
                </div>
                <div className="chips" style={{ marginTop: 14 }}>
                  {talent.skills.slice(0, 4).map(skill => <span className="badge" key={skill}>{skill}</span>)}
                </div>
                <div className="row-head" style={{ marginTop: 14, alignItems: 'center' }}>
                  <div>
                    <p className="caption">Rate</p>
                    <strong>{formatMoney(talent.rate)}/hr</strong>
                  </div>
                  <StatusBadge status={talent.availability === 'Available now' ? 'active' : 'waiting'} />
                </div>
                <div className="row-actions" style={{ marginTop: 14 }}>
                  <Link className="secondary-btn" href={`/client/talent/${talent.id}`}>View profile</Link>
                  <button className="primary-btn" type="button" onClick={() => handleHire(talent)}>Hire</button>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </PortalFrame>
  );
}
