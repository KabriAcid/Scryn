import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { RedemptionForm } from '@/components/redemption-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RedeemPage() {
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
      <main className="w-full max-w-2xl">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Redeem Your Card</CardTitle>
            <CardDescription>Enter your scratch card code and serial number to receive funds securely.</CardDescription>
          </CardHeader>
          <CardContent>
            <RedemptionForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
