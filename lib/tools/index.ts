import { webSearchTool } from './web-search';
import { ragSearchTool } from './rag-search';

// amazon-query 在 Day 3 接入 RapidAPI 后再加进来
export const tools = {
  web_search: webSearchTool,
  search_knowledge_base: ragSearchTool,
};
