'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/storage';
import type { Role } from '@/lib/types';

const roleOptions: Array<{ value: Role; label: string }> = [
  { value: 'client', label: 'Client' },
  { value: 'freelancer', label: 'Freelancer' }
];

export default function SignInPage() {
  const router = useRouter();
  const { signIn, session } = useApp();
  const [role, setRole] = useState<Role>('client');
  const [email, setEmail] = useState('rohan@acme.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!session) {
      return;
    }

    router.replace(session.role === 'client' ? '/client/dashboard' : '/freelancers/dashboard');
  }, [router, session]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = signIn({ role, email, password });
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
              <span>ACCOUNT ACCESS</span>
            </div>
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', lineHeight: 0.98, margin: '0 0 16px' }}>Sign in to your workspace.</h1>
          <p style={{ fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7 }}>
            Use your email and password to enter the client or freelancer dashboard. No OAuth, no social login.
          </p>
        </div>

        <div className="feature-card" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'white' }}>
          <h4>Demo accounts</h4>
          <p style={{ color: 'rgba(255,255,255,0.82)' }}>Client: rohan@acme.com / password123</p>
          <p style={{ color: 'rgba(255,255,255,0.82)' }}>Freelancer: aarav@freelanceflow.dev / password123</p>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-stack">
          <div>
            <span className="eyebrow">Sign in</span>
            <h2 style={{ margin: '0.4rem 0 0', fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>Welcome back</h2>
            <p className="page-subtitle">Resume your active contracts, invoices, and messages.</p>
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
                <input className="input" style={{ paddingLeft: 42 }} value={password} onChange={event => setPassword(event.target.value)} type="password" required />
              </div>
            </label>

            {message ? <p className="caption">{message}</p> : null}

            <button className="primary-btn" type="submit">
              Continue
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="caption">
            Need an account? <Link href="/auth/sign-up">Create one here.</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
