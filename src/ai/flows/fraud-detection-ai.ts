'use server';

/**
 * @fileOverview AI-powered fraud detection flow for analyzing redemption patterns.
 *
 * - fraudDetectionAI - A function that analyzes redemption patterns for fraud.
 * - FraudDetectionInput - The input type for the fraudDetectionAI function.
 * - FraudDetectionOutput - The return type for the fraudDetectionAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  redemptionData: z.string().describe('A JSON string containing the redemption data, including card code, bank account details, timestamp, and IP address.'),
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the redemption pattern is likely fraudulent.'),
  fraudExplanation: z.string().describe('Explanation of why the redemption pattern is considered fraudulent.'),
  riskScore: z.number().describe('A numerical score indicating the risk level of the redemption pattern (0-100).'),
});
export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;

export async function fraudDetectionAI(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  return fraudDetectionFlow(input);
}

const fraudDetectionPrompt = ai.definePrompt({
  name: 'fraudDetectionPrompt',
  input: {schema: FraudDetectionInputSchema},
  output: {schema: FraudDetectionOutputSchema},
  prompt: `You are an AI fraud detection expert specializing in identifying fraudulent redemption patterns for scratch card systems.

You will analyze the provided redemption data to determine if the pattern is likely fraudulent.
Consider factors such as redemption frequency, multiple redemptions from the same IP address, suspicious bank account details, and any other anomalies.

Based on your analysis, set the isFraudulent output field to true if the pattern is likely fraudulent, and provide a detailed explanation in the fraudExplanation field.
Also, provide a numerical riskScore from 0 to 100 indicating the risk level of the redemption pattern.

Redemption Data: {{{redemptionData}}}

Output your decision in JSON format. Adhere strictly to the output schema. Do not include any explanations outside of the JSON. Focus solely on determining if the pattern is fraudulent based on the provided data.
`,
});

const fraudDetectionFlow = ai.defineFlow(
  {
    name: 'fraudDetectionFlow',
    inputSchema: FraudDetectionInputSchema,
    outputSchema: FraudDetectionOutputSchema,
  },
  async input => {
    try {
      const {output} = await fraudDetectionPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error during fraud detection:', error);
      return {
        isFraudulent: false,
        fraudExplanation: 'An error occurred during processing.',
        riskScore: 0,
      };
    }
  }
);
