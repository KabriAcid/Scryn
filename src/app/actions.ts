'use server';

import { z } from 'zod';

const RedemptionSchema = z.object({
  cardCode: z.string().min(1, 'Card code is required.'),
  bankName: z.string().min(1, 'Bank name is required.'),
  accountNumber: z.string().min(10, 'A valid account number is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
});

export async function redeemCard(prevState: any, formData: FormData) {
  const validatedFields = RedemptionSchema.safeParse({
    cardCode: formData.get('cardCode'),
    bankName: formData.get('bankName'),
    accountNumber: formData.get('accountNumber'),
    accountName: formData.get('accountName'),
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

  return {
    status: 'success',
    message: 'Your redemption was successful! Funds will be credited to your account shortly.',
  };
}
