# 设计决策日志（ADR）

> 每个非显然的设计决策记录在这。Claude Code 改动设计前要先读这里，避免重蹈覆辙。

---

## ADR 0001: 用 Next.js + Vercel AI SDK，不用 LangChain
**Date**: Day 1  
**Status**: Active

### Context
要做一个流式对话 + 工具调用 + RAG 的产品。市面流行做法是 LangChain 或 LlamaIndex。

### Decision
直接用 Next.js + Vercel AI SDK，不引入 LangChain。

### Reasoning
- LangChain 的抽象在 MVP 阶段是负担：每改一个细节都要绕一层 framework 代码
- Vercel AI SDK 的 `streamText({ tools })` 已经够用，自带流式、工具调用、UI hooks
- Wilson 喜欢"薄层胜过厚层"
- 项目体量小，不需要 LangChain 的"切换 LLM 提供商"能力

### Consequences
- 工具调用要自己写但不复杂
- RAG 自己拼（embed query → pgvector → 注入），不依赖 LangChain retrievers
- 如果后期想换框架，迁移成本不高（薄层好换）

---

## ADR 0002: 用 Supabase Postgres + pgvector，不用专门向量库
**Date**: Day 1  
**Status**: Active

### Context
RAG 需要向量存储。可选：Pinecone、Weaviate、Qdrant、pgvector。

### Decision
用 Supabase 自带的 pgvector。

### Reasoning
- 知识库规模 < 50 篇文档，几千 chunks。pgvector 性能完全够
- 一站式：DB + auth + 存储 + 向量都在 Supabase
- 0 额外成本（pgvector free tier 够 MVP）
- pgvector 0.7+ 在 Supabase 上已经支持 HNSW，性能不输专门库

### Consequences
- Schema 简单，一张 `knowledge` 表搞定
- 后期数据量上百万 chunk 时再考虑迁移

---

## ADR 0003: Claude Sonnet 4.5 作为唯一 LLM
**Date**: Day 1  
**Status**: Active

### Context
可以选 Claude / GPT-4o / Gemini / 国产模型。

### Decision
统一用 Claude Sonnet 4.5（model id：`claude-sonnet-4-5`）。

### Reasoning
- 中文质量优于 GPT-4o（用户都说中文）
- 工具调用稳定，符合产品需求
- 内置 web_search 工具可作为 Tavily 备选
- Wilson 已熟悉 Anthropic API 和 Claude Code

### Consequences
- 成本中等（Sonnet 4.5 比 GPT-4o 略贵但比 Opus 便宜）
- LLM-as-judge（dogfooder 用）也用 Claude，避免跨模型偏差
- 不引入"LLM 切换"复杂度

---

## ADR 0004: 中文优先，所有用户面向文本不英文
**Date**: Day 1  
**Status**: Active

### Context
用户是中国老板，中英文阅读能力不同。

### Decision
界面、回答、错误信息、引导文案全中文。代码注释中文。变量名英文。专业术语保留英文（FDA、Chewy、SKU、GMV、BSR）。

### Reasoning
- 用户母语中文，认知摩擦最小
- 专业术语保留英文：用户已经在出海，他们知道这些术语，强行翻译反而别扭

### Consequences
- prompts 也是中文写的
- few-shot 范例都用中文
- error toast 都是中文

---

## ADR 0005: 不做用户注册系统（MVP 内）
**Date**: Day 1  
**Status**: Active

### Context
3 个种子用户，他们用产品需要"账号"吗？

### Decision
14 天内不做注册/登录。Wilson 手动给每个用户一个独立 URL，URL 里带 user_id（如 `compass.forgeoneai.com?u=zhang_san`）。

### Reasoning
- 3 个用户做注册系统是浪费时间
- 不做不影响数据落库（用 URL 里的 user_id 区分）
- 等到 10+ 用户再做正式 auth

### Consequences
- 任何人拿到 URL 都能进，不安全 → 没关系，反正没敏感数据
- 后期加 auth 时数据迁移：把 user_id 字段从 string 改成 uuid + 关联到 auth.users

---

## ADR 0006: 来源溯源用 [N] inline 标记 + 末尾来源列表
**Date**: Day 1  
**Status**: Active

### Context
怎么让 AI 输出可溯源？方案：(a) 每段后面加链接 (b) inline footnote (c) hover 卡

### Decision
混合方案：
- AI 在文本里用 `[1]`、`[2]` 标记
- 工具调用结果统一收集到 `sources` 数组返回
- 前端解析 `[N]` → 渲染成可点击的 superscript
- Hover 弹出标题 + URL + 摘录

### Reasoning
- 抄 Perplexity，用户已熟悉这种交互
- 不影响阅读流畅度（不像每句后挂链接那么吵）
- 实现简单（一个 regex + 一个组件）

### Consequences
- AI 必须在 system prompt 里被严格教导用 [N] 标记
- 如果 AI 编 [N] 但 sources 数组里没有，前端 fallback 显示"来源缺失"

---

## ADR 0007: 暂不做"持续监控 Agent"
**Date**: Day 1  
**Status**: Deferred to v0.3

### Context
PRD 第 4.3 节提过：用户订阅"我关注的赛道/政策"，AI 每周推送变化。

### Decision
MVP 不做。

### Reasoning
- 涉及 cron jobs、邮件 / 微信推送、订阅管理 → 复杂度过高
- 价值未验证：用户先要愿意"问"，才会愿意"订阅"
- 等单用户对话 ≥ 50 次时再做

### Consequences
- v0.3 时再回来
- 现在不影响 MVP 价值证明

---

## 模板：新增一条 ADR

```markdown
## ADR XXXX: <一句话决定>
**Date**: <日期或 Sprint>
**Status**: Active | Deprecated | Superseded by ADR YYYY

### Context
<为什么要做这个决定？>

### Decision
<做了什么决定？>

### Reasoning
<为什么这么决定？列 3-5 条。>

### Consequences
<这个决定带来什么影响？什么变好了，什么变难了？>
```
