'use client';

import { ReactNode, useState, cloneElement, isValidElement } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function DashboardLayout({
  children,
  header,
  sidebar,
  isMobileOpen: controlledIsMobileOpen,
  onMobileOpenChange,
}: DashboardLayoutProps) {
  const [uncontrolledIsMobileOpen, setUncontrolledIsMobileOpen] = useState(false);

  const isMobileOpen = controlledIsMobileOpen ?? uncontrolledIsMobileOpen;
  const setIsMobileOpen = (open: boolean) => {
    setUncontrolledIsMobileOpen(open);
    onMobileOpenChange?.(open);
  };

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const headerElement = isValidElement(header)
    ? cloneElement(header as React.ReactElement<{ onToggleMobileSidebar?: () => void; isMobileOpen?: boolean }>, {
        onToggleMobileSidebar: toggleMobileSidebar,
        isMobileOpen,
      })
    : header;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar container - hidden on <1024px (lg breakpoint) */}
      <aside className="hidden lg:block w-[280px] shrink-0 border-r border-outline-variant bg-surface overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main layout container */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        {/* Header container */}
        <header className="shrink-0 w-full border-b border-outline-variant bg-surface">
          {headerElement}
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
