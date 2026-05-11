import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompts/system';
import { tools } from '@/lib/tools';
import {
  createSaveUserContextTool,
  getUserContext,
  formatUserContext,
} from '@/lib/tools/user-context';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, userId = 'anonymous' } = await req.json();

  const userCtx = await getUserContext(userId);
  const systemWithCtx = SYSTEM_PROMPT + formatUserContext(userCtx);

  const result = await streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: systemWithCtx,
    messages,
    maxTokens: 2048,
    tools: {
      ...tools,
      save_user_context: createSaveUserContextTool(userId),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
