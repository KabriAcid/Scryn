import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/dashboard/skeletons';

const orders: Order[] = [
  { id: 'ORD-001', date: '2023-10-25', denomination: 5000, quantity: 10000, status: 'Completed' },
  { id: 'ORD-002', date: '2023-11-15', denomination: 2000, quantity: 50000, status: 'Completed' },
  { id: 'ORD-003', date: '2023-12-01', denomination: 10000, quantity: 5000, status: 'Completed' },
  { id: 'ORD-004', date: '2024-01-10', denomination: 5000, quantity: 25000, status: 'Processing' },
  { id: 'ORD-005', date: '2024-02-20', denomination: 1000, quantity: 100000, status: 'Pending' },
];

function OrdersContent() {
  return (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Denomination (₦)</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.denomination.toLocaleString()}</TableCell>
            <TableCell>{order.quantity.toLocaleString()}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === 'Completed'
                    ? 'default'
                    : order.status === 'Processing'
                    ? 'secondary'
                    : 'outline'
                }
                className={cn({
                  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': order.status === 'Completed',
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': order.status === 'Processing',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': order.status === 'Pending',
                })}
              >
                {order.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Card Orders</CardTitle>
          <CardDescription>Manage your scratch card orders.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/order">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Order
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<TableSkeleton numRows={5} numCells={5} />}>
          <OrdersContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}
