# POXIOL GEO V1 Preview Validation Report

日期：2026-08-11

## 验证范围

- 本地 Preview：`http://127.0.0.1:3100`
- Desktop：1440 × 1000
- Mobile：390 × 844
- 页面：首页、About、通用产品详情、篮球产品分类页
- 验证方式：浏览器截图、浏览器 DOM 布局数据、无 JavaScript 原始 HTML 响应、JSON-LD 解析
- 限制：未修改业务代码，未 commit、未 push、未创建 PR、未发布 Production

## Desktop 截图检查

### Homepage Hero

- Hero H1、Subtitle、主视觉和原 CTA 均正常显示。
- 页面没有横向溢出。
- H1 可见文本为 `CUSTOM TEAMWEAR MANUFACTURER FOR BASKETBALL, SOCCER & MULTI-SPORT TEAMS`。
- 发现：在 1440 × 1000 视口下，主 CTA 顶部约为 1188px，不在第一个可视屏幕内。

![Desktop Homepage Hero](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/desktop-homepage-hero.png)

### Who Is POXIOL

- 标题、Entity Definition 标签和两张说明卡正常显示。
- 实体定义文案清晰可读。

![Desktop Who Is POXIOL](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/desktop-homepage-geo-sections.png)

### Who We Help

- Youth Teams、Schools & Academies、Sports Brands、Distributors 四张卡片同排显示。
- 卡片间距、文字对比度和标题层级正常。

![Desktop Who We Help](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/desktop-who-we-help.png)

### About GEO Section

- 首屏显示 B2B Custom Teamwear Manufacturer 定义。
- Clubs、Schools、Teamwear Brands、Distributors、OEM 和 Private Label 均可读。
- Hero 在 Desktop 没有裁切或横向溢出。

![Desktop About GEO](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/desktop-about-geo.png)

### Manufacturing Process

- 六个流程步骤全部显示。
- Desktop 使用四列首行、两列第二行，没有重叠或裁切。

![Desktop Manufacturing Process](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/desktop-about-manufacturing-process.png)

### Product GEO Sections

- Product Overview、Technical Specifications、Recommended For 均存在。
- 指定字段全部存在，缺失参数使用 `Confirmed during project consultation`。
- 五列 Overview 卡片在 Desktop 正常显示。

![Desktop Product GEO](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/desktop-product-geo-sections.png)

## Mobile 截图检查

### Homepage 首屏与 CTA

- H1 字号 44px、行高约 41.8px，可读且没有横向滚动。
- Hero 区域总高度约 1600px，主要内容纵向较长。
- 主 CTA 位于 720.6px 至 784.6px。
- 固定底栏位于 763px 至 844px，遮挡主 CTA 约 21.6px。
- 第二个 CTA 从 820.6px 开始，首屏仅部分进入可视区域。

![Mobile Homepage Hero](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/mobile-homepage-hero.png)

### Who Is POXIOL / Who We Help

- Who Is POXIOL 内容按单列显示。
- 四张客户卡在手机端按单列堆叠，卡片宽度约 335px，无横向溢出。
- 固定底栏会覆盖当前视口底部约 81px，但页面仍可继续滚动。

![Mobile Who We Help](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/mobile-who-we-help-cards.png)

### About GEO Section

- 实体文案、客户类型、OEM 和 Private Label 均存在于 DOM。
- 发现严重可读性问题：外层内容区宽约 335px，但内部 Grid track 被长标题撑到约 402px；外层 Section 使用 `overflow-hidden`，导致 H1 和正文右侧被裁切。
- H1 右边界约 422px，实际页面内容右边界约 375px。

![Mobile About GEO clipping](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/mobile-about-geo.png)

### Manufacturing Process / Product GEO

- Manufacturing Process 六张卡片按单列堆叠，宽度约 335px，正文可读。
- Product Overview 和 Technical Specifications 按单列显示，没有页面级横向溢出。

![Mobile Manufacturing Process](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/mobile-about-manufacturing-process.png)

![Mobile Product GEO](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-preview/mobile-product-geo-sections.png)

## AI 可读 HTML 检查

直接读取 Preview 返回的原始 HTML，不依赖浏览器执行 JavaScript，以下内容全部存在：

| 检查项 | 结果 |
| --- | --- |
| Homepage `Who Is POXIOL?` Entity Definition | PASS |
| Homepage GEO H1 | PASS |
| B2B custom sportswear/teamwear manufacturer | PASS |
| About 精确实体定义 | PASS |
| OEM | PASS |
| Private Label | PASS |
| Clubs | PASS |
| Schools | PASS |
| Teamwear Brands | PASS |
| Distributors | PASS |
| Product Overview | PASS |
| Technical Specifications | PASS |
| Basketball FAQ 问题 | PASS |

结论：核心 GEO 事实已经位于服务端输出的 HTML 中，AI 抓取器不需要运行客户端 JavaScript即可读取。

## Schema 检查

### Homepage

- JSON-LD script：3 个。
- Organization：1 个，没有重复。
- WebSite：1 个，保留成功。
- WebSite publisher 指向 `https://www.poxiol.com/#organization`。
- Organization 字段：
  - `@id`: `https://www.poxiol.com/#organization`
  - `name`: `POXIOL`
  - `url`: `https://www.poxiol.com`
  - `description`: `Custom Teamwear Manufacturer specializing in basketball, soccer and multi-sport uniforms.`
  - `industry`: `Sportswear Manufacturing`
- Canonical：`https://www.poxiol.com/`

### Basketball Product Category

- URL：`/products/basketball-uniforms/`
- FAQPage：1 个。
- 四个 GEO V1 优先问题同时存在于可见页面和 FAQPage Schema。
- 页面同时保留 3 个已有 FAQ，共输出 7 个 FAQ 问题。
- Canonical：`https://www.poxiol.com/products/basketball-uniforms/`

## 发现问题

### P1 — Mobile About 首屏右侧裁切

长 H1 把 Grid track 撑宽到约 402px，超过 335px 内容区；父 Section 的 `overflow-hidden` 将标题和正文右侧裁掉。影响首屏实体定义的移动端可读性。

### P1 — Mobile Homepage 主 CTA 被固定底栏遮挡

390 × 844 下，主 CTA 与 81px 高固定底栏重叠约 21.6px。用户首屏看到的主 CTA 不完整，可能影响点击和转化。

### P2 — Desktop Homepage CTA 不在首屏

1440 × 1000 下，主 CTA 顶部约为 1188px。Hero 标题和内容过高，首屏不能看到主行动按钮。

### P2 — Next Dev 动态路由警告

Preview 控制台报告 `/products/[slug]` 同步读取 `params.slug`，Next.js 15 建议先 await `params`。Production Build 当前仍通过，但建议作为单独兼容性修复处理。

### 已知非 GEO 问题

ContactForm 的三个文件上传框既有回归仍不属于本次 Preview Validation 范围，本阶段没有修改 ContactForm 或相关测试。

## 是否建议进入 Production 发布

当前不建议进入 Production。

原因不是 GEO 数据或 Schema 错误；AI 可读 HTML、Organization、FAQPage 和 Canonical 均验证通过。阻塞项是两个 Mobile P1 视觉问题：About 首屏文字裁切，以及 Homepage 主 CTA 被固定底栏遮挡。

建议先在单独修复任务中解决 P1 问题，并重新执行 390 × 844、375 × 812 和 360 × 800 三个手机视口的 Preview Validation。P1 通过后，再评估 Desktop CTA 首屏位置和 Next 动态路由警告，最后进入 Production 发布审批。
