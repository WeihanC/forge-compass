# Forge Compass 设计规范

> 来源：Claude Design 上 Wilson 做的两份设计稿（`index.html` 登录页 + `workspace.html` 工作台）。
> 整体风格：纯黑 + 蓝白主色，极简 ChatGPT 风（高级、有 AI 感、不堆冗余 UI）。
> 设计稿落地参考：`/tmp/design-workspace/forge-compass/project/{index,workspace}.html`

---

## 1. 颜色系统

### 1.1 工作台（Workspace）

工作台是主战场，浅色为默认，深色由用户切换。

| Token | Light（默认） | Dark | 用途 |
|-------|------|------|------|
| `--accent` | `#3B82F6` | `#4F8EF7` | 主色：主按钮、logo、链接、focus 环、citation pill 数字 |
| `--bg` | `#FAFAF9` | `#0E0F12` | 应用最外层背景（暖白 / 近黑） |
| `--surface` | `#FFFFFF` | `#15171C` | 卡片 / 主对话区背景 |
| `--sb-bg` | `#F7F7F5` | `#0B0C0F` | 侧边栏背景（比 bg 略深） |
| `--ink` | `#0F172A` | `#ECEDEE` | 主文字（标题、AI 正文） |
| `--ink-2` | `#1F2937` | `#D4D6D9` | 次要文字（strong、ai header） |
| `--ink-mute` | `#4B5563` | `#9BA0A8` | 弱化文字（标签、副标） |
| `--ink-faint` | `#9CA3AF` | `#6B7180` | 提示文字（placeholder、时间戳） |
| `--line` | `#ECECEC` | `#23262C` | 主分隔线 / 边框 |
| `--line-soft` | `#F2F2F0` | `#1B1D22` | 弱分隔线（顶栏底） |
| `--hover` | `#F0F0EE` | `#1E2026` | 悬浮态背景 |
| `--bubble` | `#F4F4F2` | `#1E2026` | 用户消息气泡背景 |
| `--send-ink` | `#0F172A` | `#ECEDEE` | 发送按钮空态色（与 ink 同） |
| `--scroll` | `#E5E5E2` | `#2B2F36` | 主区滚动条 |
| `--scroll-sb` | `#E0E0DC` | `#2B2F36` | 侧边栏滚动条 |

### 1.2 登录页（Login）

登录页是独立审美：纯黑底 + 玻璃质感卡片。**主色与工作台统一**：light = `#3B82F6`，dark = `#4F8EF7`。其他变量保留登录页专属的半透明 `rgba`（玻璃质感需要）。

| Token | Dark（默认） | Light |
|-------|------|------|
| `--accent` | `#4F8EF7` | `#3B82F6` |
| `--bg` | `#000000` | `#F6F8FB` |
| `--ink` | `#E7ECF3` | `#0C1322` |
| `--ink-mute` | `rgba(231,236,243,.62)` | `rgba(12,19,34,.66)` |
| `--ink-faint` | `rgba(231,236,243,.38)` | `rgba(12,19,34,.42)` |
| `--line` | `rgba(255,255,255,.08)` | `rgba(12,19,34,.10)` |
| `--line-soft` | `rgba(255,255,255,.05)` | `rgba(12,19,34,.06)` |
| `--card` | `rgba(10,14,22,.55)` | `rgba(255,255,255,.92)` |
| `--field` | `rgba(255,255,255,.04)` | `rgba(12,19,34,.04)` |
| `--field-focus` | `rgba(255,255,255,.06)` | `rgba(12,19,34,.06)` |

**说明**：登录页特地用半透明 `rgba` 是为了玻璃质感（`backdrop-filter: blur(20px) saturate(150%)`）。

### 1.3 语义色（错误 / 警告）

- 红 `#EF4444`（表单错误、删除）
- 配套阴影：`box-shadow: 0 0 0 3px rgba(239, 68, 68, .15)` 用于 focus 错误态

---

## 2. 字体

```css
font-family: "Noto Sans SC", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
```

等宽：

```css
font-family: "JetBrains Mono", ui-monospace, monospace;
```

**通过 Google Fonts 加载**：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

**body**：`-webkit-font-smoothing: antialiased;`

### 字号阶梯

| 名称 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| caption | 10.5px | 500 | 1.4 | 大写小标签（prompt-card-tag、sb-section） |
| label | 11.5px | 500 | 1.4 | 表单 label、ticker meta、footer |
| small | 12px–12.5px | 500 | 1.4 | 错误信息、链接、segmented |
| meta | 13px | 500 | 1.5 | sb-item、prompt-card 文案 |
| body | 14px–14.5px | 400 | 1.55–1.75 | AI 正文（14.5/1.75）、user bubble（14.5/1.65）、composer textarea |
| h4 | 15.5px | 600 | 1.4 | ai-content h3 |
| h3 | 16px | 600 | 1.4 | sidebar logo brand name |
| h2 | 20px–22px | 700 | 1.3 | login success / minor headings |
| h1 | 26px | 600–700 | 1.05 | welcome 标题 / auth title |
| hero | clamp(40px, 4.2vw, 64px) | 700 | 1.05 | 登录页左侧标语 |

**字符间距**：
- hero 标题：`letter-spacing: -0.01em`
- caption / kicker 大写：`letter-spacing: 0.06em–0.16em`
- 数字（value-prop）：`letter-spacing: -0.02em` + `font-feature-settings: "tnum"`
- 其他：默认 0

---

## 3. 间距与布局

### 3.1 间距阶梯

直接列出实际用到的值：`4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 28 / 32 / 36 / 40 / 56`（单位 px）

### 3.2 布局尺寸

| 区域 | 尺寸 |
|------|------|
| 侧边栏宽度 | 260px |
| 对话内容最大宽度（wrap） | 740px |
| 工作台 padding 横向 | 24px |
| 顶栏高度 | 由内容撑开（padding `10px 18px`） |
| 顶栏底分隔 | 1px solid `--line-soft` |
| 登录页 grid | `grid-template-columns: 1.15fr 0.85fr`（< 1100px 单列） |
| 登录页 brand-col 内边距 | `40px 56px` |
| 登录页 auth card max-width | 440px |
| 登录页 auth card 内边距 | `36px 36px 28px` |

---

## 4. 圆角 / 阴影 / 过渡

### 4.1 圆角

| 值 | 用途 |
|---|---|
| 6px | citation src-num 圆点容器 |
| 7px | sb-item / top-model / top-btn |
| 8px | sb-new / 主按钮（小尺寸） |
| 9px | comp-send |
| 10px | 表单 input box / login 主按钮 / oauth-btn / seg 容器 |
| 12px | prompt-card |
| 14px | intel-ticker |
| 18px | user bubble |
| 20px | auth card |
| 22px | composer |
| 50% | avatar |
| 99px | chip / pill / divider line cap |

### 4.2 阴影

```css
/* 主按钮（accent） */
box-shadow: 0 8px 24px color-mix(in oklab, var(--accent) 35%, transparent),
            0 1px 0 rgba(255, 255, 255, .18) inset;

/* 主按钮 hover */
box-shadow: 0 12px 32px color-mix(in oklab, var(--accent) 45%, transparent),
            0 1px 0 rgba(255, 255, 255, .22) inset;

/* Auth card 暗色 */
box-shadow: 0 1px 0 rgba(255, 255, 255, .06) inset,
            0 30px 80px rgba(0, 0, 0, .45);

/* Auth card 浅色 */
box-shadow: 0 1px 0 rgba(255, 255, 255, .6) inset,
            0 30px 80px rgba(20, 30, 60, .10);

/* Composer 静态 */
box-shadow: 0 1px 4px rgba(0, 0, 0, .04);

/* Composer focus */
box-shadow: 0 1px 4px rgba(0, 0, 0, .04),
            0 0 0 4px color-mix(in oklab, var(--accent) 12%, transparent);

/* Welcome logo */
box-shadow: inset 0 1px 0 rgba(255, 255, 255, .25),
            0 8px 24px color-mix(in oklab, var(--accent) 25%, transparent);

/* sb-item active */
box-shadow: 0 0 0 1px var(--line);

/* 表单 focus 通用环 */
box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent);
```

### 4.3 过渡

| 时长 | 缓动 | 用途 |
|------|------|------|
| 0.15s | linear / ease | hover / focus 通用 |
| 0.2s | ease | box-shadow / background-color |
| 0.25s | ease | 颜色切换 |
| 0.3s | cubic-bezier(.5, .1, .25, 1) | 分段切换器 thumb 滑动 |
| 0.55s | ease | intel 新条目 fade in |
| 1s | linear infinite | spinner |
| 1.2s | ease-in-out infinite | thinking 三点跳动 |
| 1.6s | ease-in-out infinite | 脉冲 dot |
| 7s | ease-in-out infinite | hero 标题流光 |

---

## 5. 关键组件规范

### 5.1 侧边栏（`.sb`）

- 宽度 260px，背景 `--sb-bg`，右侧 1px solid `--line`
- 顶部：26x26 圆角 7px logo（accent 背景，inset highlight 1px）+ brand name + 右侧 collapse 图标
- "新对话"按钮：白底（surface）+ 1px line 边框 + radius 8px + 加号图标
- "搜索对话"行：弱化文字 + 搜索图标，hover 高亮
- 分组标题（`sb-section`）：11px / 600 / 大写 / letter-spacing 0.04em / 弱化色 / padding `14px 10px 4px`
- 列表项（`sb-item`）：13px / `--ink-2`，padding `8px 10px`，radius 7px
- Active 项：`--surface` 背景 + box-shadow `0 0 0 1px --line` + font-weight 500
- 底部用户区：分隔线 + avatar（28x28 圆 accent + 首字母白字 11.5/600）+ 名字 + plan + dots 图标
- 滚动条：6px，thumb `--scroll-sb` radius 99px

### 5.2 顶栏（`.top`）

- padding `10px 18px`，bottom 1px `--line-soft`
- 模型选择器（`top-model`）：14px / 600 brand name + faint "·情报版" + chev 图标，hover bg `--hover`
- 右上图标按钮：32x32 radius 7px，hover bg `--hover`

### 5.3 用户消息（`.msg-user`）

- 整体 `.msg`：padding `14px 0`
- 内层 `.wrap`：740px 居中，display flex justify-end
- 气泡：`--bubble` 背景，radius 18px，padding `11px 16px`，14.5px / 1.65，max-width 85%，inline-block，`white-space: pre-wrap`

### 5.4 AI 消息（`.msg-ai`）

- `ai-head`：26x26 圆 accent + Sparkle SVG 居中 + 13px / 600 brand name "出海罗盘"
- `ai-content`：14.5px / 1.75 / `--ink`，text-wrap pretty
- `p`：margin 0 0 12px
- `h3`：15.5px / 600 / margin `18px 0 8px`
- `ul`、`ol`：padding-left 22px，margin 0 0 14px；`li` margin-bottom 4px；`li::marker` color `--ink-faint`（ol 更深、用 ink-mute）
- `strong`：600 / `--ink-2`
- `ai-actions`（复制/赞/踩/重试）：默认 opacity 0，hover msg-ai 时显现，28x28 radius 6px，icon faint，hover bg `--hover`

### 5.5 来源 pill 行（`.sources-row`）

- 顶部 12px padding-top + 1px solid `--line-soft` 分隔
- `sources-label`："信息来源" 11.5px faint
- 每个 pill（`.src-pill`）：13px mute，padding `3px 8px`，border 1px line，radius 99px，背景 surface，hover bg hover + ink
- 小圆数字（`.src-num`）：14x14 圆，背景 `--bubble`，9.5px / 600 / mute

### 5.6 欢迎页（`.welcome`）

- 居中布局，高度撑满 stream
- Welcome logo：48x48 radius 14px accent 背景 + Sparkle 22px + 上面提到的 inset highlight + accent glow 阴影
- h1："有什么可以帮你？" 26px / 600 / letter-spacing -0.01em
- 副标："聚焦海外市场情报、政策与渠道决策。试试这些起手式：" 14px mute
- prompt-grid：2x2 grid，gap 10px，max-width 640px
- prompt-card：surface 背景 + 1px line + radius 12px + padding `14px 16px`，左对齐
  - 标签（`prompt-card-tag`）：10.5px / 500 / 大写 / letter-spacing 0.06em / **用 accent 色**
  - 文案：13.5px / `--ink` / line-height 1.55
- card hover：`bg-hover` + `translateY(-1px)`

### 5.7 输入区（`.composer`）

- 容器：740px 居中，surface 背景 + 1px line + radius 22px + padding `6px 6px 6px 18px`
- focus 环：accent 35% 边框色 + accent 12% 4px 阴影环
- textarea：透明 / 14.5px / 1.55 / padding `12px 0` / `max-height 200px` / auto-resize
- 左下工具按钮（attach / globe / sparkle）：32x32 radius 8px，icon mute，hover bg hover
  - 工具激活态（`.on`）：图标 accent + 背景 `color-mix(accent 10%, transparent)`
- 右下发送按钮（`comp-send`）：34x34 radius 9px
  - 空态：`--send-ink` 背景（ink 黑色）+ surface 图标 + opacity 0.25
  - 有字：accent 背景 + 白色箭头 + hover `translateY(-1px)`
- 下方 hint："内容由 AI 生成，重要决策请核实信息来源。" 11px faint center

### 5.8 Thinking 三点（`.thinking`）

```css
.thinking { display:inline-flex; align-items:center; gap:6px; color:var(--ink-mute); font-size:13.5px; }
.thinking span { width:5px; height:5px; border-radius:50%; background:currentColor;
  animation:bb 1.2s ease-in-out infinite; }
.thinking span:nth-child(2){ animation-delay:.15s }
.thinking span:nth-child(3){ animation-delay:.30s }
@keyframes bb { 0%,80%,100%{ opacity:.3; transform:translateY(0) }
                40%{ opacity:1; transform:translateY(-3px) } }
```

### 5.9 登录页 — 品牌区（`.brand-col`）

- 网格 1.15fr / 0.85fr，左大右小
- 背景叠层：
  - `bg-canvas`（MVP 静态：径向渐变 + dotted/grid mask）
  - `login-bg-vignette`：`radial-gradient(60% 50% at 22% 35%, accent 14%, transparent 70%)` 配 `mix-blend-mode: screen`
  - `login-bg-grid`：64x64px 双线性渐变网格 + radial mask
- 顶部：brand-mark（28x28 logo + 16/600 name）+ 右侧 lang chip（pill 边框，zh/en 两按钮）
- 中部：
  - `kicker`：mono 11.5px / letter-spacing 0.16em / 大写"OVERSEAS · INTELLIGENCE · AI" + 6x6 accent 脉冲 dot
  - `hero` 标题（双行，第二行带 hero-shine 流光动画）：clamp 40-64px / 700 / 1.05
  - `hero-sub`：15px / 1.7 / mute
  - `value-props`：3 列数字（28px / 700 / tnum）+ 标签（12.5px mute）
  - `intel-ticker`（**DEMO 示例条，规范见 5.9.1，必须显示，不可隐藏**）

#### 5.9.1 Intel ticker（DEMO 规范）

**目标**：让访客在登录前看到产品"实时情报"的能力示意，但**绝对不能让用户误以为是实时数据**——所以必须显式标 DEMO + 底部说明。

**容器**：
- 1px solid `--line` + radius 14px
- padding 14px 16px
- 背景：`linear-gradient(180deg, color-mix(in oklab, var(--accent) 4%, transparent), transparent)`
- `backdrop-filter: blur(8px)`

**顶部 meta 行**（替换原设计稿的 pulse dot + "实时情报" 文案——pulse dot **删除**，避免暗示"跳动 = 实时"）：

```
情报示例  ·  DEMO
```

- "情报示例"：10.5px / 500 / **大写** / letter-spacing 0.16em / `--ink-mute`
- "·"：`--ink-faint`
- "DEMO" badge：10.5px / 600 / `--accent` 文字色 + 1px solid `--accent` + radius 99px + padding `2px 8px`
- 整行底部 1px dashed `--line` 分隔（保留原设计稿的虚线）

**3 条静态示例条目**（写死，覆盖产品 3 个核心能力：情报 / 合规 / 财报）：

| tag | text | source |
|-----|------|--------|
| `[情报]` | 亚马逊宠物 Top 100 中国品牌占比同比 +12% | 来源 · Helium10 |
| `[合规]` | 加州 Prop 65 新增 3 项化学品（10/02） | 来源 · OEHHA |
| `[财报]` | Chewy Q3 Autoship 收入占比 80.3% | 来源 · SEC 10-Q |

**每条样式**：
- grid `auto 1fr auto`，gap 12px，align-items center
- 三条之间 12px 间距，每两条之间 1px solid `--line-soft` 分隔
- **不要原设计稿的 fade-in 动画**——静态展示
- tag：`--accent` / 11.5px / 600 / 方括号原样保留
- text：`--ink-2` / 13.5px / 1.5 / overflow-ellipsis
- source：`--ink-faint` / 11.5px / 500 / nowrap

**底部说明行**（紧贴 ticker 容器外部，作为承诺文案）：

```
以上为示例展示。登录后可基于你的品类实时查询。
```

- margin-top 16px
- 11.5px / 500 / `--ink-faint` / text-align: left（与 ticker 对齐）

### 5.10 登录页 — 表单卡片（`.auth-card`）

- 玻璃质感容器：`background: var(--card)` + `backdrop-filter: blur(20px) saturate(150%)`
- radius 20px，padding `36px 36px 28px`
- max-width 440px
- 顶部：(可选) trial-badge pill + `auth-title` 26px / 700 + `auth-sub` 13.5px mute
- 表单 field：
  - label：12px / 500 / mute / letter-spacing 0.02em
  - field-box：`--field` 背景 + 1px line + radius 10px + padding `0 12px`
  - input：透明 / 14px / padding `11px 0`
  - focus：accent 边框 45% + accent 18% 3px 环
  - 错误：red 边框 + red 15% 环
- 主按钮：accent 背景 + radius 10px + padding `13px 16px` + 14.5/600 + 主按钮阴影

---

## 6. 移动端断点（< 768px）

| 区域 | 桌面 | 移动 |
|------|------|------|
| 侧边栏 | 260px 固定 | 隐藏，左上角汉堡按钮（lucide `Menu`）打开 drawer，drawer 宽 260px 从左滑入，遮罩半透明黑 |
| 对话内容（wrap） | max-width 740px | max-width 100%，左右 padding 16px |
| 顶栏 | padding `10px 18px` | padding `10px 12px`，左侧第一个图标 = 汉堡 |
| Composer | radius 22px / padding `6 6 6 18` | radius 18px / padding `4 4 4 14`，textarea min-height 40px |
| Composer 工具按钮 | attach + globe + sparkle 三个 | 仅 sparkle 一个，其他折叠到加号下拉（MVP 内可全隐） |
| Welcome prompt-grid | 2 × 2 | 1 × 4，每张卡片占满宽，gap 8px |
| Welcome logo | 48 × 48 | 40 × 40 |
| Welcome h1 | 26px | 22px |
| 登录页 brand-col | 显示，1.15fr | **隐藏** |
| 登录页 auth-col | 0.85fr | 占满，padding `24px 16px` |
| 登录页 auth-card | max-width 440px | max-width 100%，padding `28px 24px 22px` |

**实现**：Tailwind 默认断点 `md:` = 768px，整体用 `md:` 开/关。drawer 用 `@radix-ui/react-dialog` 即可，避免再引入新库（项目里已经有 `@radix-ui/react-tooltip` 等，但没有 dialog，**新增依赖**：`@radix-ui/react-dialog`）。

---

## 7. Loading 状态

### 7.1 用户发送 → 立即占位

用户提交消息后**立刻**渲染：
1. 用户气泡（右对齐）正常显示
2. 紧接着 AI 消息位：`ai-head`（accent 头像 + "出海罗盘"）+ thinking 三点
3. **不**等 streamText 返回第一个 token 才显示——避免空白

实现：在 `chat-window` 的 `messages` 数组后追加一个 `placeholder` 节点条件渲染（`isLoading && messages.last.role === 'user'`），或读 useChat 的 `isLoading` 自己渲染 thinking 区块。

### 7.2 工具调用进行中 → 文字提示

useChat 在收到 tool call 时（`message.toolInvocations` 或 `data` 部分）显示 thinking 的同时**替换 thinking 文字**为工具状态：

| toolName | 显示文字 |
|----------|---------|
| `web_search` | 正在搜索网络… |
| `search_knowledge_base` | 正在查询知识库… |
| `save_user_context` | 正在记录你的信息… |
| 其他 / 默认 | 正在思考… |

样式：thinking 三点保留，左侧加文字（13.5px / `--ink-mute`），三点继续跳动。

---

## 8. 错误态

### 8.1 streamText 报错

useChat 的 `error` 字段不为 null 时，在最后一个 AI 占位区渲染：

- 灰色卡片背景：`--hover` 背景 + radius 12px + padding `12px 14px`
- 文字（13.5px / `--ink-mute`）："抱歉，回复出错了。" + error.message（如果 message 短可显示，超过 80 字截断 + 省略号）
- 右下角"重试"按钮：`RotateCw` 图标 + "重试" 文字，12.5px / 500 / `--ink`，hover bg `--hover`，点击调用 useChat 的 `reload()`

### 8.2 网络断开 / 401

- 401：清除 cookie，跳到 `/login`（middleware 会捕获）
- 网络断：显示 toast 或同上灰卡，文字"网络不可用，请检查后重试。"

### 8.3 工具调用失败

工具自身已捕获错误并返回 `{ error: ... }`，AI 会基于此自然回复"我没查到 X"，不需要特别 UI 处理。

---

## 9. 暗 / 亮模式策略

- 工作台用 CSS 变量 + `[data-theme="dark"]`（或 next-themes 注入的 `.dark` class）切换
- next-themes 当前是 `attribute="class"`，所以选择器用 `.dark` 包住 dark variant
- 登录页 dark 是默认，加 `[data-theme="light"]` 时切到白色（可选保留）
- 主按钮颜色：light = `#3B82F6`，dark = `#4F8EF7`（仅工作台；登录页统一 `#4F8EF7`）

---

## 10. 图标

参考 `workspace.html` 内的内联 SVG 集（`Icon` 函数），统一 stroke 1.7px、linecap/linejoin round。**实现时优先用 `lucide-react` 同义图标**（项目已有）：

| 设计稿名 | lucide 等价 |
|---------|-----------|
| plus | Plus |
| search | Search |
| side | PanelLeft |
| chev | ChevronDown |
| share | Share2 |
| dots | MoreHorizontal |
| attach | Paperclip |
| globe | Globe |
| sparkle | Sparkles |
| send | ArrowUp |
| copy | Copy |
| thumb | ThumbsUp |
| thumbd | ThumbsDown |
| refresh | RotateCw |

特殊：欢迎页 logo 与 AI 头像里的 Sparkle 用项目自带的 `lucide-react` 的 `Sparkles` 即可，颜色填充白色覆盖默认 stroke。

---

## 11. 未做（MVP 内不实现）

- 登录页背景动画（nodes / map / particles 三种 canvas）—— 用静态径向渐变 + 网格 mask 替代
- 登录页 intel-ticker 接真实数据 —— 静态 3 条 DEMO 数据（规范见 5.9.1，必须带 DEMO 标签 + 底部"示例展示"说明）
- Tweaks 面板（主色 / 语言 / 品牌名切换）
- 模型选择器下拉
- 分享 / 复制对话功能
- AI 消息的 thumb / refresh / share 实际逻辑（只渲染按钮）
- 对话历史的 DB 持久化（仍是 MOCK_HISTORY）

---

## 12. 实现备注

- Tailwind 仍是布局工具，但**所有颜色都走 CSS 变量**（在 `globals.css` 定义，`tailwind.config.ts` 通过 `colors.accent: 'var(--accent)'` 暴露给 utility）
- Google Fonts 在 `app/layout.tsx` `<head>` 加 preconnect + link
- `next-themes` 用 `attribute="class"` 不变，在 `globals.css` 用 `:root` + `.dark` 两套变量
- 现有 shadcn 的 `--background/--foreground/--border` 这些 token 不删，做 alias 指向新 token（避免一次性改全部组件的 className）
