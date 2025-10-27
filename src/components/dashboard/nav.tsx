'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, History, LayoutDashboard, ShieldCheck } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/dashboard/orders', label: 'Card Orders', icon: CreditCard, tooltip: 'Card Orders' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: History, tooltip: 'Transactions' },
  { href: '/dashboard/fraud-detection', label: 'Fraud Detection', icon: ShieldCheck, tooltip: 'Fraud Detection' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
