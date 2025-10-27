'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Gift, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitDetails } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';


const nigerianBanks = [
    "Access Bank", "Citibank", "Ecobank Nigeria", "Fidelity Bank Nigeria", "First Bank of Nigeria",
    "First City Monument Bank", "Guaranty Trust Bank", "Jaiz Bank", "Keystone Bank Limited",
    "Polaris Bank", "Stanbic IBTC Bank Nigeria", "Standard Chartered Bank", "Sterling Bank",
    "SunTrust Bank Nigeria", "TAJBank", "Union Bank of Nigeria", "United Bank for Africa",
    "Unity Bank Plc", "Wema Bank", "Zenith Bank"
];

const statesAndLgas: Record<string, string[]> = {
  'Abuja (FCT)': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
  'Lagos': ['Agege', 'Ikeja', 'Kosofe', 'Mushin', 'Oshodi-Isolo'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo'],
  'Kano': ['Kano Municipal', 'Fagge', 'Dala', 'Gwale', 'Tarauni'],
  'Oyo': ['Ibadan North', 'Ibadan South-West', 'Ibadan North-West', 'Ibadan North-East', 'Ibadan South-East' ]
};
const stateNames = Object.keys(statesAndLgas);

const initialState = {
  message: '',
  status: 'idle' as 'idle' | 'success' | 'error',
};

const STEPS = [
  { id: 1, title: 'Personal Info', fields: ['accountName', 'email', 'phone', 'nin'] as const },
  { id: 2, title: 'Bank Details', fields: ['accountNumber', 'bankName', 'bvn'] as const },
  { id: 3, title: 'Location', fields: ['state', 'lga'] as const },
];

const formSchema = z.object({
    accountName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(50, { message: "Full name cannot be more than 50 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }).max(50, { message: "Email cannot be more than 50 characters." }),
    phone: z.string().regex(/^0[789][01]\d{8}$/, { message: "Please enter a valid Nigerian phone number." }).max(11),
    nin: z.string().regex(/^\d{11}$/, { message: "NIN must be 11 digits." }).max(11),
    accountNumber: z.string().regex(/^\d{10}$/, { message: "Account number must be 10 digits." }).max(10),
    bankName: z.string({ required_error: 'Please select a bank.' }),
    bvn: z.string().regex(/^\d{11}$/, { message: "BVN must be 11 digits." }).max(11),
    state: z.string({ required_error: 'Please select a state.' }),
    lga: z.string({ required_error: 'Please select an LGA.' }),
});

type FormValues = z.infer<typeof formSchema>;

const stepVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? '50%' : '-50%',
  }),
  visible: {
    opacity: 1,
    x: '0%',
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? '50%' : '-50%',
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  }),
};

export function DetailsForm() {
  const [state, formAction, isPending] = useActionState(submitDetails, initialState);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [ipAddress, setIpAddress] = useState('');
  const [location, setLocation] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
        accountName: '',
        email: '',
        phone: '',
        nin: '',
        accountNumber: '',
        bankName: undefined,
        bvn: '',
        state: undefined,
        lga: undefined,
    }
  });

  const selectedState = form.watch('state');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setIpAddress(data.ip);
        setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
      })
      .catch(err => {
        console.error("Could not fetch location data", err);
        setIpAddress('Unavailable');
        setLocation('Unavailable');
      })
  }, []);
  
  const nextStep = async () => {
    const fields = STEPS[step - 1].fields;
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;

    setDirection(1);
    setStep(prev => (prev < STEPS.length ? prev + 1 : prev));
  };
  const prevStep = () => {
    setDirection(-1);
    setStep(prev => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <Form {...form}>
    <form action={formAction} className="space-y-8 overflow-hidden">
      {state.status !== 'idle' && state.message && (
        <Alert variant={state.status === 'error' ? 'destructive' : 'default'} className={cn(
          'flex flex-col items-center justify-center text-center p-6 space-y-4',
          {'bg-green-100/50 border-green-400 text-green-800 dark:bg-green-900/20 dark:border-green-600 dark:text-green-300': state.status === 'success'}
        )}>
           {state.status === 'success' ? <CheckCircle className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
          <AlertTitle className="text-2xl font-bold">{state.status === 'success' ? 'Success!' : 'Error'}</AlertTitle>
          <AlertDescription>
            {state.message}
          </AlertDescription>
          {state.status === 'success' && (
            <Button asChild className="mt-4">
              <Link href="/redeem">
                <Gift className="mr-2 h-4 w-4" />
                Redeem Another Card
              </Link>
            </Button>
          )}
        </Alert>
      )}

      {state.status !== 'success' && (
        <>
          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-4">
            {STEPS.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                      step > s.id ? 'bg-primary text-primary-foreground' : '',
                      step === s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                   {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
                  </div>
                  <p className={cn("mt-2 text-sm", step === s.id ? 'font-semibold text-primary' : 'text-muted-foreground')}>{s.title}</p>
                </div>
                {index < STEPS.length - 1 && <div className="flex-1 border-t-2 border-dashed border-border" />}
              </React.Fragment>
            ))}
          </div>

          <div className="relative h-[330px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {step === 1 && (
                 <motion.div
                    key={1}
                    custom={direction}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 absolute w-full"
                >
                    <FormField control={form.control} name="accountName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name (as on bank account)</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input type="tel" placeholder="08012345678" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="nin" render={({ field }) => (
                        <FormItem>
                            <FormLabel>NIN (National Identification Number)</FormLabel>
                            <FormControl><Input placeholder="11111111111" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </motion.div>
              )}

              {step === 2 && (
                 <motion.div
                    key={2}
                    custom={direction}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 absolute w-full"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <FormField control={form.control} name="accountNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bank Account Number</FormLabel>
                            <FormControl><Input placeholder="0123456789" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="bankName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select your bank" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {nigerianBanks.map(bank => (<SelectItem key={bank} value={bank}>{bank}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                  </div>
                   <FormField control={form.control} name="bvn" render={({ field }) => (
                        <FormItem>
                            <FormLabel>BVN (Bank Verification Number)</FormLabel>
                            <FormControl><Input placeholder="22222222222" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </motion.div>
              )}

              {step === 3 && (
                 <motion.div
                    key={3}
                    custom={direction}
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 absolute w-full"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    form.resetField('lga');
                                }} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {stateNames.map(state => (<SelectItem key={state} value={state}>{state}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lga" render={({ field }) => (
                            <FormItem>
                                <FormLabel>LGA (Local Government Area)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                                    <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select your LGA" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(statesAndLgas[selectedState] || []).map(lga => (<SelectItem key={lga} value={lga}>{lga}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-between pt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft /> Previous</Button>
            ) : <div />}
            {step < STEPS.length && <Button type="button" onClick={nextStep} className="ml-auto">Next <ArrowRight /></Button>}
            {step === STEPS.length && <SubmitButton pending={isPending} />}
          </div>
        </>
      )}

      <input type="hidden" name="ipAddress" value={ipAddress} />
      <input type="hidden" name="location" value={location} />
    </form>
    </Form>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full sm:w-auto ml-auto" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          Complete Redemption <CheckCircle />
        </>
      )}
    </Button>
  );
}
