'use client';

import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { AlertCircle, LoaderCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createOrder } from '@/app/dashboard/orders/new/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const OrderSchema = z.object({
  denomination: z.string().refine(val => !isNaN(parseInt(val, 10)), {
    message: "Please select a denomination.",
  }),
  quantity: z.coerce.number().min(100, 'Quantity must be at least 100.'),
});

type OrderFormValues = z.infer<typeof OrderSchema>;

const initialState = {
  message: '',
  status: 'idle' as 'idle' | 'success' | 'error',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Placing Order...
        </>
      ) : (
        <>
          <PlusCircle />
          Place Order
        </>
      )}
    </Button>
  );
}

export function OrderForm() {
  const [state, formAction] = useActionState(createOrder, initialState);
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      quantity: 1000,
    },
  });

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6 max-w-lg">
        {state.status === 'error' && state.message && (
            <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}
        <FormField
          control={form.control}
          name="denomination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Denomination (₦)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a denomination" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="2000">2,000</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10000" {...field} min="100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
