'use server';
/**
 * @fileOverview An AI assistant for sellers to generate product descriptions.
 *
 * - sellerProductDescriptionAssistant - A function that handles the product description generation process.
 * - SellerProductDescriptionAssistantInput - The input type for the sellerProductDescriptionAssistant function.
 * - SellerProductDescriptionAssistantOutput - The return type for the sellerProductDescriptionAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SellerProductDescriptionAssistantInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category the product belongs to (e.g., Electronics, Fashion, Home & Kitchen).'),
  keyFeatures: z
    .array(z.string())
    .min(1)
    .describe('A list of key features and selling points of the product.'),
  targetAudience: z.string().optional().describe('An optional description of the target audience for the product.'),
  tone: z
    .string()
    .optional()
    .describe('The desired tone for the description (e.g., enthusiastic, professional, concise, luxurious).'),
});
export type SellerProductDescriptionAssistantInput = z.infer<typeof SellerProductDescriptionAssistantInputSchema>;

const SellerProductDescriptionAssistantOutputSchema = z.object({
  description: z.string().describe('A comprehensive and engaging product description.'),
});
export type SellerProductDescriptionAssistantOutput = z.infer<typeof SellerProductDescriptionAssistantOutputSchema>;

export async function sellerProductDescriptionAssistant(
  input: SellerProductDescriptionAssistantInput
): Promise<SellerProductDescriptionAssistantOutput> {
  return sellerProductDescriptionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sellerProductDescriptionAssistantPrompt',
  input: {schema: SellerProductDescriptionAssistantInputSchema},
  output: {schema: SellerProductDescriptionAssistantOutputSchema},
  prompt: `You are an expert marketing copywriter for an e-commerce platform in Ethiopia, E-Marcato.
Your task is to generate a comprehensive and engaging product description based on the provided details.
Focus on highlighting the benefits and unique selling points for the Ethiopian market.

Product Name: {{{productName}}}
Category: {{{category}}}
Key Features:
{{#each keyFeatures}}- {{{this}}}
{{/each}}

{{#if targetAudience}}
Target Audience: {{{targetAudience}}}
{{/if}}

{{#if tone}}
Desired Tone: {{{tone}}}
{{/if}}

Generate a compelling product description in a maximum of 250 words. Ensure it is clear, persuasive, and optimized for online sales.`,
});

const sellerProductDescriptionAssistantFlow = ai.defineFlow(
  {
    name: 'sellerProductDescriptionAssistantFlow',
    inputSchema: SellerProductDescriptionAssistantInputSchema,
    outputSchema: SellerProductDescriptionAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
