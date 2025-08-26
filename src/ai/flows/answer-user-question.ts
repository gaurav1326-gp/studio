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
  prompt: `You are a helpful AI assistant that provides comprehensive answers to user questions on a variety of topics including coding, computer languages, health, and studies.\n\nQuestion: {{{question}}}`, 
});

const answerUserQuestionFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionFlow',
    inputSchema: AnswerUserQuestionInputSchema,
    outputSchema: AnswerUserQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
