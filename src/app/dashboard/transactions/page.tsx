import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/dashboard/skeletons';

const transactions: Transaction[] = [
  { id: 'TRN-001', date: '2024-03-15 10:30', amount: 5000, status: 'Success', cardCode: '****-1234', account: '****6789', bank: 'Zenith Bank' },
  { id: 'TRN-002', date: '2024-03-15 10:32', amount: 2000, status: 'Success', cardCode: '****-5678', account: '****1234', bank: 'GTBank' },
  { id: 'TRN-003', date: '2024-03-15 10:35', amount: 10000, status: 'Pending', cardCode: '****-9012', account: '****5678', bank: 'First Bank' },
  { id: 'TRN-004', date: '2024-03-15 10:40', amount: 5000, status: 'Failed', cardCode: '****-3456', account: '****9012', bank: 'UBA' },
  { id: 'TRN-005', date: '2024-03-15 10:42', amount: 1000, status: 'Success', cardCode: '****-7890', account: '****3456', bank: 'Access Bank' },
  { id: 'TRN-006', date: '2024-03-15 10:45', amount: 5000, status: 'Success', cardCode: '****-2345', account: '****7890', bank: 'Zenith Bank' },
];

function TransactionsContent() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount (₦)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Card Code</TableHead>
          <TableHead>Bank</TableHead>
          <TableHead>Account</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.id}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.amount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={
                transaction.status === 'Success'
                  ? 'default'
                  : transaction.status === 'Pending'
                  ? 'secondary'
                  : 'destructive'
              }
              className={cn({
                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300': transaction.status === 'Success',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300': transaction.status === 'Pending',
                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300': transaction.status === 'Failed',
              })}
              >
                {transaction.status}
              </Badge>
            </TableCell>
            <TableCell>{transaction.cardCode}</TableCell>
            <TableCell>{transaction.bank}</TableCell>
            <TableCell>{transaction.account}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function TransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Ledger</CardTitle>
        <CardDescription>A detailed log of all redemption transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<TableSkeleton numRows={6} numCells={7} />}>
          <TransactionsContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}
