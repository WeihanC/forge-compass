import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompts/system';
import { tools } from '@/lib/tools';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 2048,
    tools,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
