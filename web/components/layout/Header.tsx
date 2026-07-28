'use client';

import { Menu } from 'lucide-react';

export interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 sm:px-6 bg-surface border-b border-outline-variant/60">
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-surface-container transition-colors"
            aria-label="Toggle navigation menu"
            data-testid="hamburger-menu-btn"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Placeholder profile area to be connected in Step 2.5 */}
        <div className="text-sm font-medium text-foreground">User Profile</div>
      </div>
    </header>
  );
}

export default Header;
