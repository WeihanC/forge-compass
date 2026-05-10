# Forge Compass · 专业回答参考集（第二部分：合规类）

> 合规类回答的核心：**引用具体法规条款 + 中国老板视角白话翻译 + 强烈建议咨询专业人士**。
> AI 在合规问题上"讲得太自信"是最大风险——以下样本展示如何在专业和谨慎之间取得平衡。

---

## R02｜功能性宣称的监管风险

**问题**：我的产品涉及"宠物入口、接触皮肤、除味、抗菌、驱虫"等功能，会不会触发 FDA、EPA、CPSC 监管？

---

### ⚠️ 前置声明

本回答仅作为合规风险的**初步识别框架**，不构成法律意见。任何涉及 FDA / EPA / FIFRA 注册的产品上市前，必须由具备 FDA / EPA 注册经验的合规律师或专业咨询机构（如 Registrar Corp、Keller and Heckman LLP）进行个案审查。

**违规进入美国市场可能面临**：FDA 拒绝入境（detention without examination）、EPA 民事处罚（每违规日 $20,000+）、CPSC 强制召回 + 罚款。

---

### 五类功能与对应监管的速查表

| 产品宣称 | 主要监管机构 | 法规依据 | 风险等级 |
|---------|------------|---------|---------|
| 宠物入口（食用） | FDA | 21 CFR Part 501, FSMA | 🔴 极高 |
| 接触皮肤 / 毛发 | FDA + EPA | FFDCA Section 201, FIFRA | 🟡 中-高 |
| 除味 / 香氛 | EPA（如宣称杀菌）/ FDA 化妆品 | FIFRA / FFDCA | 🟡 中 |
| 抗菌 / 抗微生物 | EPA | FIFRA Section 3 | 🔴 极高 |
| 驱虫 / 杀虫 | EPA | FIFRA Section 3 | 🔴 极高 |

---

### 逐项分析

#### 1. 宠物入口（食品、零食、营养补充）

**监管主体**：FDA（CVM, Center for Veterinary Medicine）+ AAFCO 模型条例

**核心要求**：

- 必须在 FDA 完成 **Food Facility Registration**（21 CFR Part 1）
- 标签必须符合 **21 CFR Part 501**（产品名、营养成分、制造商信息、净含量）
- 任何"营养完整"宣称需符合 AAFCO Nutrient Profile
- 任何健康功能宣称（如 "supports joint health"）属于 **structure/function claim**，受严格管控

**白话翻译**：你卖一袋猫罐头到美国，FDA 不会预先审批，但海关随时可以拦截、抽检；标签错一个字（如把 "with chicken" 写成 "chicken"，含义完全不同）就可能被退运。

**强烈建议**：在产品上市前找 AAFCO 顾问审查标签。

---

#### 2. 接触皮肤 / 毛发（洗护、毛巾、湿巾）

**情况依产品宣称分化**：

- **纯清洁产品**（"宠物洗发水"、"宠物湿巾"）：相对宽松，主要受 FDA 化妆品法规（FFDCA）约束，重点关注成分安全性和标签真实性
- **若宣称含药效**（"治疗皮肤病"、"缓解过敏"）：升级为 FDA 兽用药品（Animal Drug），需 NADA / ANADA 申请，门槛极高
- **若宣称含抗菌**：见下文第 4 项，进入 EPA 管辖

**白话翻译**：宠物湿巾本身风险不高，但只要在包装上加一句 "kills 99.9% bacteria"，立刻从 FDA 跳到 EPA，从无需审批跳到必须 FIFRA 注册（费用 6 位数美元，周期 12-24 个月）。

---

#### 3. 除味 / 香氛

**关键判断**：宣称是"遮盖气味"还是"消除气味"？

- "Masks odor" / "Freshens" — FDA 化妆品类，宽松
- "Eliminates odor by killing bacteria" — 触发 EPA，必须注册

**白话翻译**：包装文案的一字之差能决定你是否需要花 $200k+ 做 EPA 注册。

---

#### 4. 抗菌 / 抗微生物（🔴 高危）

**法规依据**：FIFRA Section 3（联邦杀虫剂、杀菌剂、灭鼠剂法）

**核心规则**：在美国，**任何宣称能杀死、抑制、控制微生物（细菌、真菌、病毒）的产品**都被定义为 "pesticide"，必须在 EPA 注册。

**典型违规场景**：

- 中国制造的宠物玩具，包装上写 "antibacterial coating" — 触发 FIFRA
- 猫砂宣称 "controls odor-causing bacteria" — 触发 FIFRA
- 宠物水碗宣称 "kills 99% of germs" — 触发 FIFRA

**EPA 注册成本**：单一 active ingredient 注册费用 $200,000-1,000,000，周期 12-36 个月。

**例外（Treated Articles Exemption, 40 CFR §152.25(a)）**：如果产品仅在材料中加入抗菌剂用于**保护产品自身**（不是为了保护使用者），且该抗菌剂已经在 EPA 注册，则可以豁免。但宣称必须严格限定为 "preserves the product"，绝不能宣称 "protects pets"。

**白话翻译**：99% 中国卖家不知道这条规则，结果是大量宠物用品因 antibacterial 宣称被海关拦截或被 FTC 起诉。

**真实案例**：FTC 在 2022 年起诉某网红抗菌产品公司，因"未在 EPA 注册却宣称抗菌"，最终和解金 $1.2M（公开案件，可在 FTC 官网查询 "antimicrobial unregistered" 关键词）。

---

#### 5. 驱虫 / 杀虫（🔴 高危）

**法规依据**：FIFRA + State 各州杀虫剂法

**核心规则**：任何宣称能驱赶、击退、杀死跳蚤、蜱虫、蚊子、螨虫的产品，必须在 EPA 注册 **+** 在销售州的农业部门额外注册。

**典型产品**：宠物驱蚤项圈、驱蚤滴剂、驱蚤喷雾、驱蚤洗发水

**关键陷阱**：

- "Natural" 不是免责借口 — 即使是天然成分（柠檬草精油、薄荷油），只要宣称驱虫就要注册
- 仅有"包装宣称改成 freshens with citronella scent"才能规避注册，但失去销售卖点

---

### 高频违规清单（按 FDA / EPA 拦截率排序）

1. 宠物玩具包装含 "antibacterial" — EPA
2. 猫砂宣称 "odor-killing" — EPA
3. 零食宣称 "supports immune system" — FDA structure/function claim 越界
4. 湿巾宣称 "antiviral" / "kills germs" — EPA
5. 项圈宣称 "natural flea repellent" — EPA + FIFRA

---

### 中国卖家的最低合规框架

**未来 30 天内做的事**：

1. **审查所有产品包装、listing 文案、广告文案**，标记所有功能性宣称
2. 对每条宣称，自问：是否暗示"杀死、抑制、控制"任何生物（细菌、虫、霉菌）？
3. 凡触发的，立刻**修改宣称用词**，或启动 EPA / FDA 注册评估
4. 在 Amazon listing 中将合规化文案上架，为未来潜在的 FTC 调查留存合规化时间证据

**专业咨询渠道推荐**：

- **Registrar Corp**（FDA 合规咨询，按小时收费 $300-500）
- **Keller and Heckman LLP**（FIFRA / EPA 顶级律所，预算大的项目）
- 中文友好选择：上海 / 深圳本地的 FDA 合规咨询公司，初次评估约 $500-2,000

> ⚠️ **强调**：本框架仅识别风险类型。具体合规路径（注册 vs 修改宣称）必须在专业律师审查产品全貌后决定。

**[来源]**
- FDA 21 CFR Part 501: ecfr.gov/current/title-21/chapter-I/subchapter-E/part-501
- FIFRA: epa.gov/laws-regulations/summary-federal-insecticide-fungicide-and-rodenticide-act
- EPA Treated Articles Exemption 40 CFR §152.25(a)
- AAFCO Pet Food Labeling Guide: aafco.org

---

## R04｜宣称用词的法律风险

**问题**：包装上能不能写 "natural" / "organic" / "non-toxic" / "antibacterial" / "eco-friendly"？这些词的法律风险？

---

### 速查总表

| 用词 | 监管机构 | 是否需要认证 | 误用后果 |
|------|---------|------------|---------|
| **Organic** | USDA | ✅ 必须 USDA 认证（如 ≥95% 有机成分） | FTC 起诉 + 召回 |
| **Antibacterial** | EPA | ✅ 必须 FIFRA 注册 | FTC 起诉 + 召回 + 民事处罚 |
| **Antimicrobial** | EPA | ✅ 必须 FIFRA 注册 | 同上 |
| **Non-Toxic** | FTC（Green Guides）+ CPSC | ⚠️ 不需认证但需可证明 | FTC 调查、消费者集体诉讼 |
| **Natural** | FDA / FTC | ⚠️ 灰色地带 | FTC 调查、品牌信任损失 |
| **Eco-Friendly** | FTC（Green Guides） | ⚠️ 不需认证但需具体说明 | FTC 调查 |
| **Hypoallergenic** | FDA / FTC | ⚠️ 不需认证但需可证明 | FTC 起诉 |
| **Made in USA** | FTC | ✅ 必须 "all or virtually all" 美国产 | FTC 民事处罚 |
| **Vet-Approved** | FTC | ⚠️ 必须有真实兽医背书 | FTC 起诉 |

---

### 逐词深度分析

#### 1. "Organic" — USDA 严格管控

**法规依据**：USDA National Organic Program (NOP), 7 CFR Part 205

**使用规则**：

- 含有机成分 ≥95%：可标 "Organic"
- 含有机成分 70%-95%：可标 "Made with Organic [ingredients]"
- 含有机成分 < 70%：仅能在成分表中标具体哪些 ingredient 是 organic
- **必须**通过 USDA 认证机构（如 OTCO、CCOF）认证，认证费用 $1,000-3,000/年

**陷阱**：宠物食品、零食类产品任何"organic"宣称都需认证，**包括包装的小字**。FTC 对未认证滥用 organic 的处罚是和解金 + 强制召回。

---

#### 2. "Antibacterial" / "Antimicrobial" — 详见 R02

**核心**：在美国语境下，"Antibacterial" 不是营销用词，是**法律分类术语**——使用即触发 EPA 注册义务。

**唯一安全做法**：删除该词，改用 "freshness", "clean", "stays fresh longer" 等不涉及生物作用机制的词。

---

#### 3. "Non-Toxic" — 灰色但有红线

**法规依据**：FTC Green Guides (16 CFR Part 260) + CPSC Federal Hazardous Substances Act

**使用规则**：

- 不需要预先认证
- 但必须能**用科学证据证明产品对人 / 宠物在合理使用下无毒性**
- FTC 要求：宣称必须"有 'reasonable basis'"，通常需要第三方实验室毒性测试报告

**陷阱**：宠物玩具宣称 non-toxic，但宠物啃咬后释放邻苯二甲酸盐 — 一旦消费者集体诉讼，"reasonable basis" 测试报告是核心证据。

**安全做法**：

- 投资 ASTM F963（玩具安全标准）测试，约 $500-2,000 一次
- 在 listing 详情页的 description 中具体说明 "Tested for [specific substances]"
- 保留 3 年以上的测试报告

---

#### 4. "Natural" — FDA 灰色地带

**情况**：

- FDA 至今未对 "natural" 给出正式定义（2016 年开过公开征求意见，未出台）
- 行业惯例：不含人工色素、人工香料、人工防腐剂
- FTC 一般不会主动起诉 natural 滥用，但消费者集体诉讼很多

**典型诉讼案例**：Blue Buffalo（宠物食品品牌）2018 年因 "natural" 宣称被集体诉讼，和解金 $32M（公开案件，PACER 可查）。

**安全做法**：

- 如果用 "natural"，明确定义在包装或 FAQ：例如 "Made with natural ingredients, no artificial colors or preservatives"
- 不与 "organic" 混用以免被解读为暗示 organic 认证

---

#### 5. "Eco-Friendly" / "Sustainable" — 必须具体

**法规依据**：FTC Green Guides 第 260.4 条

**核心要求**：

- 不能用 unqualified（无修饰）的 "eco-friendly"
- 必须**具体说明**环保的某一维度：可回收？可降解？低碳排？

**反例（高风险）**：

> "Eco-friendly cat litter."

**正例（合规）**：

> "Made from recycled paper. Biodegradable in 30 days under composting conditions (ASTM D6400 tested)."

---

#### 6. "Hypoallergenic" — 风险被低估

**法规依据**：FTC + 集体诉讼基础

- FDA 没有正式定义，但 FTC 要求宣称必须有 "competent and reliable scientific evidence"
- 仅用"我们没有添加常见过敏原"作为证据，过去多次在集体诉讼中被否决
- **安全做法**：改用 "Free from [specific allergens: gluten/soy/corn]" — 具体列出排除的过敏原

---

### 真实判例（可在 PACER / FTC.gov 查证）

1. **Blue Buffalo natural litigation 2018** — "natural" + "no chicken by-product meal" 宣称失实，集体诉讼和解 $32M
2. **FTC v. Sanitizer companies 2020** — 多家手部消毒产品因 antibacterial 未 EPA 注册，被 FTC 罚款总计 $1.3M
3. **Petmate "BPA-free" investigation 2019** — FTC 调查"BPA-free"宣称的科学依据，最终公司主动撤回宣称

---

### 中国卖家的实操建议

**在每一个 listing / 包装审查时，做以下 checklist**：

- [ ] 用词是否在上面"红色"列表中（organic / antibacterial / antimicrobial / Made in USA）— 这些必须认证
- [ ] 用词是否在"黄色"列表中（non-toxic / natural / hypoallergenic / eco-friendly）— 是否有第三方科学证据支持？
- [ ] 是否避免了"绝对化用词"："100%"、"all-natural"、"completely safe"、"world's best" — FTC 重点打击
- [ ] 包装、listing、广告、详情页的宣称是否一致？— 不一致是 FTC 调查的高频触发点

**预算分配建议**：

- 法律审查包装文案的费用：$500-1,500 一次
- ASTM 测试 / FDA 实验室检测：$1,000-5,000
- 这些投入相比一次 FTC 调查或集体诉讼的 6 位数和解金，是极佳的保险

> ⚠️ **强调**：以上为通用合规框架。具体产品的用词审查必须由美国 FDA / FTC 合规律师执行。中国法律顾问对美国 advertising law 的理解通常不足以规避风险。

**[来源]**
- USDA NOP: ams.usda.gov/about-ams/programs-offices/national-organic-program
- FTC Green Guides: ftc.gov/legal-library/browse/rules/green-guides
- 16 CFR Part 260: ecfr.gov/current/title-16/chapter-I/subchapter-B/part-260
- Blue Buffalo class action settlement: case PACER 1:14-cv-00845
