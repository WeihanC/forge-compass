import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

type UserContextRow = {
  user_id: string;
  company_name?: string | null;
  category?: string | null;
  gmv_range?: string | null;
  main_channels?: string[] | null;
  pain_points?: string[] | null;
  notes?: string | null;
  updated_at?: string;
};

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const ARRAY_FIELDS = new Set(['main_channels', 'pain_points']);

export function createSaveUserContextTool(userId: string) {
  return {
    description:
      '当用户提到自己的公司名、品类、年 GMV、销售渠道或主要痛点时，立即调用此工具保存到用户记忆。每次只保存一个字段。',
    parameters: z.object({
      field: z
        .enum(['company_name', 'category', 'gmv_range', 'main_channels', 'pain_points', 'notes'])
        .describe('要保存的字段名'),
      value: z
        .string()
        .describe(
          '要保存的值。main_channels 和 pain_points 用中文逗号分隔多个值，例如"亚马逊、Chewy"',
        ),
    }),
    execute: async ({ field, value }: { field: string; value: string }) => {
      try {
        const admin = getAdmin();
        const updateData: Record<string, unknown> = {
          user_id: userId,
          updated_at: new Date().toISOString(),
        };

        if (ARRAY_FIELDS.has(field)) {
          // 读取已有数组，合并去重
          const { data: current } = await admin
            .from('user_context')
            .select(field)
            .eq('user_id', userId)
            .maybeSingle();

          const existing: string[] = (current as UserContextRow | null)?.[field as keyof UserContextRow] as string[] ?? [];
          const incoming = value
            .split(/[,，、；;]/)
            .map((v) => v.trim())
            .filter(Boolean);
          updateData[field] = [...new Set([...existing, ...incoming])];
        } else {
          updateData[field] = value;
        }

        const { error } = await admin
          .from('user_context')
          .upsert(updateData, { onConflict: 'user_id' });

        if (error) return { success: false, error: error.message };
        return { success: true, saved: { field, value } };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
  };
}

export async function getUserContext(userId: string): Promise<UserContextRow | null> {
  const admin = getAdmin();
  const { data } = await admin
    .from('user_context')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  return data as UserContextRow | null;
}

export function formatUserContext(ctx: UserContextRow | null): string {
  if (!ctx) return '';
  const lines: string[] = [];
  if (ctx.company_name) lines.push(`公司：${ctx.company_name}`);
  if (ctx.category) lines.push(`品类：${ctx.category}`);
  if (ctx.gmv_range) lines.push(`年 GMV：${ctx.gmv_range}`);
  if (ctx.main_channels?.length) lines.push(`销售渠道：${ctx.main_channels.join('、')}`);
  if (ctx.pain_points?.length) lines.push(`痛点：${ctx.pain_points.join('；')}`);
  if (ctx.notes) lines.push(`其他：${ctx.notes}`);
  if (lines.length === 0) return '';
  return `\n\n## 当前用户画像\n${lines.join('\n')}`;
}
