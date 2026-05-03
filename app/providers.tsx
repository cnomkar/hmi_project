'use client';

import { AppProvider } from '@/lib/storage';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
