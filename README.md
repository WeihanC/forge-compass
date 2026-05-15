# Forge Compass · 出海罗盘

为中国宠物用品出海企业家提供决策辅助的 AI 助手。Forge One 孵化器的第一个 AI-native 产品 case。

---

## 一句话定位

老板问"美国 FDA 对宠物零食的标签要求是什么"、"Chewy 上 60 美元价位的猫砂哪个卖得好"、"我做爪子清洁喷雾该不该上 Amazon"——AI 给出**带来源**的回答，绝不幻觉，不知道就说不知道。

---

## Quick Start

```bash
# 1. 装依赖
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local：
#   ANTHROPIC_API_KEY           Claude 调用
#   OPENAI_API_KEY              embedding（RAG 灌库 + 检索）
#   TAVILY_API_KEY              web 搜索
#   RAPIDAPI_KEY                Amazon 数据
#   NEXT_PUBLIC_SUPABASE_URL    Supabase 项目
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY   后端写库用（不要泄漏）

# 3. 数据库迁移
npx supabase db push

# 4. 灌入知识库
npm run ingest

# 5. 跑起来
npm run dev
# → http://localhost:3000
```

首次访问会要求用 OTP 6 位验证码登录。Day-1 阶段账号靠 Supabase 控制台手动创建。

---

## 已落地功能

- **多轮对话** · 流式回答 + 工具调用，最多 5 步推理
- **来源溯源** · 每条数据型陈述带 `[N]` 标记，hover 行内 `[N]` 或底部来源 pill 显示标题 / 摘录 / 原文链接
- **历史对话** · 侧边栏列表，AI 自动用 Haiku 生成 8-15 字中文标题；跨用户写入校验已加固
- **工具调用** · `web_search`（Tavily）、`search_knowledge_base`（pgvector RAG）、`amazon_query`（RapidAPI）、`save_user_context`（长期记忆）
- **响应式 UI** · 桌面侧边栏 + 移动端抽屉，hover 卡 / tap popover 自动切换
- **登录** · Supabase Auth OTP，无密码
- **Admin 面板** · `/admin` 查看所有用户对话、token 消耗、工具调用次数

---

## 文档导航

| 你是谁 | 读什么 |
|--------|--------|
| Wilson / 协作者 | `docs/PRD.md` → `docs/ARCHITECTURE.md` → `docs/DECISIONS.md` |
| 设计参考 | `docs/DESIGN.md`（CSS tokens、组件规范） |
| Claude Code | `CLAUDE.md`（主路由）→ `.claude/agents/*.md`（subagent 职责） |
| 想加知识库内容 | `docs/KNOWLEDGE-SOURCES.md` + `docs/knowledge-sources/*.md` |

---

## 常用命令

```bash
# 开发
npm run dev              # 开发服务器
npm run build            # 构建检查（会跑 TS / Lint）
npm run lint

# 知识库 / 评估
npm run ingest           # 把 docs/knowledge-sources/*.md chunk + embed 灌入 Supabase
npm run dogfood          # 跑 scripts/run-dogfood.ts 测试问题集
npm run test:tools       # 单独测每个工具调用

# 数据库（Supabase CLI）
npx supabase migration new <name>
npx supabase db push
npx supabase db reset    # ⚠️ 清空数据
```

---

## Stack

| 层 | 技术 |
|----|------|
| 框架 | Next.js 14 App Router · TypeScript strict |
| UI | Tailwind · shadcn/ui · Radix（HoverCard / Popover） |
| 对话 SDK | Vercel AI SDK 4.0 · `useChat` |
| LLM | Claude Sonnet 4.5（主）· Claude Haiku 4.5（标题生成） |
| DB / Auth | Supabase Postgres + pgvector + Auth (OTP) |
| Embeddings | OpenAI `text-embedding-3-small` |
| Web 搜索 | Tavily |
| Amazon 数据 | RapidAPI Amazon Data Scraper |
| 部署 | Vercel（push main 自动部署） |

完整目录结构与数据流见 `docs/ARCHITECTURE.md`。

---

## 不变量

不变量来自 `CLAUDE.md`，写代码时强制遵守：

1. AI 输出的每个数据型陈述必须有 `[N]` 来源标记
2. AI 不知道时必须说不知道，**不能编造**
3. 用户的财务敏感数据（具体收入、客户名单）不存储到 `user_context`
4. 法律 / 税务 / 医疗类问题，AI 必须建议咨询专业人士
5. 中文 first，所有面向用户的文本都是中文
6. 知识库里所有具体数值必须附带**官方原始 URL**（指向给出该数值的具体页面，不是首页）

---

## License

Private. © Forge One.
