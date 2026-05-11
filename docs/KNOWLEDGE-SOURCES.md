# 知识库源清单

> knowledge-curator 维护这份文档。每加一篇文档，登记一行。

最后更新：2026-05-11

---

## 统计

- 总文档数：5
- 总 chunks：待灌入后统计
- 最后灌入时间：待灌入
- 上一次成本：$0

---

## P0：必须有（Day 5 之前完成）

### FDA 宠物食品法规

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | 21 CFR Part 501 - Pet Food Labeling Requirements | https://www.ecfr.gov/current/title-21/chapter-I/subchapter-E/part-501 | 待灌入 |
| ⏳ | 21 CFR Part 502 - Common or Usual Name | - | - |
| ⏳ | 21 CFR Part 507 - Current Good Manufacturing Practice | - | - |
| ✅ | FSMA Preventive Controls for Animal Food Rule | https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-rule-preventive-controls-animal-food | 待灌入 |
| ⏳ | FDA Pet Food Establishment Registration 流程 | https://www.fda.gov/animal-veterinary | - |

**已写入文件：**
- `docs/knowledge-sources/fda/pet-food-labeling.md` — 21 CFR 501 标签五大必填元素、Guaranteed Analysis、AAFCO 声明、常见违规
- `docs/knowledge-sources/fda/fsma-pet-food.md` — FDA 工厂注册、食品安全计划、PCQI、FSVP、记录保存 2 年要求

### Chewy 平台政策与财报

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ⏳ | Chewy 2024 Q3 10-Q | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001766502 | - |
| ⏳ | Chewy 2024 10-K | - | - |
| ⏳ | Chewy 商家入驻 FAQ | https://www.chewy.com | - |
| ⏳ | Chewy Autoship 商家政策 | - | - |

### Amazon 宠物类目政策

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | Amazon Pet Supplies Category Requirements and Compliance | https://sellercentral.amazon.com/help/hub/reference/G200164330 | 待灌入 |
| ⏳ | Amazon Pet Food Compliance | - | - |
| ⏳ | Amazon Restricted Products: Animal-related | - | - |

**已写入文件：**
- `docs/knowledge-sources/platform/amazon-pet-category.md` — FDA 注册号要求、drug claim 禁区、UL/ETL 认证、EPA 驱虫登记、封号原因速查表

---

## P1：尽快有（Day 14 之前）

### TikTok Shop 美区

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ⏳ | TikTok Shop US 类目政策（宠物） | seller-us.tiktok.com | - |
| ⏳ | TikTok Shop 佣金费率 2025 | - | - |

### 加州 Prop 65

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | California Proposition 65 and Pet Products | https://oehha.ca.gov/proposition-65 | 待灌入 |
| ⏳ | Prop 65 化学物质完整清单（宠物玩具相关） | https://oehha.ca.gov/proposition-65/chemicals | - |

**已写入文件：**
- `docs/knowledge-sources/regulation/prop65-pet-products.md` — 触发阈值（铅 MADL 0.5μg/day、DEHP 7.5μg/day）、2018 年新标签格式、私人诉讼机制、高风险品类（软 PVC 玩具、彩色项圈）

### FTC 营销合规

| 状态 | 文档 | 来源 | 灌入日期 |
|------|------|------|---------|
| ✅ | FTC Green Guides - Environmental Marketing Claims | https://www.ftc.gov/system/files/documents/federal_register_notices/2012/10/greenguidelines.pdf | 待灌入 |

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
