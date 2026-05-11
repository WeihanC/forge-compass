import { z } from 'zod';

// stub——Day 3 接入 RapidAPI 时替换 execute 实现并在 index.ts 注册
export const amazonQueryTool = {
  description: '查询 Amazon 产品数据（暂未启用）',
  parameters: z.object({
    keyword: z.string(),
    category: z.string().optional(),
  }),
  execute: async () => ({
    results: [],
    error: 'Amazon 数据工具暂未配置，请使用 web_search 替代。',
  }),
};
