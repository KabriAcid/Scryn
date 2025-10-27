'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, LoaderCircle, PartyPopper, Trash2, Upload, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createOrder } from '@/app/order/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';
import { DenominationPicker } from '../ui/form-elements/denomination-picker';
import { QuantityInput } from '../ui/form-elements/quantity-input';
import { Card } from '../ui/card';

const politicalParties = ["ACN", "PDP", "APC", "LP", "NNPP", "APGA"];
const titles = ["Hon.", "Chief", "Dr.", "Mr.", "Mrs.", "Ms."];

const denominations = [
  { id: '2000', label: '₦2k' },
  { id: '5000', label: '₦5k' },
  { id: '10000', label: '₦10k' },
  { id: '20000', label: '₦20k' },
  { id: '50000', label: '₦50k' },
  { id: '100000', label: '₦100k' },
  { id: '200000', label: '₦200k' },
  { id: '500000', label: '₦500k' },
  { id: '1000000', label: '₦1M' },
  { id: '2000000', label: '₦2M' },
  { id: '5000000', label: '₦5M' },
  { id: '10000000', label: '₦10M' },
] as const;

const denominationEnum = denominations.map(d => d.id) as [string, ...string[]];

const OrderSchema = z.object({
  title: z.string({ required_error: 'Please select a title.' }),
  politicianName: z.string().min(3, 'Name must be at least 3 characters.'),
  politicalParty: z.string({ required_error: "Please select a political party." }),
  photo: z.any().refine(file => file instanceof File, 'A photo is required.'),
  orderItems: z.array(z.object({
    denomination: z.enum(denominationEnum),
    quantity: z.coerce.number().min(1, "Min 1"),
  })).min(1, 'You must select at least one denomination and set a quantity.')
  .refine(items => {
    const item2k = items.find(item => item.denomination === '2000');
    return !item2k || item2k.quantity >= 100;
  }, {
    message: 'Quantity for ₦2k cards must be at least 100.',
    path: ['orderItems'],
  })
}).refine(data => {
    const totalQuantity = data.orderItems.reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity >= 100;
}, {
    message: 'Total quantity for the order must be at least 100 cards.',
    path: ['orderItems'],
});


type OrderFormValues = z.infer<typeof OrderSchema>;

const STEPS = [
  { id: 1, title: 'Card Customization', fields: ['title', 'politicianName', 'politicalParty', 'photo'] as const, icon: User },
  { id: 2, title: 'Card Details', fields: ['orderItems'] as const, icon: Wallet },
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
      orderItems: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "orderItems",
    keyName: "customId",
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

  const handleDenominationToggle = (id: string) => {
    const itemIndex = fields.findIndex(field => field.denomination === id);
    if (itemIndex > -1) {
        remove(itemIndex);
    } else {
        const defaultQuantity = id === '2000' ? 100 : 1;
        append({ denomination: id as any, quantity: defaultQuantity });
    }
  };

  const selectedDenominations = fields.map(f => f.denomination);
  
  const totalQuantity = form.watch('orderItems').reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const totalValue = form.watch('orderItems').reduce((acc, item) => acc + (parseInt(item.denomination) * (Number(item.quantity) || 0)), 0);

  return (
    <Form {...form}>
      <form action={(formData) => {
          const orderItems = form.getValues('orderItems');
          formData.append('orderItems', JSON.stringify(orderItems));
          formAction(formData);
      }} className="space-y-6 max-w-lg mx-auto">
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

        <div className="relative h-[450px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute w-full h-full"
            >
              <div className="h-full overflow-y-auto pr-4 space-y-4 no-scrollbar">
                {step === 1 && (
                  <>
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
                                  <Input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePhotoChange} name="photo" />
                              </label>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )} />
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-2">
                        <FormLabel className="text-base">Card Denomination (₦)</FormLabel>
                        <p className="text-sm text-muted-foreground">
                            Select one or more denominations for this order.
                        </p>
                    </div>

                    <DenominationPicker
                        denominations={denominations}
                        selected={selectedDenominations}
                        onToggle={handleDenominationToggle}
                    />
                    
                    {fields.length > 0 && (
                        <div className="space-y-3 pt-4">
                            <h3 className="font-medium text-lg">Selected Cards</h3>
                            <div className="space-y-2">
                                {fields.map((field, index) => {
                                    const denomination = denominations.find(d => d.id === field.denomination);
                                    return (
                                        <Card key={field.id} className="p-3 flex items-center justify-between">
                                            <div className='font-semibold'>{denomination?.label} cards</div>
                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`orderItems.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <QuantityInput {...field} />
                                                            </FormControl>
                                                            <FormMessage className="text-xs" />
                                                        </FormItem>
                                                    )}
                                                    />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    
                    <AnimatePresence>
                        {form.formState.errors.orderItems && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <FormMessage>{form.formState.errors.orderItems.message || form.formState.errors.orderItems.root?.message}</FormMessage>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {fields.length > 0 && (
                        <Card className="p-4 mt-4 bg-muted/50">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Quantity:</span>
                                <span className="font-bold text-lg">{totalQuantity.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-semibold">Total Value:</span>
                                <span className="font-bold text-lg text-primary">₦{totalValue.toLocaleString()}</span>
                            </div>
                        </Card>
                    )}
                  </>
                )}
              </div>
            </motion.div>
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
