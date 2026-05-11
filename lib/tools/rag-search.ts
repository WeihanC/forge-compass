import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

type KnowledgeResult = {
  id: string;
  source_url: string;
  title: string;
  chunk: string;
  similarity: number;
};

export const ragSearchTool = {
  description:
    '搜索内部知识库（FDA 法规、FSMA、加州 Prop 65、FTC Green Guides、Amazon 宠物类目政策）。用于合规类问题和平台政策查询，优先于 web_search 使用。',
  parameters: z.object({
    query: z.string().describe('查询内容，中英文皆可，例如"FDA 宠物食品标签要求"'),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      const openai = getOpenAI();
      const admin = getAdmin();

      const embRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
      });
      const embedding = embRes.data[0].embedding;

      const { data, error } = await admin.rpc('match_knowledge', {
        query_embedding: embedding,
        match_count: 5,
      });

      if (error) return { results: [], query, error: error.message };

      return {
        query,
        results: (data as KnowledgeResult[]).map((r) => ({
          title: r.title,
          source_url: r.source_url,
          chunk: r.chunk,
          similarity: Math.round(r.similarity * 100) / 100,
        })),
      };
    } catch (err) {
      return { results: [], query, error: String(err) };
    }
  },
};
