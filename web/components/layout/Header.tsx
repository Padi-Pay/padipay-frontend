'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useGlobalStore } from '@/src/store/globalStore';

export interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function getInitials(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (email && email.trim().length > 0) {
    return email[0].toUpperCase();
  }
  return 'U';
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const profile = useGlobalStore((state) => state.profile);

  const displayName = profile?.name || profile?.email || 'User';
  const initials = getInitials(profile?.name, profile?.email);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-outline-variant/60 shadow-xs">
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

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-container transition-colors group"
          title="View profile"
        >
          {profile?.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-outline-variant shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shadow-xs group-hover:bg-primary group-hover:text-white transition-colors">
              {initials}
            </div>
          )}

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-foreground leading-tight">
              {displayName}
            </span>
            {profile?.email && (
              <span className="text-xs text-foreground/60 leading-tight">
                {profile.email}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
