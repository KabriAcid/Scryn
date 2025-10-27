'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const RedemptionSchema = z.object({
  cardCode: z.string().min(1, 'Card code is required.'),
  serialNumber: z.string().min(1, 'Serial number is required.'),
  consent: z.literal('on', {
    errorMap: () => ({ message: 'You must agree to the terms and conditions.' }),
  }),
});

export async function redeemCard(prevState: any, formData: FormData) {
  const validatedFields = RedemptionSchema.safeParse({
    cardCode: formData.get('cardCode'),
    serialNumber: formData.get('serialNumber'),
    consent: formData.get('consent'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0]
    };
  }

  // Simulate network delay and processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate success/failure
  if (validatedFields.data.cardCode.startsWith('FAIL')) {
    return {
      status: 'error',
      message: 'This card code is invalid or has already been used.',
    };
  }

  // Business logic for Scryn card goes here.
  // On success, we redirect to the details page.
  redirect('/redeem/details');

  // We won't return a success message here anymore since we are redirecting.
}

export async function submitDetails(prevState: any, formData: FormData) {
  // Add validation and submission logic for bank details here.
  console.log('Submitting bank details...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    status: 'success',
    message: 'Your details have been submitted successfully! Funds will be credited shortly.'
  }
}
