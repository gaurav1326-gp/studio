
'use server';

/**
 * @fileOverview A flow to get a daily news briefing.
 *
 * - getDailyBriefing - A function that returns a news summary.
 * - GetDailyBriefingOutput - The return type for the getDailyBriefing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetDailyBriefingOutputSchema = z.object({
  briefing: z.string().describe('The daily news briefing, formatted in Markdown.'),
});
export type GetDailyBriefingOutput = z.infer<typeof GetDailyBriefingOutputSchema>;

// In a real implementation, you would use a tool here to fetch live news.
// For now, we will return a placeholder.
const getNewsTool = ai.defineTool(
    {
        name: 'getNewsTool',
        description: 'Gets the latest news headlines on a given topic. If no topic is provided, it returns general top headlines.',
        inputSchema: z.object({
            topic: z.string().optional().describe('A specific topic to search news for.'),
        }),
        outputSchema: z.object({
            articles: z.array(z.object({
                title: z.string(),
                url: z.string(),
                source: z.string(),
                snippet: z.string(),
            }))
        })
    },
    async (input) => {
        // This is a mock implementation.
        // In a real-world scenario, you would call a news API here.
        return {
            articles: [
                { title: 'AI predicts stock market trends with 95% accuracy', url: '#', source: 'Tech Today', snippet: 'A new AI model developed by FutureCorp has shown unprecedented accuracy in predicting stock market fluctuations, causing a stir among investors.' },
                { title: 'Global leaders meet to discuss climate change initiatives', url: '#', source: 'World News Daily', snippet: 'Leaders from 20 nations have gathered for a summit to negotiate new treaties aimed at combating global warming.' },
                { title: 'Breakthrough in battery technology could triple EV range', url: '#', source: 'Innovation Hub', snippet: 'Scientists have announced a discovery in battery chemistry that could lead to electric vehicles with a range of over 1,000 miles on a single charge.' },
            ]
        }
    }
);


const prompt = ai.definePrompt({
  name: 'dailyBriefingPrompt',
  output: { schema: GetDailyBriefingOutputSchema },
  tools: [getNewsTool],
  prompt: `You are a news anchor AI. Your task is to provide a concise, engaging, and informative daily news briefing.
  
  Use the getNewsTool to fetch the latest headlines.
  
  Summarize the top 3-5 stories in a clear and easy-to-read format. For each story, provide a headline and a brief one-sentence summary.
  
  Format the output as a Markdown document. Start with a main heading like '# Your Daily Briefing'. Each news item should have a subheading like '## [Story Title]'.`,
});

const getDailyBriefingFlow = ai.defineFlow(
  {
    name: 'getDailyBriefingFlow',
    outputSchema: GetDailyBriefingOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    if (!output?.briefing) {
      return { briefing: "Sorry, I couldn't fetch the news briefing at this time. Please try again later." };
    }
    return output;
  }
);


export async function getDailyBriefing(): Promise<GetDailyBriefingOutput> {
  return getDailyBriefingFlow();
}
