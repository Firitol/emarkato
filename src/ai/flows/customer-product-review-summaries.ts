'use server';
/**
 * @fileOverview An AI agent that summarizes product reviews, highlighting common pros and cons.
 *
 * - summarizeProductReviews - A function that handles the product review summarization process.
 * - ProductReviewsInput - The input type for the summarizeProductReviews function.
 * - ProductReviewSummaryOutput - The return type for the summarizeProductReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductReviewsInputSchema = z.object({
  reviews: z.array(
    z.object({
      title: z.string().optional().describe('The title of the review, if available.'),
      comment: z.string().describe('The full text of the customer review.'),
      rating: z
        .number()
        .int()
        .min(1)
        .max(5)
        .describe('The star rating given by the customer (1-5).'),
    })
  ).describe('An array of customer reviews for a product.'),
});
export type ProductReviewsInput = z.infer<typeof ProductReviewsInputSchema>;

const ProductReviewSummaryOutputSchema = z.object({
  overallSummary: z
    .string()
    .describe('A concise overall summary of the product reviews.'),
  commonPros: z
    .array(z.string())
    .describe('A list of common positive aspects or features mentioned in the reviews.'),
  commonCons: z
    .array(z.string())
    .describe('A list of common negative aspects, issues, or areas for improvement mentioned in the reviews.'),
});
export type ProductReviewSummaryOutput = z.infer<
  typeof ProductReviewSummaryOutputSchema
>;

export async function summarizeProductReviews(
  input: ProductReviewsInput
): Promise<ProductReviewSummaryOutput> {
  return summarizeProductReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProductReviewsPrompt',
  input: {schema: ProductReviewsInputSchema},
  output: {schema: ProductReviewSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing customer reviews for e-commerce products.
Your task is to analyze a list of product reviews, identify common themes, positive feedback (pros), and negative feedback (cons), and provide a concise summary.

Here are the product reviews:

{{#each reviews}}
Review {{increment @index 1}}:
Rating: {{this.rating}} out of 5
{{#if this.title}}Title: "{{this.title}}"{{/if}}
Comment: "{{this.comment}}"
---
{{/each}}

Based on the reviews above, please provide:
1.  An overall concise summary of the product reviews.
2.  A list of common pros.
3.  A list of common cons.

Ensure the output is in the specified JSON format matching the output schema definitions.
`,
});

const summarizeProductReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProductReviewsFlow',
    inputSchema: ProductReviewsInputSchema,
    outputSchema: ProductReviewSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
