'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const OrderSchema = z.object({
  denomination: z.string().refine(val => !isNaN(parseInt(val, 10)), {
    message: "Please select a denomination.",
  }),
  quantity: z.coerce.number().min(100, 'Quantity must be at least 100.'),
});

export async function createOrder(prevState: any, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
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
    denomination: validatedFields.data.denomination,
    quantity: validatedFields.data.quantity,
  });

  // On success, redirect back to the orders page.
  redirect('/dashboard/orders');

}
