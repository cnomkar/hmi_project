# FreelanceFlow

A comprehensive dual-portal platform for seamless collaboration between clients and freelancers with real-time project tracking, invoicing, and time management.

## Project Overview

FreelanceFlow is a full-featured freelance marketplace application designed to streamline project management, billing, and communication between clients and freelancers. The platform features separate dashboards for each role with synchronized data, invoice management with approval workflows, time tracking, and real-time messaging.

### Key Features

- **Dual Portal Architecture**: Separate optimized interfaces for clients and freelancers
- **Role-Based Access Control**: Email/password authentication with distinct permissions for clients and freelancers
- **Project Management**: Create, track, and manage projects with milestone tracking
- **Time Logging**: Freelancers can log time entries that sync with billing
- **Invoice Management**: Create invoices, approve/query them, and track payment status
- **Real-Time Messaging**: Project-based communication threads between clients and freelancers
- **Notification System**: Instant updates for project changes, comments, and invoice status
- **PDF Export**: Generate invoices and documents as PDFs

## Tech Stack & Framework Choices

### Core Framework

**Next.js 16.2.4**
- **Why**: Server-side rendering and static generation for optimal SEO and performance. File-based routing eliminates complex routing configuration. Built-in API routes support (for future backend integration). Excellent TypeScript support out of the box.

### UI & Styling

**React 19.0.0**
- **Why**: Modern component-based architecture for reusable UI components. Powerful state management with hooks and Context API. Excellent ecosystem and developer tooling. Server components support in Next.js for improved performance.

**Lucide React Icons**
- **Why**: Lightweight, customizable SVG icons library. Perfect for building professional UI with minimal bundle size. Consistent icon design across the entire application.

### Type Safety

**TypeScript 5.8.3**
- **Why**: Compile-time type checking prevents runtime errors and improves code maintainability. Better IDE support with autocomplete and refactoring. Self-documenting code through explicit type definitions. Critical for large applications with complex data models.

### State Management

**React Context API + useReducer**
- **Why**: No external dependencies required for lightweight state management. Perfect for this project's complexity level without over-engineering. Built-in to React, reducing bundle size. Provides centralized authentication and app state management through the `AppProvider`.

### Data Persistence

**Browser Local Storage / Session Storage**
- **Why**: Client-side persistence for user sessions and app state. No backend server required for MVP. Enables offline functionality and faster load times. All data is managed through the storage context in `lib/storage.tsx`.

### PDF Generation

**jsPDF 4.2.1**
- **Why**: Lightweight library for generating PDF documents in the browser. No server-side processing required. Allows users to download invoices and documents directly. Pure client-side solution reducing server load.

### Font Management

**Next.js Google Fonts Integration**
- **Manrope**: Primary typography font for modern, clean aesthetic
- **Space Grotesk**: Secondary typography for emphasis and branding
- **Why**: Zero-layout shift through Next.js font optimization. Improved performance through automatic font subsetting. Self-hosted fonts for better privacy and reliability.

## Project Architecture

```
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages (sign-in, sign-up)
│   ├── client/                   # Client portal routes
│   │   ├── dashboard/            # Overview and main navigation
│   │   ├── contracts/            # Project contracts and details
│   │   ├── find-talent/          # Freelancer discovery
│   │   ├── my-projects/          # Project management
│   │   ├── invoices/             # Invoice tracking and approval
│   │   ├── messages/             # Communication threads
│   │   ├── time-log/             # Time entry tracking
│   │   ├── post-project/         # Create new projects
│   │   └── settings/             # Account settings
│   ├── freelancers/              # Freelancer portal routes
│   │   ├── dashboard/            # Earnings and overview
│   │   ├── projects/             # Active and completed projects
│   │   ├── earnings/             # Income tracking
│   │   ├── time-log/             # Time entry management
│   │   ├── invoices/             # Invoice creation and submission
│   │   └── settings/             # Account settings
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing/home page
│   ├── providers.tsx             # React context providers setup
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── common.tsx                # Common UI components
│   └── portal-frame.tsx          # Portal layout wrapper
├── lib/                          # Utility functions and configuration
│   ├── storage.tsx               # Context API and state management
│   ├── types.ts                  # TypeScript type definitions
│   ├── seed.ts                   # Demo data and initialization
│   ├── utils.ts                  # Helper functions
│   └── pdf.ts                    # PDF generation utilities
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hmi_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## User Roles & Features

### Client Dashboard
- **My Projects**: View, create, and manage active projects
- **Find Talent**: Search and hire freelancers
- **Invoices**: Review, approve, or query freelancer invoices
- **Messages**: Communicate with assigned freelancers
- **Time Log**: Monitor freelancer time entries
- **Contracts**: View project agreements and milestones

### Freelancer Dashboard
- **Dashboard**: View earnings overview and active projects
- **Projects**: Track assigned projects and milestones
- **Earnings**: Monitor income and payment status
- **Invoices**: Create and submit invoices for completed work
- **Time Log**: Log and manage billable hours
- **Messages**: Communicate with clients

## Data Model

The application manages the following core entities:

- **Users**: Clients and Freelancers with role-based access
- **Projects**: Containers for work with milestones and status tracking
- **Milestones**: Project phases with deliverables and timelines
- **Time Entries**: Tracked hours associated with projects
- **Invoices**: Billing documents with line items and approval status
- **Messages**: Communication threads between users
- **Notifications**: Real-time updates on project and invoice changes

## Performance Considerations

1. **Server Components**: Leverages Next.js server components where possible to reduce client-side JavaScript
2. **Font Optimization**: Google Fonts integrated through Next.js for zero layout shift
3. **Icon Optimization**: Lucide React provides tree-shakeable SVG icons
4. **Type Safety**: TypeScript prevents runtime errors and improves bundle optimization
5. **Context API**: Efficient state updates without heavy Redux overhead

## Future Enhancements

- Backend API integration (Node.js/Express or similar)
- Database persistence (PostgreSQL, MongoDB)
- OAuth authentication (Google, GitHub)
- Email notifications
- Advanced analytics and reporting
- Payment gateway integration
- Real-time WebSocket messaging
- Mobile app (React Native)
- Video conferencing for client-freelancer calls

## Development Workflow

### Code Structure Best Practices

1. **Type Safety**: All components and functions are fully typed
2. **Component Organization**: Reusable components in `/components` directory
3. **Utilities**: Helper functions and constants in `/lib`
4. **State Management**: Centralized through `AppProvider` context

### Adding New Features

1. Create new routes following Next.js App Router conventions
2. Add types to `lib/types.ts`
3. Implement context actions in `lib/storage.tsx` if state is needed
4. Create reusable components in `/components`
5. Use TypeScript strict mode for type checking

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern browsers with ES2022 support

## License

This project is part of a semester assignment (Sem 8 - HMI).

## Notes

- All data is currently stored in browser localStorage for the MVP
- No external API calls are made (self-contained frontend)
- Authentication is role-based without backend verification (demo purposes)
- Ready for backend integration when needed

---

**Last Updated**: May 2026
**Version**: 1.0.0
