'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bell, ChevronDown, Menu, Search, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Plus, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/storage';
import type { Role } from '@/lib/types';
import { SearchField } from '@/components/common';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

const clientNav: NavItem[] = [
  { href: '/client/dashboard', label: 'Overview', icon: PanelLeftOpen },
  { href: '/client/find-talent', label: 'Find Talent', icon: Search },
  { href: '/client/my-projects', label: 'My Projects', icon: PanelLeftClose },
  { href: '/client/contracts', label: 'Contracts', icon: ChevronDown },
  { href: '/client/invoices', label: 'Invoices', icon: Settings },
  { href: '/client/messages', label: 'Messages', icon: Bell },
  { href: '/client/settings', label: 'Settings', icon: Settings }
];

const freelancerNav: NavItem[] = [
  { href: '/freelancers/dashboard', label: 'Dashboard', icon: PanelLeftOpen },
  { href: '/freelancers/projects', label: 'Projects', icon: PanelLeftClose },
  { href: '/freelancers/time-log', label: 'Time Log', icon: Search },
  { href: '/freelancers/invoices', label: 'Invoices', icon: Settings },
  { href: '/freelancers/earnings', label: 'Earnings', icon: ChevronDown },
  { href: '/freelancers/clients', label: 'Clients', icon: Bell },
  { href: '/freelancers/settings', label: 'Settings', icon: Settings }
];

export function PortalFrame({
  role,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  search,
  onSearch,
  children
}: {
  role: Role;
  title?: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  search?: string;
  onSearch?: (value: string) => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, session, state, signOut, markNotificationRead } = useApp();
  const nav = role === 'client' ? clientNav : freelancerNav;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadNotifications = useMemo(
    () => state.notifications.filter(notification => !notification.read),
    [state.notifications]
  );

  const visibleNotifications = notificationsOpen ? state.notifications.slice(0, 4) : [];

  const topCta = primaryAction ?? (
    <button
      type="button"
      className="primary-btn"
      onClick={() => router.push(role === 'client' ? '/client/post-project' : '/freelancers/invoices')}
    >
      <Plus size={16} />
      {role === 'client' ? 'Post a Project' : 'New Invoice'}
    </button>
  );

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div className="brand-name">
            <strong>FREELANCEFLOW</strong>
            <span>FOR {role === 'client' ? 'HIRERS' : 'FREELANCERS'}</span>
          </div>
        </div>

        <nav className="nav-list">
          {nav.map(item => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link className={`nav-link ${active ? 'active' : ''}`} href={item.href} key={item.href}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="secondary-btn"
            type="button"
            onClick={() => {
              signOut();
              router.replace('/auth/sign-in');
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="icon-btn mobile-only" type="button" onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
          </button>
          {onSearch ? <SearchField value={search ?? ''} onChange={onSearch} placeholder={role === 'client' ? 'Search projects, invoices, talent...' : 'Search projects, clients, entries...'} /> : <div className="hidden-mobile" />}
          <div className="topbar-actions">
            <button className="icon-btn" type="button" onClick={() => setNotificationsOpen(v => !v)}>
              <Bell size={18} />
            </button>
            <button className="secondary-btn hidden-mobile" type="button" onClick={() => router.push('/auth/sign-in')}>
              {session ? currentUser?.name ?? 'Account' : 'Sign in'}
            </button>
            {secondaryAction}
            {topCta}
            <button className="icon-btn" type="button" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X size={18} /> : currentUser?.avatar ? <img className="avatar" src={currentUser.avatar} alt={currentUser.name} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </header>

        {title ? (
          <div className="page">
            <div className="page-header">
              <div>
                <h1 className="page-title">{title}</h1>
                {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
              </div>
              <div className="inline-actions">
                {role === 'client' ? (
                  <Link className="secondary-btn" href="/client/find-talent">
                    Find Talent
                  </Link>
                ) : (
                  <Link className="secondary-btn" href="/freelancers/time-log">
                    Log Time
                  </Link>
                )}
                {topCta}
              </div>
            </div>
            {children}
          </div>
        ) : (
          <div className="page">{children}</div>
        )}
      </main>

      {notificationsOpen ? (
        <div className="modal-backdrop" onClick={() => setNotificationsOpen(false)}>
          <div className="drawer" onClick={event => event.stopPropagation()} style={{ width: 'min(100%, 420px)' }}>
            <div className="sheet-header">
              <div>
                <h3>Notifications</h3>
                <p className="caption">{unreadNotifications.length} unread</p>
              </div>
              <button className="icon-btn" type="button" onClick={() => setNotificationsOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="sheet-body timeline">
              {visibleNotifications.length ? visibleNotifications.map(notification => (
                <button
                  key={notification.id}
                  className="timeline-item"
                  type="button"
                  onClick={() => markNotificationRead(notification.id)}
                  style={{ textAlign: 'left', width: '100%' }}
                >
                  <span className={`timeline-dot ${notification.level}`}></span>
                  <span>
                    <strong>{notification.title}</strong>
                    <p className="caption">{notification.body}</p>
                  </span>
                  <span className="caption">{new Date(notification.createdAt).toLocaleDateString()}</span>
                </button>
              )) : <div className="empty-state">No notifications yet.</div>}
            </div>
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="modal-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="drawer" onClick={event => event.stopPropagation()} style={{ width: 'min(100%, 360px)' }}>
            <div className="sheet-header">
              <div>
                <h3>Menu</h3>
                <p className="caption">{currentUser?.name ?? 'Guest'}</p>
              </div>
              <button className="icon-btn" type="button" onClick={() => setMenuOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="sheet-body stack-2">
              {nav.map(item => {
                const Icon = item.icon;
                return (
                  <Link className={`nav-link ${pathname === item.href ? 'active' : ''}`} href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                className="secondary-btn"
                type="button"
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                  router.replace('/auth/sign-in');
                }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
