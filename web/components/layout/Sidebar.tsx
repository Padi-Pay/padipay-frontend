'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Wallet, ArrowLeftRight, User, X, LogOut } from 'lucide-react';
import { useGlobalStore, AUTH_STORAGE_KEY } from '@/src/store/globalStore';

export interface SidebarProps {
  onCloseMobileSidebar?: () => void;
  onLogout?: () => void;
}

export const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Escrows', href: '/dashboard/escrows', icon: ArrowLeftRight },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export function Sidebar({ onCloseMobileSidebar, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useGlobalStore((state) => state.logout);

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch {
        // ignore storage errors in restrictive environments
      }
    }

    if (onLogout) {
      onLogout();
    } else if (typeof window !== 'undefined') {
      window.location.replace('/login');
    } else {
      router.replace('/login');
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-outline-variant/60">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-xl text-foreground">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image 
              src="/apple-touch-icon.png" 
              alt="PadiPay Logo" 
              width={32} 
              height={32} 
              className="rounded-xl shadow-sm" 
            />
          </div>
          <span>PadiPay</span>
        </Link>
        {onCloseMobileSidebar && (
          <button
            type="button"
            onClick={onCloseMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface-container transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobileSidebar}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-foreground/70 hover:text-foreground hover:bg-surface-container'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-outline-variant/60">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
          data-testid="logout-btn"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
