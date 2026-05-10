# Forge Compass — 架构文档

> 这份文档描述系统怎么搭。代码层的真相以代码为准，这里是设计意图。

---

## 0. 设计原则

1. **薄层胜过厚层**：不要写"框架"。直接用 Vercel AI SDK 的工具调用，不要包一层 LangChain。
2. **单文件胜过多文件**：MVP 阶段，能塞在一个文件就别拆。等到改三处才能改完一件事时再拆。
3. **可观测胜过可优雅**：每个对话、每个工具调用都 log 到 Supabase。MVP 阶段你需要看到一切。
4. **来源胜过聪明**：宁可 AI 答得"笨"但每个事实有源，也不要"流畅但可能幻觉"。
5. **延后认证**：14 天内不做用户注册系统，3 个种子用户用 magic link 即可。

---

## 1. 技术栈决策

| 层 | 选择 | 替代方案 | 为什么 |
|----|------|---------|--------|
| 前端框架 | Next.js 14 App Router | Vite + React | Vercel 部署友好；服务端流式 API |
| UI 库 | shadcn/ui + Tailwind | MUI / Chakra | 抄 Claude.ai 风格容易 |
| 对话 SDK | Vercel AI SDK (ai + @ai-sdk/anthropic) | 手写 SSE | 工具调用、流式、UI hooks 全套 |
| LLM | Claude Sonnet 4.5 (`claude-sonnet-4-5`) | GPT-4o | 中文质量更好，工具调用稳定 |
| 数据库 | Supabase Postgres + pgvector | 自建 PG | 一站式：DB + auth + 向量 + 存储 |
| Embeddings | OpenAI text-embedding-3-small | Voyage / Cohere | 便宜、稳定、$0.02/1M tokens |
| Web 搜索工具 | Tavily API | SerpAPI / Brave | LLM 优化、free tier 慷慨 |
| Amazon 数据 | RapidAPI Amazon Data | Helium10 / 自爬 | $10/月，MVP 够用 |
| 部署 | Vercel | Fly.io / Railway | git push 即部署 |
| 域名 | compass.forgeoneai.com | 新域名 | 借用 Forge One 品牌 |
| 监控 | Helicone（可选）+ Supabase logs | LangSmith | 看 LLM 调用 + 存对话 |

**不用的东西，明确说明：**

- ❌ LangChain / LlamaIndex（过度抽象）
- ❌ Pinecone / Weaviate（pgvector 够了）
- ❌ Redis（暂时不需要缓存）
- ❌ Docker（Vercel 不需要）
- ❌ FastAPI / Python 后端（全栈 TS 简化部署）

---

## 2. 项目结构

```
forge-compass/
├── app/
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 主页：对话框
│   ├── globals.css           # Tailwind
│   └── api/
│       ├── chat/route.ts     # 主对话端点 (核心)
│       └── ingest/route.ts   # 知识库灌入 (临时)
│
├── components/
│   ├── chat/
│   │   ├── chat-window.tsx   # 主对话框
│   │   ├── message.tsx       # 单条消息（含 [N] 来源解析）
│   │   ├── citation.tsx      # 来源 hover 卡
│   │   └── artifact-pane.tsx # 右侧 artifact 渲染
│   └── ui/                   # shadcn 组件
│
├── lib/
│   ├── prompts/
│   │   ├── system.ts         # 主系统提示词 (核心资产)
│   │   ├── frameworks.ts     # 4 个决策框架
│   │   └── examples.ts       # Few-shot 中文范例
│   ├── tools/
│   │   ├── index.ts          # 工具注册中心
│   │   ├── web-search.ts     # Tavily
│   │   ├── rag-search.ts     # 知识库
│   │   ├── amazon-query.ts   # RapidAPI
│   │   └── user-context.ts   # 读写用户画像
│   ├── supabase/
│   │   ├── client.ts         # 浏览器端
│   │   └── server.ts         # 服务端
│   └── utils.ts
│
├── supabase/
│   └── migrations/
│       ├── 0001_init.sql     # chat_messages, user_context
│       └── 0002_knowledge.sql # knowledge + pgvector
│
├── scripts/
│   ├── ingest-knowledge.ts   # 灌入知识库的一次性脚本
│   └── seed-test-questions.ts # Day 7 dogfood 用的 30 个问题
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md       # 你正在读
│   ├── DECISIONS.md          # 设计决策日志（ADR）
│   └── KNOWLEDGE-SOURCES.md  # 知识库文档清单
│
├── .claude/
│   ├── agents/
│   │   ├── prompt-engineer.md
│   │   ├── tool-builder.md
│   │   ├── ui-implementer.md
│   │   ├── knowledge-curator.md
│   │   └── dogfooder.md
│   └── commands/
│       └── new-feature.md
│
├── CLAUDE.md                 # 顶层路由器（最重要）
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local.example
```

---

## 3. 核心数据流

### 3.1 一次普通对话

```
用户输入
    ↓
useChat hook (Vercel AI SDK) 
    ↓
POST /api/chat (messages, userId)
    ↓
[1] 加载 user_context（如果有）
    ↓
[2] 注入 system prompt + 用户画像
    ↓
[3] streamText() with tools
    ↓
Claude 决定：
    a) 直接回答 → 流式输出
    b) 调用工具 → tool_use → tool_result → 再生成
    ↓
[4] 流式 SSE 返回前端
    ↓
[5] onFinish: 记录到 chat_messages
    ↓
前端渲染 + 解析 [N] 来源
```

### 3.2 工具调用细节

```typescript
// lib/tools/index.ts 注册的工具
export const tools = {
  search_knowledge_base: {
    description: '搜索内部宠物出海知识库（FDA 法规、Chewy 政策、市场报告）',
    parameters: z.object({
      query: z.string().describe('查询关键词，中英文皆可'),
    }),
    execute: async ({ query }) => { /* RAG */ }
  },
  
  web_search: {
    description: '搜索互联网最新信息。优先用于：实时新闻、最新政策、未在知识库的内容',
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => { /* Tavily */ }
  },
  
  query_amazon_product: {
    description: '查询 Amazon 上的产品数据（价格、评分、销量估算、Top sellers）',
    parameters: z.object({
      keyword: z.string(),
      category: z.string().optional(),
    }),
    execute: async ({ keyword, category }) => { /* RapidAPI */ }
  },
  
  save_user_context: {
    description: '当用户提供公司/品类/痛点信息时，调用此工具保存到记忆',
    parameters: z.object({
      field: z.enum(['company_name', 'category', 'gmv_range', 'main_channels', 'pain_points']),
      value: z.string(),
    }),
    execute: async ({ field, value }) => { /* upsert user_context */ }
  },
};
```

### 3.3 系统提示词组装

```typescript
// 每次请求时动态拼装
const systemPrompt = [
  CORE_IDENTITY,           // "你是出海罗盘..."
  DECISION_FRAMEWORKS,     // 4 个框架
  FEW_SHOT_EXAMPLES,       // 3 个高质量中文范例
  formatUserContext(ctx),  // "当前用户：张三，做宠物饮水机..."
  INVARIANTS,              // "你不能编造数据..."
].join('\n\n');
```

---

## 4. 数据库 Schema

### 4.1 chat_messages

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,           -- 暂时用用户名字符串
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL,              -- 'user' | 'assistant' | 'tool'
  content JSONB NOT NULL,          -- 消息体（含 tool_calls）
  tokens_input INT,
  tokens_output INT,
  cost_usd NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_user ON chat_messages(user_id, created_at DESC);
CREATE INDEX idx_chat_conv ON chat_messages(conversation_id, created_at);
```

### 4.2 user_context

```sql
CREATE TABLE user_context (
  user_id TEXT PRIMARY KEY,
  company_name TEXT,
  category TEXT,                   -- '宠物饮水机' / '宠物零食' 等
  gmv_range TEXT,                  -- '<$1M' / '$1M-$10M' 等
  main_channels TEXT[],            -- ['amazon', 'chewy']
  pain_points TEXT[],              -- 自由文本数组
  notes TEXT,                      -- 其他对话中提取的上下文
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 knowledge

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,        -- 必须有源
  source_type TEXT NOT NULL,       -- 'fda' | 'chewy_filing' | 'amazon_policy' 等
  title TEXT NOT NULL,
  chunk TEXT NOT NULL,
  embedding VECTOR(1536),          -- OpenAI text-embedding-3-small
  language TEXT DEFAULT 'en',
  metadata JSONB,                  -- 灵活字段：发布日期、章节号等
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON knowledge USING ivfflat (embedding vector_cosine_ops);

-- RPC for similarity search
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  source_url TEXT,
  title TEXT,
  chunk TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id, k.source_url, k.title, k.chunk,
    1 - (k.embedding <=> query_embedding) AS similarity
  FROM knowledge k
  ORDER BY k.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 5. 来源溯源机制

这是产品的灵魂。设计如下：

**Claude 输出端**：在系统提示词里强制要求每个事实型陈述后面用 `[N]` 标记。

```
亚马逊宠物类目在 2024 Q3 同比增长 12% [1]，
其中饮水机子类目增速达 23% [2]。
```

**API 返回端**：在工具调用结束后，把所有引用过的 source 拼成一个数组返回，前端可以匹配。

```typescript
{
  text: "...增长 12% [1]，...增速 23% [2]。",
  sources: [
    { id: 1, url: "https://...", title: "Amazon Q3 报告", excerpt: "..." },
    { id: 2, url: "https://...", title: "PetIndustry 2024", excerpt: "..." },
  ]
}
```

**前端渲染端**：用 regex 把 `[1]` 替换成 `<sup>` 链接，hover 显示来源卡片。

---

## 6. Subagent 架构（开发期）

> 这里说的是 **开发 Forge Compass 时使用 Claude Code 的子代理**，
> 不是产品里给用户用的 agent。

详见 `.claude/agents/*.md`。每个子代理都有清晰的职责：

```
              CLAUDE.md (主路由)
                    │
        ┌───────────┼───────────┬────────────┐
        ▼           ▼           ▼            ▼
   prompt-     tool-       ui-       knowledge-   dogfooder
   engineer    builder     impl.     curator
```

调用规则：
- 写 / 改系统提示词 → `prompt-engineer`
- 加 / 改工具调用 → `tool-builder`
- 改对话框 / Artifact UI → `ui-implementer`
- 增 / 改知识库文档 → `knowledge-curator`
- 跑测试问题、生成评估报告 → `dogfooder`

---

## 7. 部署

### 7.1 环境变量

```bash
# .env.local（不要 commit）
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...                    # embeddings 用
TAVILY_API_KEY=tvly-...
RAPIDAPI_KEY=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...          # 服务端用
```

### 7.2 Vercel 部署

```bash
vercel link
vercel env add ANTHROPIC_API_KEY
# ... 加完所有 key
vercel --prod
```

### 7.3 域名

绑定 `compass.forgeoneai.com`（在 Forge One 的 GitHub Pages 或主域 DNS 加 CNAME）。

---

## 8. 不变量与边界

```
对外承诺：
- 每个数据型回答都有可点击来源
- 不编造，不知道就说不知道
- 用户画像不外泄

技术边界：
- 单次工具调用超时 30s
- 单次对话最多 10 轮工具调用（防 infinite loop）
- 单条消息最多 8192 输出 tokens
- 知识库 chunk 最大 1000 tokens
```

---

## 9. 演进路径

| 阶段 | 触发条件 | 改动 |
|------|---------|------|
| MVP | Day 14 | 当前架构 |
| V0.2 | 3 用户中至少 1 个愿付费 | 加用户系统、订阅、Stripe |
| V0.3 | 单用户对话 ≥ 50 次 | 加持续监控 Agent + 邮件推送 |
| V0.4 | 用户主动问"能否帮我对接律师" | 加人工兜底入口（咨询预约） |
| V0.5 | 月 ARR > $5k | 拓品类（从宠物到家居 / 户外 / ...） |

---

**版本历史**

- v0.1（Day 1）：初版架构
