'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized product recommendations for customers.
 *
 * - customerProductRecommendations - A function that generates product recommendations for a customer.
 * - CustomerProductRecommendationsInput - The input type for the customerProductRecommendations function.
 * - CustomerProductRecommendationsOutput - The return type for the customerProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const CustomerProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The unique identifier of the customer.'),
  browsingHistory: z.array(z.string()).describe('A list of product names or descriptions that the customer has previously browsed.'),
  recentlyViewedProducts: z.array(z.string()).describe('A list of product names or descriptions that the customer has recently viewed.'),
});
export type CustomerProductRecommendationsInput = z.infer<typeof CustomerProductRecommendationsInputSchema>;

// Output Schema
const CustomerProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of recommended product names or descriptions.'),
});
export type CustomerProductRecommendationsOutput = z.infer<typeof CustomerProductRecommendationsOutputSchema>;

// Wrapper function to call the flow
export async function customerProductRecommendations(
  input: CustomerProductRecommendationsInput
): Promise<CustomerProductRecommendationsOutput> {
  return customerProductRecommendationsFlow(input);
}

// Define the prompt for product recommendations
const recommendationPrompt = ai.definePrompt({
  name: 'customerProductRecommendationsPrompt',
  input: {schema: CustomerProductRecommendationsInputSchema},
  output: {schema: CustomerProductRecommendationsOutputSchema},
  prompt: `You are an e-commerce recommendation engine for E-Marcato. Your goal is to suggest personalized products to customers based on their past interactions.
Based on the customer's browsing history and recently viewed items, recommend up to 5 products that they might be interested in. Focus on items similar to their interests or popular items from categories they frequently visit.
Provide the recommendations as a simple list of product names/descriptions.

Customer's browsing history: {{{browsingHistory}}}
Recently viewed products: {{{recentlyViewedProducts}}}

Example output format:
{
  "recommendations": [
    "Jebena Coffee Pot",
    "Habesha Dress",
    "Traditional Ethiopian Basket",
    "Ethiopian Coffee Beans (Yirgacheffe)",
    "Leather Sandal"
  ]
}
`,
});

// Define the Genkit flow
const customerProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'customerProductRecommendationsFlow',
    inputSchema: CustomerProductRecommendationsInputSchema,
    outputSchema: CustomerProductRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await recommendationPrompt(input);
    return output!;
  }
);
