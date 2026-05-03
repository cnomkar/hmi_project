export type Role = 'client' | 'freelancer';

export type LoginSession = {
  userId: string;
  role: Role;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  company?: string;
  location?: string;
  title?: string;
  hourlyRate?: number;
};

export type TalentProfile = {
  id: string;
  userId: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  rate: number;
  avatar: string;
  availability: 'Available now' | 'In project' | 'Limited';
  skills: string[];
  tags: string[];
  about: string;
  projects: number;
  repeatClients: number;
  successRate: number;
  totalHours: number;
  experience: string;
  featured?: boolean;
};

export type Milestone = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  completed: boolean;
  status: 'not-started' | 'in-progress' | 'review' | 'done';
};

export type Project = {
  id: string;
  title: string;
  clientId: string;
  freelancerId?: string;
  clientName: string;
  freelancerName?: string;
  type: 'Fixed' | 'Hourly';
  category: string;
  visibility: 'Public Listing' | 'Invited';
  budget: number;
  spent: number;
  status: 'draft' | 'active' | 'in-review' | 'completed' | 'on-hold' | 'overdue';
  dueDate: string;
  progress: number;
  description: string;
  skills: string[];
  milestones: Milestone[];
  comments: string[];
};

export type InvoiceLineItem = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  rate: number;
};

export type Invoice = {
  id: string;
  projectId: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue' | 'query';
  currency: 'INR';
  taxRate: number;
  lineItems: InvoiceLineItem[];
  notes: string;
  pdfLabel?: string;
};

export type TimeEntry = {
  id: string;
  projectId: string;
  projectTitle: string;
  task: string;
  skill: string;
  date: string;
  durationMinutes: number;
  note: string;
  billable: boolean;
};

export type Message = {
  id: string;
  fromUserId: string;
  toUserId: string;
  threadId: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  level: 'info' | 'success' | 'warning';
};

export type AppState = {
  users: User[];
  session: LoginSession | null;
  talents: TalentProfile[];
  projects: Project[];
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  messages: Message[];
  notifications: Notification[];
};

export type SignInInput = {
  email: string;
  password: string;
  role: Role;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
  company?: string;
};
