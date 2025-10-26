import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  cardCode: string;
  account: string;
  bank: string;
};

export type Order = {
  id: string;
  date: string;
  denomination: number;
  quantity: number;
  status: 'Completed' | 'Processing' | 'Pending';
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};
