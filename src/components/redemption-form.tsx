'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { redeemCard } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Redeem Now <ArrowRight className="ml-2 h-4 w-4" />
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
  const { toast } = useToast();
  const [state, formAction] = useFormState(redeemCard, initialState);

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
      });
    } else if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
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
