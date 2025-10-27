'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const OrderSchema = z.object({
  politicianName: z.string().min(3, 'Name must be at least 3 characters.'),
  politicalParty: z.string().min(2, 'Political party must be at least 2 characters.'),
  // Photo validation will be handled client-side for now.
  denomination: z.string().refine(val => !isNaN(parseInt(val, 10)), {
    message: "Please select a denomination.",
  }),
  quantity: z.coerce.number().min(100, 'Quantity must be at least 100.'),
});

export async function createOrder(prevState: any, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    politicianName: formData.get('politicianName'),
    politicalParty: formData.get('politicalParty'),
    denomination: formData.get('denomination'),
    quantity: formData.get('quantity'),
  });

  if (!validatedFields.success) {
     const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      status: 'error',
      message: firstError || 'Invalid data provided.',
    };
  }

  // Simulate network delay and processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log('New Order Created:', {
    ...validatedFields.data
    // In a real app, you would handle the file upload here.
  });

  // On success, redirect to the dashboard.
  redirect('/dashboard');
}
