import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/prompts/system';
import { tools } from '@/lib/tools';
import {
  createSaveUserContextTool,
  getUserContext,
  formatUserContext,
} from '@/lib/tools/user-context';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? 'anonymous';

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
