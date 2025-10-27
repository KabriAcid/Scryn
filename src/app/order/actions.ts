'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const OrderItemSchema = z.object({
  denomination: z.string(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
});

const OrderSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  politicianName: z.string().min(3, 'Name must be at least 3 characters.'),
  politicalParty: z.string().min(2, 'Political party is required.'),
  orderItems: z.string().transform((str, ctx) => {
    try {
      const items = JSON.parse(str);
      const validatedItems = z.array(OrderItemSchema).safeParse(items);
      if (!validatedItems.success) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid order items structure.",
        });
        return z.NEVER;
      }
      
      const totalQuantity = validatedItems.data.reduce((acc, item) => acc + item.quantity, 0);
      if (totalQuantity < 100) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Total quantity must be at least 100.",
        });
        return z.NEVER;
      }
      
      return validatedItems.data;
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON for order items.",
      });
      return z.NEVER;
    }
  }),
});

export async function createOrder(prevState: any, formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    title: formData.get('title'),
    politicianName: formData.get('politicianName'),
    politicalParty: formData.get('politicalParty'),
    orderItems: formData.get('orderItems'),
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
    // In a real app, you would handle the file upload here for formData.get('photo').
  });

  // On success, redirect to the dashboard.
  redirect('/dashboard');
}
