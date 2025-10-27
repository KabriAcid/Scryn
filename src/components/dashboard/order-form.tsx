'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, LoaderCircle, PartyPopper, Upload, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createOrder } from '@/app/order/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';

const politicalParties = ["ACN", "PDP", "APC", "LP", "NNPP", "APGA"];
const titles = ["Hon.", "Chief", "Dr.", "Mr.", "Mrs.", "Ms."];

const denominations = [
  { id: '2000', label: '₦2,000' },
  { id: '5000', label: '₦5,000' },
  { id: '10000', label: '₦10,000' },
] as const;

const OrderSchema = z.object({
  title: z.string({ required_error: 'Please select a title.' }),
  politicianName: z.string().min(3, 'Name must be at least 3 characters.'),
  politicalParty: z.string({ required_error: "Please select a political party." }),
  photo: z.any().refine(file => file instanceof File, 'A photo is required.'),
  denomination: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one denomination.',
  }),
  quantity: z.coerce.number().min(100, 'Quantity must be at least 100.'),
});

type OrderFormValues = z.infer<typeof OrderSchema>;

const STEPS = [
  { id: 1, title: 'Card Customization', fields: ['title', 'politicianName', 'politicalParty', 'photo'] as const, icon: User },
  { id: 2, title: 'Card Details', fields: ['denomination', 'quantity'] as const, icon: Wallet },
];

const initialState = {
  message: '',
  status: 'idle' as 'idle' | 'success' | 'error',
};

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

export function OrderForm() {
  const [state, formAction, isPending] = useActionState(createOrder, initialState);
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    mode: 'onChange',
    defaultValues: {
      quantity: 1000,
      denomination: [],
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
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6 max-w-lg mx-auto">
        {state.status === 'error' && state.message && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}

        {/* Step Indicators */}
        <div className="flex items-center justify-center space-x-4">
          {STEPS.map((s, index) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors border-2',
                    step > s.id ? 'bg-primary border-primary text-primary-foreground' : '',
                    step === s.id ? 'border-primary text-primary' : 'border-border bg-muted text-muted-foreground'
                  )}
                >
                  {step > s.id ? <CheckCircle className="h-6 w-6" /> : <s.icon className="h-6 w-6" />}
                </div>
                <p className={cn("text-sm", step === s.id ? 'font-semibold text-primary' : 'text-muted-foreground')}>{s.title}</p>
              </div>
              {index < STEPS.length - 1 && <div className="flex-1 mt-[-20px] border-t-2 border-dashed border-border" />}
            </React.Fragment>
          ))}
        </div>

        <div className="relative h-[440px] overflow-hidden">
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
                 <div className="grid grid-cols-[1fr_2fr] gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {titles.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="politicianName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (on card)</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} name="politicianName" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                <FormField control={form.control} name="politicalParty" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Political Party</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a political party" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {politicalParties.map(party => <SelectItem key={party} value={party}>{party}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="photo" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Photo for Card</FormLabel>
                        <FormControl>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <p className="mb-2 text-sm">Click to upload photo</p>
                                        <p className="text-xs">PNG, JPG (MAX. 800x400px)</p>
                                    </div>
                                )}
                                <Input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePhotoChange} />
                            </label>
                        </FormControl>
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
                <FormField
                  control={form.control}
                  name="denomination"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Card Denomination (₦)</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Select one or more denominations for this order.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                      {denominations.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="denomination"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-lg">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10000" {...field} min="100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between pt-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft /> Previous</Button>
            ) : <div />}
            {step < STEPS.length && <Button type="button" onClick={nextStep} className="ml-auto">Next <ArrowRight /></Button>}
            {step === STEPS.length && <SubmitButton pending={isPending} />}
        </div>
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
          Placing Order...
        </>
      ) : (
        <>
          <PartyPopper />
          Place Order
        </>
      )}
    </Button>
  );
}
