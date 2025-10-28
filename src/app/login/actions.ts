'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      status: 'error',
      message: firstError || 'Invalid data provided.',
    };
  }

  // Simulate network delay and processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For now, we'll bypass the credential check and redirect to the dashboard
  // as long as the schema validation passes.
  redirect('/dashboard');
}
