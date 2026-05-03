'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/storage';
import type { Role } from '@/lib/types';

const roleOptions: Array<{ value: Role; label: string }> = [
  { value: 'client', label: 'Client account' },
  { value: 'freelancer', label: 'Freelancer account' }
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, session } = useApp();
  const [role, setRole] = useState<Role>('client');
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@company.com');
  const [password, setPassword] = useState('password123');
  const [company, setCompany] = useState('Acme Corporation');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!session) {
      return;
    }

    router.replace(session.role === 'client' ? '/client/dashboard' : '/freelancers/dashboard');
  }, [router, session]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = signUp({ role, name, email, password, company });
    setMessage(result.message);

    if (result.ok) {
      router.push(role === 'client' ? '/client/dashboard' : '/freelancers/dashboard');
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div>
          <div className="brand" style={{ padding: 0, marginBottom: 24 }}>
            <div className="brand-mark">F</div>
            <div className="brand-name">
              <strong>FREELANCEFLOW</strong>
              <span>NEW ACCOUNT</span>
            </div>
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', lineHeight: 0.98, margin: '0 0 16px' }}>Create your account in minutes.</h1>
          <p style={{ fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7 }}>
            Start as a client or freelancer. The app stores accounts locally and keeps both sides in sync without OAuth.
          </p>
        </div>

        <div className="feature-card" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'white' }}>
          <h4>What is included</h4>
          <p style={{ color: 'rgba(255,255,255,0.82)' }}>Project posting, talent review, invoices, time tracking, and live updates between portals.</p>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-stack">
          <div>
            <span className="eyebrow">Sign up</span>
            <h2 style={{ margin: '0.4rem 0 0', fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>Set up your workspace</h2>
            <p className="page-subtitle">Choose the role that matches what you want to do in the app.</p>
          </div>

          <div className="chips">
            {roleOptions.map(option => (
              <button key={option.value} type="button" className={`tab ${role === option.value ? 'active' : ''}`} onClick={() => setRole(option.value)}>
                <UserRound size={14} />
                {option.label}
              </button>
            ))}
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span>Full name</span>
              <input className="input" value={name} onChange={event => setName(event.target.value)} required />
            </label>

            <label className="field">
              <span>Email</span>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input className="input" style={{ paddingLeft: 42 }} value={email} onChange={event => setEmail(event.target.value)} type="email" required />
              </div>
            </label>

            <label className="field">
              <span>Password</span>
              <div style={{ position: 'relative' }}>
                <LockKeyhole size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input className="input" style={{ paddingLeft: 42 }} value={password} onChange={event => setPassword(event.target.value)} type="password" minLength={8} required />
              </div>
            </label>

            {role === 'client' ? (
              <label className="field">
                <span>Company</span>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input className="input" style={{ paddingLeft: 42 }} value={company} onChange={event => setCompany(event.target.value)} />
                </div>
              </label>
            ) : null}

            {message ? <p className="caption">{message}</p> : null}

            <button className="primary-btn" type="submit">
              Create account
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="caption">
            Already registered? <Link href="/auth/sign-in">Sign in here.</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
