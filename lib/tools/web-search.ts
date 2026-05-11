import { z } from 'zod';

interface TavilyResult {
  url: string;
  title: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilyResult[];
}

export const webSearchTool = {
  description:
    '搜索互联网最新信息。用于：实时新闻、最新政策、平台动态、训练数据截止后发生的事情。不用于知识库里已有的固定内容。',
  parameters: z.object({
    query: z.string().describe('搜索关键词，建议用英文，例如 "Amazon pet supplies market 2024"'),
  }),
  execute: async ({ query }: { query: string }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return { results: [], query, error: 'TAVILY_API_KEY 未配置' };
    }

    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: 'basic',
          include_answer: false,
          max_results: 5,
          include_raw_content: false,
        }),
      });

      if (!res.ok) {
        return { results: [], query, error: `Tavily 请求失败: ${res.status}` };
      }

      const data = (await res.json()) as TavilyResponse;
      return {
        query,
        results: data.results.map((r) => ({
          title: r.title,
          url: r.url,
          content: r.content.slice(0, 500), // 截断避免 token 过多
        })),
      };
    } catch (err) {
      return { results: [], query, error: `搜索出错: ${String(err)}` };
    }
  },
};
