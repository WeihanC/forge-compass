# 知识库源清单

> knowledge-curator 维护这份文档。每加一篇文档，登记一行。

最后更新：2026-05-11

---

## 统计

- 总文档数：9
- 总 chunks：39
- 最后灌入时间：2026-05-11
- 上一次成本：~$0.5（embeddings）

---

## P0：必须有（Day 5 之前完成）

### FDA 宠物食品法规

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | 21 CFR Part 501 - Pet Food Labeling Requirements | https://www.ecfr.gov/current/title-21/chapter-I/subchapter-E/part-501 | 2026-05-11 |
| ✅ | 21 CFR Part 502 - Common or Usual Name | https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-502 | 2026-05-11 |
| ⏳ | 21 CFR Part 507 - Current Good Manufacturing Practice | - | - |
| ✅ | FSMA Preventive Controls for Animal Food Rule | https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-rule-preventive-controls-animal-food | 2026-05-11 |
| ⏳ | FDA Pet Food Establishment Registration 流程 | https://www.fda.gov/animal-veterinary | - |

**已写入文件：**
- `docs/knowledge-sources/fda/pet-food-labeling.md` — 21 CFR 501 标签五大必填元素、Guaranteed Analysis、AAFCO 声明、常见违规
- `docs/knowledge-sources/fda/fsma-pet-food.md` — FDA 工厂注册、食品安全计划、PCQI、FSVP、记录保存 2 年要求
- `docs/knowledge-sources/fda/21-cfr-502.md` — 通用名称规则、AAFCO 95%/25%/3%/Flavor 规则、翻译陷阱

### Chewy 平台政策与财报

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | Chewy 入驻政策、账期、Autoship（综合 10-K + Vendor 资料） | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001766502 | 2026-05-11 |
| ⏳ | Chewy 商家入驻 FAQ（chewy.com 1P/3P） | https://www.chewy.com | - |

**已写入文件：**
- `docs/knowledge-sources/platform/chewy-vendor-policy.md` — Chewy 入驻路径、Autoship 占比与机制、账期惯例（行业 Net 30/60）、合规要求

### Amazon 宠物类目政策

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | Amazon Pet Supplies Category Requirements and Compliance | https://sellercentral.amazon.com/help/hub/reference/G200164330 | 2026-05-11 |
| ✅ | Amazon Restricted Products: Pet & Animal-related | https://sellercentral.amazon.com/help/hub/reference/G200164510 | 2026-05-11 |
| ⏳ | Amazon Pet Food Compliance（独立文档） | - | - |

**已写入文件：**
- `docs/knowledge-sources/platform/amazon-pet-category.md` — FDA 注册号要求、drug claim 禁区、UL/ETL 认证、EPA 驱虫登记、封号原因速查表
- `docs/knowledge-sources/platform/amazon-pet-category-full.md` — 完整 gated category 清单、申请流程、所需文件、审核时长、申诉路径

---

## P1：尽快有（Day 14 之前）

### TikTok Shop 美区

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | TikTok Shop US 类目政策（宠物）+ 合规要求 + 佣金口径 | https://seller-us.tiktok.com/university/essay?knowledge_id=5166793187346222 | 2026-05-11 |

**已写入文件：**
- `docs/knowledge-sources/platform/tiktok-shop-pet-us.md` — 宠物类目开放/禁售清单、Qualification Center 文件要求、佣金口径（具体数值指向 Seller Center 后台）

### 加州 Prop 65

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | California Proposition 65 and Pet Products | https://oehha.ca.gov/proposition-65 | 2026-05-11 |
| ⏳ | Prop 65 化学物质完整清单（宠物玩具相关） | https://oehha.ca.gov/proposition-65/chemicals | - |

**已写入文件：**
- `docs/knowledge-sources/regulation/prop65-pet-products.md` — 触发阈值（铅 MADL 0.5μg/day、DEHP 7.5μg/day）、2018 年新标签格式、私人诉讼机制、高风险品类（软 PVC 玩具、彩色项圈）

### FTC 营销合规

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | FTC Green Guides - Environmental Marketing Claims | https://www.ftc.gov/system/files/documents/federal_register_notices/2012/10/greenguidelines.pdf | 2026-05-11 |

**已写入文件：**
- `docs/knowledge-sources/regulation/ftc-green-guides.md` — "natural"/"organic"/"eco-friendly" 用词规则、AAFCO natural 定义、NOP organic 认证门槛、可降解/可回收/无毒声明合规要求

### USDA APHIS

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ⏳ | APHIS 宠物用品进口许可 | https://www.aphis.usda.gov | - |

---

## P2：可以有（v0.2 阶段）

### 关税与 HTS

| 状态 | 文档 | 来源 |
|------|------|------|
| ⏳ | HTS 宠物用品税号速查（4202、6307、9404） | https://hts.usitc.gov |

### 美国宠物市场数据

| 状态 | 文档 | 来源 |
|------|------|------|
| ⏳ | APPA 2024 年度市场报告摘要 | https://www.americanpetproducts.org |
| ⏳ | Packaged Facts 美国宠物市场 2024 | 公开摘要部分 |

### 各州税务（建仓相关）

| 状态 | 文档 | 来源 |
|------|------|------|
| ⏳ | 加州 sales tax + property tax + franchise tax 速查 | - |
| ⏳ | 德州 sales tax + 仓储税收激励 | - |
| ⏳ | 内华达建仓优惠政策 | - |

---

## 文档模板

每篇文档放在 `docs/knowledge-sources/<category>/<slug>.md`，格式：

```markdown
---
source_url: https://...
title: 文档标题（中文）
source_type: fda | chewy | amazon | tiktok | state_reg | market | tariff
published_date: 2024-09-15
fetched_date: 2025-11-08
expires: 2026-03-15
language: en | zh | mixed
---

## 中文摘要（200-500 字，供 RAG 中文 query 命中）

[这里写中文摘要，把英文原文的核心规则、数字、流程用中文表述。]

## 关键原文（English）

[这里贴关键段落，不要超过原文 15%。每段保留原始章节号。]

## 中国老板关注点

[1-3 条：这个文档对中国出海卖家最相关的部分。]
```

---

## 不要灌的内容

- ❌ CSDN / 知乎 / 公众号的"解读"文章
- ❌ 自媒体新闻报道
- ❌ 二手数据库（如 Statista 摘要）
- ❌ 大段版权内容拷贝（>15% 原文）
- ❌ 过时超过 18 个月的法规（除非历史参考有价值）
- ❌ 与宠物完全无关的内容
