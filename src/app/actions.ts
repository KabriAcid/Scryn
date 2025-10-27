'use server';

import { z } from 'zod';

const RedemptionSchema = z.object({
  cardCode: z.string().min(1, 'Card code is required.'),
  serialNumber: z.string().min(1, 'Serial number is required.'),
});

export async function redeemCard(prevState: any, formData: FormData) {
  const validatedFields = RedemptionSchema.safeParse({
    cardCode: formData.get('cardCode'),
    serialNumber: formData.get('serialNumber'),
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

  // Business logic for Scryn card goes here

  return {
    status: 'success',
    message: 'Your redemption was successful! Funds will be credited to your account shortly.',
  };
}
