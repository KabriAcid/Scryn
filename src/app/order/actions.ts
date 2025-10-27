'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const OrderSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  politicianName: z.string().min(3, 'Name must be at least 3 characters.'),
  politicalParty: z.string().min(2, 'Political party is required.'),
  // Photo validation will be handled client-side for now.
  denomination: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one denomination.',
  }),
  quantity: z.coerce.number().min(100, 'Quantity must be at least 100.'),
});

export async function createOrder(prevState: any, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    title: formData.get('title'),
    politicianName: formData.get('politicianName'),
    politicalParty: formData.get('politicalParty'),
    denomination: formData.getAll('denomination'),
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
