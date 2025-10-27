'use client';

import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Bank Details' },
  { id: 3, title: 'Location' },
];

export function DetailsForm() {
  const [state, formAction, isPending] = useActionState(submitDetails, initialState);
  const [step, setStep] = useState(1);

  const [ipAddress, setIpAddress] = useState('');
  const [location, setLocation] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [lgas, setLgas] = useState<string[]>([]);
  const [lgaKey, setLgaKey] = useState(0);

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

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setLgas(statesAndLgas[state] || []);
    setLgaKey(prev => prev + 1); // Reset LGA select
  };
  
  const nextStep = () => setStep(prev => (prev < STEPS.length ? prev + 1 : prev));
  const prevStep = () => setStep(prev => (prev > 1 ? prev - 1 : prev));

  return (
    <form action={formAction} className="space-y-8">
      {state.status !== 'idle' && state.message && (
        <Alert variant={state.status === 'error' ? 'destructive' : 'default'} className={cn(
          {'bg-green-100/50 border-green-400 text-green-800 dark:bg-green-900/20 dark:border-green-600 dark:text-green-300': state.status === 'success'}
        )}>
           {state.status === 'success' ? <CheckCircle /> : <AlertCircle />}
          <AlertTitle>{state.status === 'success' ? 'Success!' : 'Error'}</AlertTitle>
          <AlertDescription>
            {state.message}
          </AlertDescription>
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

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                    <Label htmlFor="account-name">Full Name (as on bank account)</Label>
                    <Input id="account-name" name="accountName" placeholder="John Doe" required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="08012345678" required />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="nin">NIN (National Identification Number)</Label>
                    <Input id="nin" name="nin" placeholder="111-111-111-11" required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="account-number">Bank Account Number</Label>
                        <Input id="account-number" name="accountNumber" placeholder="0123456789" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                         <Select name="bankName" required>
                            <SelectTrigger id="bank-name">
                                <SelectValue placeholder="Select your bank" />
                            </SelectTrigger>
                            <SelectContent>
                                {nigerianBanks.map(bank => (
                                     <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bvn">BVN (Bank Verification Number)</Label>
                    <Input id="bvn" name="bvn" placeholder="222-222-222-22" required />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                         <Select name="state" required onValueChange={handleStateChange}>
                            <SelectTrigger id="state">
                                <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                                {stateNames.map(state => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="lga">LGA (Local Government Area)</Label>
                        <Select name="lga" required key={lgaKey} disabled={!selectedState}>
                            <SelectTrigger id="lga">
                                <SelectValue placeholder="Select your LGA" />
                            </SelectTrigger>
                            <SelectContent>
                                {lgas.map(lga => (
                                    <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            {step > 1 && <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft /> Previous</Button>}
            {step < STEPS.length && <Button type="button" onClick={nextStep} className="ml-auto">Next <ArrowRight /></Button>}
            {step === STEPS.length && <SubmitButton pending={isPending} />}
          </div>
        </>
      )}

      <input type="hidden" name="ipAddress" value={ipAddress} />
      <input type="hidden" name="location" value={location} />
    </form>
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
