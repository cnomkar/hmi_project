'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type {
  AppState,
  Invoice,
  InvoiceLineItem,
  LoginSession,
  Milestone,
  Project,
  Role,
  SignInInput,
  SignUpInput,
  TimeEntry,
  User
} from '@/lib/types';
import { demoState, sessionStorageKey, stateStorageKey } from '@/lib/seed';
import { makeId } from '@/lib/utils';

type AppContextValue = {
  state: AppState;
  session: LoginSession | null;
  currentUser: User | null;
  signUp: (input: SignUpInput) => { ok: boolean; message: string };
  signIn: (input: SignInInput) => { ok: boolean; message: string };
  signOut: () => void;
  setSession: (session: LoginSession | null) => void;
  updateUser: (userId: string, patch: Partial<User>) => void;
  createProject: (data: Partial<Project> & { title: string; clientId: string }) => Project;
  updateProject: (projectId: string, patch: Partial<Project>) => void;
  updateMilestone: (projectId: string, milestoneId: string, patch: Partial<Milestone>) => void;
  addProjectComment: (projectId: string, comment: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => Invoice;
  updateInvoice: (invoiceId: string, patch: Partial<Invoice>) => void;
  addInvoiceLineItem: (invoiceId: string, item: InvoiceLineItem) => void;
  approveInvoice: (invoiceId: string) => void;
  queryInvoice: (invoiceId: string, reason: string) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => TimeEntry;
  sendMessage: (payload: { fromUserId: string; toUserId: string; threadId: string; body: string }) => void;
  markNotificationRead: (notificationId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'set-session'; session: LoginSession | null }
  | { type: 'create-user'; user: User }
  | { type: 'update-user'; userId: string; patch: Partial<User> }
  | { type: 'create-project'; project: Project }
  | { type: 'update-project'; projectId: string; patch: Partial<Project> }
  | { type: 'update-milestone'; projectId: string; milestoneId: string; patch: Partial<Milestone> }
  | { type: 'add-project-comment'; projectId: string; comment: string }
  | { type: 'create-invoice'; invoice: Invoice }
  | { type: 'update-invoice'; invoiceId: string; patch: Partial<Invoice> }
  | { type: 'add-line-item'; invoiceId: string; item: InvoiceLineItem }
  | { type: 'add-time-entry'; entry: TimeEntry }
  | { type: 'send-message'; message: AppState['messages'][number] }
  | { type: 'mark-notification-read'; notificationId: string };

const broadcastChannelName = 'freelanceflow-sync';

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'set-session':
      return { ...state, session: action.session };
    case 'create-user':
      return { ...state, users: [action.user, ...state.users] };
    case 'update-user':
      return {
        ...state,
        users: state.users.map(user => (user.id === action.userId ? { ...user, ...action.patch } : user))
      };
    case 'create-project':
      return { ...state, projects: [action.project, ...state.projects] };
    case 'update-project':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.projectId ? { ...project, ...action.patch } : project
        )
      };
    case 'update-milestone':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id !== action.projectId
            ? project
            : {
                ...project,
                milestones: project.milestones.map(milestone =>
                  milestone.id === action.milestoneId ? { ...milestone, ...action.patch } : milestone
                )
              }
        )
      };
    case 'add-project-comment':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.projectId
            ? { ...project, comments: [...project.comments, action.comment] }
            : project
        )
      };
    case 'create-invoice':
      return { ...state, invoices: [action.invoice, ...state.invoices] };
    case 'update-invoice':
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.invoiceId ? { ...invoice, ...action.patch } : invoice
        )
      };
    case 'add-line-item':
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.invoiceId
            ? { ...invoice, lineItems: [...invoice.lineItems, action.item] }
            : invoice
        )
      };
    case 'add-time-entry':
      return { ...state, timeEntries: [action.entry, ...state.timeEntries] };
    case 'send-message':
      return { ...state, messages: [action.message, ...state.messages] };
    case 'mark-notification-read':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.notificationId ? { ...notification, read: true } : notification
        )
      };
    default:
      return state;
  }
}

function readStoredState(): AppState {
  if (typeof window === 'undefined') {
    return demoState;
  }

  const rawState = window.localStorage.getItem(stateStorageKey);
  const rawSession = window.localStorage.getItem(sessionStorageKey);

  if (!rawState) {
    return {
      ...demoState,
      session: rawSession ? JSON.parse(rawSession) : null
    };
  }

  try {
    const parsed = JSON.parse(rawState) as AppState;
    return {
      ...demoState,
      ...parsed,
      session: rawSession ? JSON.parse(rawSession) : parsed.session ?? null
    };
  } catch {
    return {
      ...demoState,
      session: rawSession ? JSON.parse(rawSession) : null
    };
  }
}

function persistState(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(stateStorageKey, JSON.stringify({ ...state, session: null }));
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(state.session));
}

function notifySync(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }

  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(broadcastChannelName) : null;
  channel?.postMessage({ type: 'state-update', state });
  channel?.close();
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, demoState, () => readStoredState());

  useEffect(() => {
    persistState(state);
    notifySync(state);
  }, [state]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return;
    }

    const channel = new BroadcastChannel(broadcastChannelName);
    channel.onmessage = event => {
      if (event.data?.type === 'state-update' && event.data.state) {
        dispatch({ type: 'hydrate', state: event.data.state as AppState });
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === stateStorageKey || event.key === sessionStorageKey) {
        dispatch({ type: 'hydrate', state: readStoredState() });
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const api = useMemo<AppContextValue>(() => {
    const currentUser = state.session ? state.users.find(user => user.id === state.session?.userId) ?? null : null;

    const upsertSession = (session: LoginSession | null) => {
      dispatch({ type: 'set-session', session });
    };

    return {
      state,
      session: state.session,
      currentUser,
      signUp: (input: SignUpInput) => {
        const exists = state.users.some(user => user.email.toLowerCase() === input.email.toLowerCase());

        if (exists) {
          return { ok: false, message: 'An account with that email already exists.' };
        }

        const user: User = {
          id: makeId('user'),
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role,
          avatar: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="#5646ff"/><text x="60" y="72" font-family="Arial" font-size="36" font-weight="700" text-anchor="middle" fill="#fff">${input.name
              .split(' ')
              .map(part => part[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}</text></svg>`
          )}`,
          company: input.company
        };

        dispatch({ type: 'create-user', user });
        upsertSession({ userId: user.id, role: input.role });
        return { ok: true, message: 'Account created and signed in.' };
      },
      signIn: (input: SignInInput) => {
        const user = state.users.find(
          item => item.email.toLowerCase() === input.email.toLowerCase() && item.password === input.password && item.role === input.role
        );

        if (!user) {
          return { ok: false, message: 'Invalid credentials for that role.' };
        }

        upsertSession({ userId: user.id, role: user.role });
        return { ok: true, message: 'Signed in successfully.' };
      },
      signOut: () => upsertSession(null),
      setSession: upsertSession,
      updateUser: (userId, patch) => dispatch({ type: 'update-user', userId, patch }),
      createProject: data => {
        const project: Project = {
          id: makeId('proj'),
          title: data.title,
          clientId: data.clientId,
          freelancerId: data.freelancerId,
          clientName: data.clientName ?? currentUser?.company ?? currentUser?.name ?? 'Client',
          freelancerName: data.freelancerName,
          type: data.type ?? 'Fixed',
          category: data.category ?? 'Web Development',
          visibility: data.visibility ?? 'Public Listing',
          budget: data.budget ?? 0,
          spent: data.spent ?? 0,
          status: data.status ?? 'draft',
          dueDate: data.dueDate ?? new Date().toISOString(),
          progress: data.progress ?? 0,
          description: data.description ?? '',
          skills: data.skills ?? [],
          milestones: data.milestones ?? [],
          comments: data.comments ?? []
        };

        dispatch({ type: 'create-project', project });
        return project;
      },
      updateProject: (projectId, patch) => dispatch({ type: 'update-project', projectId, patch }),
      updateMilestone: (projectId, milestoneId, patch) =>
        dispatch({ type: 'update-milestone', projectId, milestoneId, patch }),
      addProjectComment: (projectId, comment) => dispatch({ type: 'add-project-comment', projectId, comment }),
      createInvoice: invoice => {
        const created: Invoice = { ...invoice, id: makeId('inv') };
        dispatch({ type: 'create-invoice', invoice: created });
        return created;
      },
      updateInvoice: (invoiceId, patch) => dispatch({ type: 'update-invoice', invoiceId, patch }),
      addInvoiceLineItem: (invoiceId, item) => dispatch({ type: 'add-line-item', invoiceId, item }),
      approveInvoice: invoiceId =>
        dispatch({
          type: 'update-invoice',
          invoiceId,
          patch: { status: 'paid' }
        }),
      queryInvoice: (invoiceId, reason) => {
        dispatch({
          type: 'update-invoice',
          invoiceId,
          patch: { status: 'query', notes: reason }
        });
      },
      addTimeEntry: entry => {
        const created: TimeEntry = { ...entry, id: makeId('time') };
        dispatch({ type: 'add-time-entry', entry: created });
        return created;
      },
      sendMessage: payload => {
        dispatch({
          type: 'send-message',
          message: {
            id: makeId('msg'),
            ...payload,
            createdAt: new Date().toISOString(),
            read: false
          }
        });
      },
      markNotificationRead: notificationId => dispatch({ type: 'mark-notification-read', notificationId })
    };
  }, [state]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}

export function useSessionRole(role: Role) {
  const { session, currentUser } = useApp();
  return session?.role === role ? currentUser : null;
}
