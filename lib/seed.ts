import type { AppState, Invoice, Message, Notification, Project, TalentProfile, TimeEntry, User } from '@/lib/types';
import { createAvatarDataUri, makeId } from '@/lib/utils';

const now = new Date();

function dateDaysFromNow(days: number) {
  const value = new Date(now);
  value.setDate(value.getDate() + days);
  return value.toISOString();
}

const clientAvatar = createAvatarDataUri('Rohan Kapoor', ['#5646ff', '#7f73ff']);
const freelancerAvatar = createAvatarDataUri('Aarav Mehta', ['#1f8a70', '#69dbc2']);

export const demoUsers: User[] = [
  {
    id: 'user_client_rohan',
    name: 'Rohan Kapoor',
    email: 'rohan@acme.com',
    password: 'password123',
    role: 'client',
    avatar: clientAvatar,
    company: 'Acme Corporation',
    location: 'Bangalore, IN'
  },
  {
    id: 'user_freelancer_aarav',
    name: 'Aarav Mehta',
    email: 'aarav@freelanceflow.dev',
    password: 'password123',
    role: 'freelancer',
    avatar: freelancerAvatar,
    title: 'Senior Product Designer',
    hourlyRate: 3500,
    location: 'Mumbai, India'
  }
];

export const demoTalents: TalentProfile[] = [
  {
    id: 'talent_aarav',
    userId: 'user_freelancer_aarav',
    name: 'Aarav Mehta',
    title: 'Senior Product Designer',
    location: 'Pune',
    rating: 5,
    reviewCount: 28,
    rate: 3500,
    avatar: freelancerAvatar,
    availability: 'Available now',
    skills: ['Figma', 'React', 'Design Systems', 'Wireframing'],
    tags: ['Product Design', 'UI/UX', 'SaaS'],
    about: 'Detail-oriented product designer focused on clean systems, fast handoffs, and polished interface quality.',
    projects: 42,
    repeatClients: 18,
    successRate: 99,
    totalHours: 1240,
    experience: '8+ years',
    featured: true
  },
  {
    id: 'talent_priya',
    userId: 'user_client_rohan',
    name: 'Priya Nair',
    title: 'Senior UI/UX Designer',
    location: 'Kochi',
    rating: 4.5,
    reviewCount: 15,
    rate: 4200,
    avatar: createAvatarDataUri('Priya Nair', ['#f97316', '#fdba74']),
    availability: 'Limited',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    tags: ['UI Design', 'Research', 'Systems'],
    about: 'Crafts intuitive app experiences and product narratives across mobile and web.',
    projects: 27,
    repeatClients: 11,
    successRate: 96,
    totalHours: 980,
    experience: '7+ years'
  },
  {
    id: 'talent_roshan',
    userId: 'user_client_rohan',
    name: 'Roshan Verma',
    title: 'DevOps Engineer',
    location: 'Bangalore',
    rating: 4,
    reviewCount: 15,
    rate: 5000,
    avatar: createAvatarDataUri('Roshan Verma', ['#16a34a', '#86efac']),
    availability: 'In project',
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
    tags: ['Cloud', 'Automation', 'Infra'],
    about: 'Builds resilient infrastructure and delivery pipelines with observability first.',
    projects: 22,
    repeatClients: 9,
    successRate: 94,
    totalHours: 860,
    experience: '6+ years'
  },
  {
    id: 'talent_sneha',
    userId: 'user_client_rohan',
    name: 'Sneha Iyer',
    title: 'Brand Strategist',
    location: 'Mumbai',
    rating: 5,
    reviewCount: 64,
    rate: 2800,
    avatar: createAvatarDataUri('Sneha Iyer', ['#ec4899', '#f9a8d4']),
    availability: 'Available now',
    skills: ['Brand Identity', 'Copywriting', 'Positioning', 'Research'],
    tags: ['Brand', 'Strategy', 'Content'],
    about: 'Shapes brand systems and messaging architecture for growing startups.',
    projects: 31,
    repeatClients: 14,
    successRate: 98,
    totalHours: 720,
    experience: '9+ years'
  }
];

export const demoProjects: Project[] = [
  {
    id: 'proj_ui_redesign',
    title: 'UI Redesign',
    clientId: 'user_client_rohan',
    freelancerId: 'user_freelancer_aarav',
    clientName: 'Acme Corporation',
    freelancerName: 'Aarav Mehta',
    type: 'Fixed',
    category: 'Web Development',
    visibility: 'Public Listing',
    budget: 12500,
    spent: 8250,
    status: 'active',
    dueDate: dateDaysFromNow(17),
    progress: 65,
    description: 'Redesign the product dashboard, billing surface, and talent workflows for the HMI project.',
    skills: ['Figma', 'React', 'Design Systems', 'Accessibility'],
    comments: ['Client approved the latest prototype.', 'Waiting on invoice clearance for milestone two.'],
    milestones: [
      {
        id: makeId('milestone'),
        title: 'Discovery & Research',
        amount: 1000,
        dueDate: dateDaysFromNow(-10),
        completed: true,
        status: 'done'
      },
      {
        id: makeId('milestone'),
        title: 'Wireframing',
        amount: 1250,
        dueDate: dateDaysFromNow(-2),
        completed: true,
        status: 'done'
      },
      {
        id: makeId('milestone'),
        title: 'High-Fidelity Mockups',
        amount: 2250,
        dueDate: dateDaysFromNow(2),
        completed: false,
        status: 'review'
      },
      {
        id: makeId('milestone'),
        title: 'Prototyping & Handoff',
        amount: 2250,
        dueDate: dateDaysFromNow(14),
        completed: false,
        status: 'not-started'
      }
    ]
  },
  {
    id: 'proj_api_integration',
    title: 'API Integration',
    clientId: 'user_client_rohan',
    freelancerId: 'user_freelancer_aarav',
    clientName: 'Acme Corporation',
    freelancerName: 'Aarav Mehta',
    type: 'Hourly',
    category: 'Backend',
    visibility: 'Invited',
    budget: 960,
    spent: 960,
    status: 'in-review',
    dueDate: dateDaysFromNow(7),
    progress: 40,
    description: 'Integrate the project and invoice state with the dashboard so both sides stay synced.',
    skills: ['Node.js', 'TypeScript', 'APIs'],
    comments: ['Waiting on invoice review from the client side.'],
    milestones: [
      {
        id: makeId('milestone'),
        title: 'Auth and session flow',
        amount: 420,
        dueDate: dateDaysFromNow(-1),
        completed: true,
        status: 'done'
      },
      {
        id: makeId('milestone'),
        title: 'Billing sync',
        amount: 540,
        dueDate: dateDaysFromNow(4),
        completed: false,
        status: 'in-progress'
      }
    ]
  },
  {
    id: 'proj_brand_refresh',
    title: 'Brand Refresh',
    clientId: 'user_client_rohan',
    freelancerId: 'user_freelancer_aarav',
    clientName: 'Acme Corporation',
    freelancerName: 'Sneha Iyer',
    type: 'Fixed',
    category: 'Branding',
    visibility: 'Public Listing',
    budget: 18000,
    spent: 18000,
    status: 'overdue',
    dueDate: dateDaysFromNow(-2),
    progress: 78,
    description: 'Visual refresh for landing, social, and proposal assets.',
    skills: ['Brand Identity', 'Copywriting'],
    comments: ['Needs approval for final logo lockup.'],
    milestones: [
      {
        id: makeId('milestone'),
        title: 'Research',
        amount: 2500,
        dueDate: dateDaysFromNow(-15),
        completed: true,
        status: 'done'
      },
      {
        id: makeId('milestone'),
        title: 'Visual direction',
        amount: 4500,
        dueDate: dateDaysFromNow(-6),
        completed: true,
        status: 'done'
      },
      {
        id: makeId('milestone'),
        title: 'Rollout kit',
        amount: 11000,
        dueDate: dateDaysFromNow(-1),
        completed: false,
        status: 'review'
      }
    ]
  }
];

const baseInvoice = {
  taxRate: 0.18,
  currency: 'INR' as const
};

export const demoInvoices: Invoice[] = [
  {
    id: 'inv_2024_032',
    projectId: 'proj_ui_redesign',
    clientId: 'user_client_rohan',
    clientName: 'Acme Corporation',
    freelancerId: 'user_freelancer_aarav',
    freelancerName: 'Aarav Mehta',
    issueDate: dateDaysFromNow(-14),
    dueDate: dateDaysFromNow(16),
    status: 'pending',
    notes: 'Wireframes and component library build for the redesign sprint.',
    pdfLabel: 'INV-2024-032',
    ...baseInvoice,
    lineItems: [
      {
        id: makeId('item'),
        title: 'Homepage wireframes',
        description: 'Desktop and mobile variations',
        quantity: 8,
        rate: 3500
      },
      {
        id: makeId('item'),
        title: 'Component library',
        description: 'Figma setup with variants',
        quantity: 5,
        rate: 3500
      }
    ]
  },
  {
    id: 'inv_2024_031',
    projectId: 'proj_api_integration',
    clientId: 'user_client_rohan',
    clientName: 'Acme Corporation',
    freelancerId: 'user_freelancer_aarav',
    freelancerName: 'Aarav Mehta',
    issueDate: dateDaysFromNow(-22),
    dueDate: dateDaysFromNow(-4),
    status: 'paid',
    notes: 'Integration and deployment support.',
    pdfLabel: 'INV-2024-031',
    ...baseInvoice,
    lineItems: [
      {
        id: makeId('item'),
        title: 'API integration support',
        description: 'Hooked project state into dashboards',
        quantity: 12,
        rate: 3750
      }
    ]
  },
  {
    id: 'inv_2024_028',
    projectId: 'proj_brand_refresh',
    clientId: 'user_client_rohan',
    clientName: 'Acme Corporation',
    freelancerId: 'user_freelancer_aarav',
    freelancerName: 'Sneha Iyer',
    issueDate: dateDaysFromNow(-8),
    dueDate: dateDaysFromNow(-1),
    status: 'overdue',
    notes: 'Brand refresh milestone invoice pending approval.',
    pdfLabel: 'INV-2024-028',
    ...baseInvoice,
    lineItems: [
      {
        id: makeId('item'),
        title: 'Brand audit',
        description: 'Strategy and competitive analysis',
        quantity: 4,
        rate: 4200
      },
      {
        id: makeId('item'),
        title: 'Identity explorations',
        description: 'Multiple logo directions',
        quantity: 3,
        rate: 4200
      }
    ]
  }
];

export const demoTimeEntries: TimeEntry[] = [
  {
    id: 'time_1',
    projectId: 'proj_ui_redesign',
    projectTitle: 'UI Redesign',
    task: 'Frontend Rework',
    skill: 'React',
    date: dateDaysFromNow(-1),
    durationMinutes: 140,
    note: 'Refined dashboard cards and approval drawer.',
    billable: true
  },
  {
    id: 'time_2',
    projectId: 'proj_api_integration',
    projectTitle: 'API Integration',
    task: 'Billing Sync',
    skill: 'TypeScript',
    date: dateDaysFromNow(-2),
    durationMinutes: 75,
    note: 'Connected invoice approval to the shared state store.',
    billable: true
  },
  {
    id: 'time_3',
    projectId: 'proj_brand_refresh',
    projectTitle: 'Brand Refresh',
    task: 'Creative Direction',
    skill: 'Design',
    date: dateDaysFromNow(-4),
    durationMinutes: 210,
    note: 'Explored logo and palette options.',
    billable: false
  }
];

export const demoMessages: Message[] = [
  {
    id: 'msg_1',
    fromUserId: 'user_freelancer_aarav',
    toUserId: 'user_client_rohan',
    threadId: 'thread_ui_redesign',
    body: 'I pushed the revised invoice line items. Approve when ready and it will sync to my side immediately.',
    createdAt: dateDaysFromNow(-1),
    read: false
  },
  {
    id: 'msg_2',
    fromUserId: 'user_client_rohan',
    toUserId: 'user_freelancer_aarav',
    threadId: 'thread_ui_redesign',
    body: 'Looks good. I am reviewing the milestone status now.',
    createdAt: dateDaysFromNow(-1),
    read: true
  }
];

export const demoNotifications: Notification[] = [
  {
    id: 'note_1',
    title: 'Invoice awaiting approval',
    body: 'INV-2024-032 is pending in the client portal.',
    createdAt: dateDaysFromNow(-1),
    read: false,
    level: 'warning'
  },
  {
    id: 'note_2',
    title: 'Milestone approved',
    body: 'Discovery and wireframes were approved for UI Redesign.',
    createdAt: dateDaysFromNow(-3),
    read: true,
    level: 'success'
  }
];

export const demoState: AppState = {
  users: demoUsers,
  session: null,
  talents: demoTalents,
  projects: demoProjects,
  invoices: demoInvoices,
  timeEntries: demoTimeEntries,
  messages: demoMessages,
  notifications: demoNotifications
};

export const stateStorageKey = 'freelanceflow-state';
export const sessionStorageKey = 'freelanceflow-session';
