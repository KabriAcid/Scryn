import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderForm } from '@/components/dashboard/order-form';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewOrderPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <header className="absolute top-0 left-0 w-full p-4 md:p-6">
            <div className='flex items-center justify-between'>
                <Logo />
                <Button asChild variant="ghost">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
      </header>
      <main className="w-full max-w-2xl mt-20">
        <Card className="shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Create a New Card Order</CardTitle>
                <CardDescription>
                    Fill out the form below to place a new order for scratch cards. After your order, you'll get access to your dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
                <OrderForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
