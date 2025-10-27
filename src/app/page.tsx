import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Gift, ShieldCheck, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/logo';
import { RedemptionForm } from '@/components/redemption-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-nigeria');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <Button asChild>
          <Link href="/dashboard">Politician Login</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/50" />
          <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Empowering Nigerian Communities
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              A transparent, efficient, and secure way to engage voters and distribute funds.
            </p>
          </div>
        </section>

        <section id="redeem" className="relative z-20 -mt-16">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="mx-auto max-w-2xl shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Redeem Your Card</CardTitle>
                <CardDescription>Enter your scratch card code and serial number to receive funds.</CardDescription>
              </CardHeader>
              <CardContent>
                <RedemptionForm />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Revolutionizing Political Engagement
              </h2>
              <p className="text-muted-foreground md:text-lg">
                ScrynCard provides a modern toolkit for politicians and a secure way for citizens to receive support.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Seamless Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Easily create and distribute uniquely branded scratch cards for your campaign.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-Time Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track redemption rates, geographic distribution, and ROI on your dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Advanced Fraud Prevention</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI-powered tools monitor and flag suspicious activities to ensure security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary/50">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ScrynCard. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
