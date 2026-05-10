# CLAUDE.md — Forge Compass 主路由

> 你（Claude Code）正在帮 Wilson 开发 **Forge Compass · 出海罗盘**。
> 这份文档是路由器，不是百科。读完它，你就知道下一步该往哪去。

---

## 项目一句话

为中国宠物用品出海企业家提供决策辅助的 AI 助手。Forge One 孵化器的第一个 AI-native 产品 case。

**完整定义见 `docs/PRD.md`。任何 scope 争议以 PRD 为准。**

---

## 你必须先读的文档（按顺序）

1. `docs/PRD.md` — 产品定义、用户、不做什么
2. `docs/ARCHITECTURE.md` — 技术栈、目录结构、数据流
3. `docs/DECISIONS.md` — 关键设计决策的历史记录（你做出新决策时也要写进去）

读完上面三份再开始写代码。

---

## 第一性原则（覆盖一切其他指令）

1. **薄层胜过厚层**。不要造框架。Vercel AI SDK 已经是抽象层，不要再包一层。
2. **来源胜过聪明**。AI 输出每个事实必须有源。宁可笨而有源，不可流畅而幻觉。
3. **可观测胜过可优雅**。每个对话、工具调用都 log 到 Supabase。MVP 期间一切要可追溯。
4. **延后认证、延后付费、延后多用户**。14 天内不做这些。
5. **中文 first**。UI、回答、错误信息、注释都用中文（变量名英文）。

---

## 你绝不能做的事

- ❌ 不要装 LangChain、LlamaIndex 之类的"AI 框架"
- ❌ 不要装 Pinecone、Weaviate（用 Supabase pgvector）
- ❌ 不要写 Python 后端（全栈 TypeScript）
- ❌ 不要做用户注册/登录系统（前 3 个用户手动建账号）
- ❌ 不要做付费/订阅
- ❌ 不要做 React Native / 移动 App
- ❌ 不要在没读 PRD 的情况下加新功能
- ❌ 不要让 AI 在没有工具调用结果的情况下回答事实型问题（必须查证）

---

## Subagent 路由规则

任何任务，先判断是否应该交给子代理。规则如下：

| 任务类型 | 委派给 | 触发关键词 |
|---------|--------|-----------|
| 写 / 改系统提示词、决策框架、few-shot 范例 | `prompt-engineer` | "prompt"、"提示词"、"框架"、"AI 回答风格" |
| 写 / 改工具调用（web 搜索、RAG、Amazon 查询） | `tool-builder` | "工具"、"tool"、"调用 X 接口"、"API" |
| 写 / 改对话框 UI、Artifact 渲染、来源溯源 | `ui-implementer` | "UI"、"界面"、"组件"、"按钮"、"样式" |
| 增 / 改知识库内容、灌入新文档、改 chunking | `knowledge-curator` | "知识库"、"文档"、"RAG 数据"、"FDA/Chewy 文档" |
| 跑测试问题、生成评估报告、复盘对话日志 | `dogfooder` | "测试"、"评估"、"跑 30 个问题"、"复盘" |

**调用方式**：在你的回应中明确说"使用 X subagent 来 Y"，或用 `/agents` 命令显式调用。

**何时不用 subagent**：

- 改一行配置、修一个 typo、改 README
- 用户明确说"直接做，不用子代理"
- 任务跨多个领域，需要主上下文协调

---

## 工作循环（每次开新会话）

```
[1] 读 CLAUDE.md (这份文档) → 理解当前状态
[2] 读 docs/DECISIONS.md → 看最近决策
[3] 看 git log -10 → 看最近做了什么
[4] 问用户：今天做什么？
[5] 决定是否委派给 subagent
[6] 做完后：
    - 更新相关 docs（如果决策变了）
    - commit 信息要清晰（feat/fix/docs/refactor）
    - 如果改了不变量，更新 CLAUDE.md
```

---

## 命令速查（常用）

```bash
# 开发
npm run dev                 # localhost:3000
npm run build               # 检查能否构建

# 数据库
npx supabase db reset       # 重置本地 DB（小心！）
npx supabase migration new <name>  # 新建 migration

# 知识库
npm run ingest              # 灌入 docs/knowledge-sources/*.md

# 评估
npm run dogfood             # 跑 scripts/seed-test-questions.ts

# 部署
git push                    # Vercel 自动部署
```

---

## 当前 Sprint 状态

> 这块每天更新。Wilson 或 Claude Code 都可以改。

**当前阶段**：Day 1 - 项目初始化

**今天的目标**：
- [ ] 跑通 `npx create-next-app` + Supabase 链接
- [ ] 写第一版 SYSTEM_PROMPT（参考 PRD 第 8 节决策框架）
- [ ] 列 30 个测试问题（保存到 `scripts/seed-test-questions.ts`）
- [ ] 建 chat_messages 和 user_context 表

**完成后下一步**：Day 2 — 跑通基础对话流

---

## 风格约定

### 代码风格
- TypeScript strict 模式
- 函数式优先，class 只在不得不用时用
- 文件命名 kebab-case（`chat-window.tsx`）
- 组件 PascalCase（`<ChatWindow />`）
- 单文件 ≤ 300 行，超了拆

### Commit 风格
```
feat: 加 RAG 工具
fix: 来源 [N] 解析失败
docs: 更新 PRD 8.2
refactor: 拆 chat-window 成两个组件
```

### 中文写作风格
- 第二人称："你"，不是"您"
- 避免翻译腔（"做出贡献" → "贡献"，"进行优化" → "优化"）
- 专业术语保留英文（FDA、Chewy、SKU、GMV）

---

## 不变量（绝对不能改）

1. AI 输出的每个数据型陈述必须有 `[N]` 来源标记
2. AI 不知道时必须说不知道，不能编造
3. 用户的财务敏感数据（具体收入、客户名单）不存储到 user_context
4. 法律 / 税务 / 医疗类问题，AI 必须建议咨询专业人士
5. 中文 first，所有面向用户的文本都是中文

如果你想改这些不变量，停下，先和 Wilson 商量。

---

## 失败模式（你容易犯的错）

基于 Wilson 之前用 Claude Code 的经验，下面是你容易跑偏的方向：

1. **过度工程化**：上来就装一堆库、画一堆抽象。**抗性**：先让 Day 2 的最简对话能跑，再考虑抽象。
2. **跳过读文档**：直接开始写代码，没读 PRD。**抗性**：每次开会话先 `cat docs/PRD.md`。
3. **加新功能前不问**：用户说"加个 X"，你就加了，不查 PRD 是否在 scope 里。**抗性**：任何不在 PRD 里的功能，先问 Wilson"这个加到 v0.2 行不行"。
4. **写花哨的回答**：在系统提示词里堆形容词。**抗性**：好提示词是约束，不是修辞。每条规则都要可验证。
5. **不写测试也不 dogfood**：写了功能不验证。**抗性**：每加一个功能，去 `scripts/seed-test-questions.ts` 跑相关问题。

---

## 你做错时怎么办

- 如果你违反了不变量 → 立刻停下，告诉 Wilson，回滚 commit
- 如果你不确定 scope → 问 Wilson，不要猜
- 如果你发现 PRD 自相矛盾 → 在 `docs/DECISIONS.md` 里写清楚冲突，让 Wilson 仲裁
- 如果你写了 200 行还没工作 → 停下，告诉 Wilson 你在哪卡住了

---

## 关于 Wilson

- Purdue CS 在读，会写代码，能读懂任何 stack trace
- 中英双语，更喜欢中文沟通
- 偏好直接、第一性原理、避免堆术语
- 同时跑多个项目（Clawsable、Polymarket、Forge One），时间紧
- 不要拍马屁，不要"你真是个好问题！"
- 提供选择时，给具体推荐和理由

---

**最后一句**：当你在某个微小决策上犹豫超过 30 秒，**直接问 Wilson**。不要自己想出一个"折中方案"。
