---
name: new-feature
description: 启动一个新功能的开发流程。强制先读 PRD、决定是否 in-scope、选 subagent。
---

# /new-feature 流程

当 Wilson 说"加一个 X 功能"时，按以下步骤走。**不要直接开始写代码。**

## Step 1: 检查 PRD scope

```
Read docs/PRD.md 第 4 节（功能范围）
```

判断：
- 在 4.1（Day 14 MVP）→ 直接做
- 在 4.3（Week 3+ 候选）→ 问 Wilson "现在做还是等用户反馈"
- 完全不在 → 直接说"这个不在 scope，要加吗？"，等 Wilson 同意才开始

## Step 2: 选 subagent

参考 CLAUDE.md 的路由表：

| 关键词 | 委派给 |
|--------|--------|
| prompt / 提示词 / 框架 | prompt-engineer |
| 工具 / API / 数据源 | tool-builder |
| UI / 界面 / 组件 | ui-implementer |
| 知识库 / 文档 / RAG | knowledge-curator |
| 测试 / 评估 / 复盘 | dogfooder |

跨多个领域：你（主）协调。

## Step 3: 写 ADR（如果是设计决策）

如果这个功能涉及非显然的技术选择（用 X 不用 Y），**先在 docs/DECISIONS.md 加一条 ADR**。

## Step 4: 实现 + 测试

完成后跑：
```bash
npm run dogfood -- --feature=<name>
```

## Step 5: 更新文档

- 如果改了架构 → 更新 ARCHITECTURE.md
- 如果改了 PRD 范围 → 在 PRD 注明
- 如果改了不变量 → 在 CLAUDE.md 注明

## Step 6: Commit

```
feat(<scope>): <短描述>

详细说明：
- 改动点 1
- 改动点 2

委派的 subagent: <name>
相关 ADR: <#>
```
