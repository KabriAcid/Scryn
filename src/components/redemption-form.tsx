'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redeemCard } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Redeem Now <ArrowRight />
        </>
      )}
    </Button>
  );
}

const initialState = {
  message: '',
  status: 'idle' as 'idle' | 'success' | 'error',
};

export function RedemptionForm() {
  const [state, formAction] = useFormState(redeemCard, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    // No need to handle success toast here, as we will be redirecting
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
       {state?.status === 'error' && state.message && (
        <Alert variant={'destructive'}>
           <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {state.message}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="card-code">Scratch Card Code</Label>
          <Input id="card-code" name="cardCode" placeholder="XXXX-XXXX-XXXX-XXXX" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serial-number">Serial Number</Label>
          <Input id="serial-number" name="serialNumber" placeholder="SN-XXXXXXX" required />
        </div>
      </div>
       <div className="flex items-center space-x-2">
        <Checkbox id="consent" name="consent" />
        <Label
          htmlFor="consent"
          className="text-sm font-normal text-muted-foreground"
        >
          I agree to the terms and conditions.
        </Label>
      </div>
      <SubmitButton />
    </form>
  );
}
