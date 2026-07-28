'use client';

import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
}

export function DashboardLayout({ children, header, sidebar }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar container */}
      <aside className="w-[280px] shrink-0 border-r border-outline-variant bg-surface">
        {sidebar}
      </aside>

      {/* Main layout container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header container */}
        <header className="w-full border-b border-outline-variant bg-surface">
          {header}
        </header>

        {/* Content container */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
