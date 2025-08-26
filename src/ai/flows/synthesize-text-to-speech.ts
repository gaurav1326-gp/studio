'use server';
/**
 * @fileOverview Text-to-speech flow for converting text to audio.
 *
 * - synthesizeTextToSpeech - A function that synthesizes text to speech.
 * - SynthesizeTextToSpeechInput - The input type for the synthesizeTextToSpeech function.
 * - SynthesizeTextToSpeechOutput - The return type for the synthesizeTextToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const SynthesizeTextToSpeechInputSchema = z.string().describe('The text to synthesize to speech.');
export type SynthesizeTextToSpeechInput = z.infer<typeof SynthesizeTextToSpeechInputSchema>;

const SynthesizeTextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data in WAV format as a data URI.'),
});
export type SynthesizeTextToSpeechOutput = z.infer<typeof SynthesizeTextToSpeechOutputSchema>;

export async function synthesizeTextToSpeech(input: SynthesizeTextToSpeechInput): Promise<SynthesizeTextToSpeechOutput> {
  return synthesizeTextToSpeechFlow(input);
}

const synthesizeTextToSpeechFlow = ai.defineFlow(
  {
    name: 'synthesizeTextToSpeechFlow',
    inputSchema: SynthesizeTextToSpeechInputSchema,
    outputSchema: SynthesizeTextToSpeechOutputSchema,
  },
  async (text) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
