'use server';

/**
 * @fileOverview An AI agent to answer user questions on various topics.
 *
 * - answerUserQuestion - A function that answers user questions.
 * - AnswerUserQuestionInput - The input type for the answerUserQuestion function.
 * - AnswerUserQuestionOutput - The return type for the answerUserQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQuestionInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
  media: z.optional(z.object({
    dataUri: z.string().describe("A media file (image or video), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
    type: z.enum(['image', 'video']).describe('The type of media.'),
  })),
});
export type AnswerUserQuestionInput = z.infer<typeof AnswerUserQuestionInputSchema>;

const AnswerUserQuestionOutputSchema = z.object({
  answer: z.string().describe('The comprehensive answer to the user\'s question.'),
});
export type AnswerUserQuestionOutput = z.infer<typeof AnswerUserQuestionOutputSchema>;

export async function answerUserQuestion(input: AnswerUserQuestionInput): Promise<AnswerUserQuestionOutput> {
  return answerUserQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerUserQuestionPrompt',
  input: {schema: AnswerUserQuestionInputSchema},
  output: {schema: AnswerUserQuestionOutputSchema},
  prompt: `You are a helpful AI assistant that provides comprehensive answers to user questions on a variety of topics including coding, computer languages, health, and studies. If media is provided, analyze it and incorporate it into your answer.

When providing a numbered list, always format it using Markdown (e.g., '1. First item').

{{#if media}}
Media:
{{media url=media.dataUri}}
{{/if}}

Question: {{{question}}}`, 
});

const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.answer) {
      return { answer: "Sorry, I couldn't come up with a response. Please try again." };
    }
    return output;
  }
);
