'use server';

/**
 * @fileOverview AI-powered order verification flow for analyzing new card orders.
 *
 * - orderVerificationAI - A function that analyzes order details for legitimacy.
 * - OrderVerificationInput - The input type for the orderVerificationAI function.
 * - OrderVerificationOutput - The return type for the orderVerificationAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrderVerificationInputSchema = z.object({
  politicianName: z.string().describe('The full name of the politician placing the order.'),
  politicalParty: z.string().describe('The political party of the politician.'),
  politicalRole: z.string().describe('The political role or aspiration.'),
  email: z.string().describe('The contact email address.'),
  phone: z.string().describe('The contact phone number.'),
  orderItems: z.string().describe('A JSON string of the items being ordered, including denomination and quantity.'),
});
export type OrderVerificationInput = z.infer<typeof OrderVerificationInputSchema>;

const OrderVerificationOutputSchema = z.object({
  isLegitimate: z.boolean().describe('Whether the order is likely legitimate.'),
  legitimacyScore: z.number().describe('A numerical score from 0 to 100 indicating the confidence in the legitimacy of the order.'),
  analysis: z.string().describe('A brief explanation of the factors contributing to the score.'),
});
export type OrderVerificationOutput = z.infer<typeof OrderVerificationOutputSchema>;

export async function orderVerificationAI(input: OrderVerificationInput): Promise<OrderVerificationOutput> {
  return orderVerificationFlow(input);
}

const orderVerificationPrompt = ai.definePrompt({
  name: 'orderVerificationPrompt',
  input: {schema: OrderVerificationInputSchema},
  output: {schema: OrderVerificationOutputSchema},
  prompt: `You are an AI verification expert specializing in assessing the legitimacy of orders for a political fundraising platform in Nigeria.

You will analyze the provided order data to determine if the user is a serious and legitimate politician.
Consider the following factors:
- Is the politician's name realistic or a placeholder?
- Is the political party a known party in Nigeria?
- Is the political role consistent with the potential scale of the order?
- Do the email and phone number appear valid?
- Does the order itself (denominations and quantities) seem reasonable for a political campaign?

Based on your analysis, set the isLegitimate output field to true if the order appears to be from a serious user.
Provide a legitimacyScore from 0 to 100. A high score (e.g., > 80) means high confidence in legitimacy.
Provide a brief analysis explaining your reasoning.

Order Data:
- Name: {{{politicianName}}}
- Party: {{{politicalParty}}}
- Role: {{{politicalRole}}}
- Email: {{{email}}}
- Phone: {{{phone}}}
- Order Items: {{{orderItems}}}

Output your decision in JSON format. Adhere strictly to the output schema.
`,
});

const orderVerificationFlow = ai.defineFlow(
  {
    name: 'orderVerificationFlow',
    inputSchema: OrderVerificationInputSchema,
    outputSchema: OrderVerificationOutputSchema,
  },
  async input => {
    try {
      const {output} = await orderVerificationPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error during order verification:', error);
      return {
        isLegitimate: false,
        legitimacyScore: 0,
        analysis: 'An error occurred during AI analysis.',
      };
    }
  }
);
