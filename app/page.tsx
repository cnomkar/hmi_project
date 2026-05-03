'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, LayoutDashboard, MessageSquare, ShieldCheck, TimerReset, Users2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/storage';

const featureItems = [
  {
    icon: LayoutDashboard,
    title: 'Client and freelancer dashboards',
    copy: 'Separate portals for hiring, project tracking, time logging, and billing.'
  },
  {
    icon: Users2,
    title: 'Role-based accounts',
    copy: 'Email/password login and signup only, no OAuth dependency.'
  },
  {
    icon: FileText,
    title: 'Invoices and approvals',
    copy: 'Approve invoices on the client side and see the status update for freelancers instantly.'
  },
  {
    icon: MessageSquare,
    title: 'Shared messages and updates',
    copy: 'Project changes, comments, and notifications are synchronized in real time.'
  }
];

export default function HomePage() {
  const router = useRouter();
  const { session } = useApp();

  useEffect(() => {
    if (!session) {
      return;
    }

    router.replace(session.role === 'client' ? '/client/dashboard' : '/freelancers/dashboard');
  }, [router, session]);

  if (session) {
    return <main className="app-shell" style={{ display: 'grid', placeItems: 'center', padding: 24 }}>Redirecting...</main>;
  }

  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div>
          <div className="brand" style={{ padding: 0, marginBottom: 28 }}>
            <div className="brand-mark">F</div>
            <div className="brand-name">
              <strong>FREELANCEFLOW</strong>
              <span>THE CURATED LEDGER</span>
            </div>
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', lineHeight: 0.98, margin: '0 0 16px' }}>
            The curated ledger for modern freelance teams.
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.7 }}>
            Manage projects, talent, invoices, and live time updates from one responsive app built for clients and freelancers.
          </p>
        </div>

        <div className="stack-2">
          {featureItems.map(item => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'white' }}>
                <div className="pill" style={{ background: 'rgba(255,255,255,0.14)', color: 'white', width: 'fit-content' }}>
                  <Icon size={16} />
                </div>
                <h4>{item.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.82)' }}>{item.copy}</p>
              </article>
            );
          })}
        </div>

        <p className="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>Demo logins: rohan@acme.com / password123 and aarav@freelanceflow.dev / password123</p>
      </section>

      <section className="auth-card">
        <div className="auth-stack">
          <div>
            <span className="eyebrow">Start here</span>
            <h2 style={{ margin: '0.4rem 0 0', fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>Choose your workspace</h2>
            <p className="page-subtitle">Sign in or create a new account with email and password.</p>
          </div>

          <div className="split">
            <Link className="primary-btn" href="/auth/sign-in">
              Sign in
              <ArrowRight size={16} />
            </Link>
            <Link className="secondary-btn" href="/auth/sign-up">
              Create account
            </Link>
          </div>

          <div className="hero-card">
            <div className="hero-stats">
              <div className="hero-stat"><strong>2</strong><span className="caption">roles</span></div>
              <div className="hero-stat"><strong>Live</strong><span className="caption">sync</span></div>
              <div className="hero-stat"><strong>Vercel</strong><span className="caption">ready</span></div>
            </div>
            <div className="top-curve">
              <p className="caption">Highlights</p>
              <div className="compact-list">
                <div className="compact-item"><span>Invoice approval sync</span><CheckCircle2 size={16} /></div>
                <div className="compact-item"><span>Shared project updates</span><CheckCircle2 size={16} /></div>
                <div className="compact-item"><span>Responsive screens</span><CheckCircle2 size={16} /></div>
                <div className="compact-item"><span>Password-only auth</span><ShieldCheck size={16} /></div>
                <div className="compact-item"><span>Time logging and revenue</span><TimerReset size={16} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
