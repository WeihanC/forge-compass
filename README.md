# Forge Compass · 出海罗盘

为中国宠物用品出海企业家提供决策辅助的 AI 助手。Forge One 孵化器的第一个 AI-native 产品 case。

---

## Quick Start

```bash
# 1. 克隆 + 装依赖
git clone <repo>
cd forge-compass
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入：ANTHROPIC_API_KEY、OPENAI_API_KEY、TAVILY_API_KEY、
# RAPIDAPI_KEY、SUPABASE_URL、SUPABASE_ANON_KEY、SUPABASE_SERVICE_ROLE_KEY

# 3. 初始化数据库
npx supabase db push  # 或者去 Supabase 控制台手动跑 supabase/migrations/

# 4. 灌入知识库（Day 5+ 才需要）
npm run ingest

# 5. 跑起来
npm run dev
# → http://localhost:3000
```

---

## 项目状态

**当前阶段**：Day 1 - 项目初始化

**14 天 MVP 目标**：让 3 个真实的中国宠物出海老板用上，至少 1 个表达付费意愿。

详细路线图见 `docs/PRD.md`。

---

## 文档导航

如果你是 **Wilson** 或 **协作者**：
1. 读 `docs/PRD.md` — 产品在做什么
2. 读 `docs/ARCHITECTURE.md` — 怎么搭的
3. 读 `docs/DECISIONS.md` — 为什么这么搭

如果你是 **Claude Code**：
1. 读 `CLAUDE.md` — 主路由
2. 读 `.claude/agents/*.md` — 各 subagent 职责

---

## 常用命令

```bash
npm run dev              # 开发服务器
npm run build            # 构建检查
npm run lint             # 代码检查

npm run ingest           # 灌入知识库
npm run dogfood          # 跑 30 个测试问题
npm run test:tools       # 测试所有工具调用

# 数据库
npx supabase migration new <name>
npx supabase db push
npx supabase db reset    # ⚠️ 会清空数据
```

---

## Stack

- **前端**：Next.js 14 (App Router) + Tailwind + shadcn/ui
- **对话 SDK**：Vercel AI SDK + @ai-sdk/anthropic
- **LLM**：Claude Sonnet 4.5
- **数据库**：Supabase Postgres + pgvector
- **Embeddings**：OpenAI text-embedding-3-small
- **Web 搜索**：Tavily
- **Amazon 数据**：RapidAPI Amazon Data Scraper
- **部署**：Vercel

完整说明见 `docs/ARCHITECTURE.md` 第 1 节。

---

## License

Private. © Forge One.
