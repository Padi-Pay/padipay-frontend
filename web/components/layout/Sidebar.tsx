'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, ArrowLeftRight, User, X } from 'lucide-react';

export interface SidebarProps {
  onCloseMobileSidebar?: () => void;
}

export const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { name: 'Escrows', href: '/dashboard/escrows', icon: ArrowLeftRight },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export function Sidebar({ onCloseMobileSidebar }: SidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-outline-variant/60">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-xl text-foreground">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-black shadow-md shadow-primary/20">
            P
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
    </div>
  );
}

export default Sidebar;
