import { config } from 'dotenv';
config();

import '@/ai/flows/synthesize-text-to-speech.ts';
import '@/ai/flows/answer-user-question.ts';
import '@/ai/flows/edit-image-flow.ts';
import '@/ai/flows/generate-video-flow.ts';
