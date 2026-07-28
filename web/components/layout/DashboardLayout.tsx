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
      <aside className="w-[280px] shrink-0 border-r border-outline-variant bg-surface overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main layout container */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        {/* Header container */}
        <header className="shrink-0 w-full border-b border-outline-variant bg-surface">
          {header}
        </header>

        {/* Content container with dedicated vertical scrollbar to prevent double scrollbars */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
