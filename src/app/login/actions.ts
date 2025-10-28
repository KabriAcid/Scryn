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

  // Dummy user data check
  const { email, password } = validatedFields.data;

  // In a real app, you would check against a database
  if (email === 'test@example.com' && password === 'password') {
    // On success, redirect to the dashboard.
    redirect('/dashboard');
  } else {
    // On failure, return an error message
    return {
      status: 'error',
      message: 'Invalid email or password.',
    };
  }
}
