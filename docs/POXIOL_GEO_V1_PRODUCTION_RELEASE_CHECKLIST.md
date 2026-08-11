# POXIOL GEO V1 Production Release Checklist

日期：2026-08-11
状态：**Ready for Final Production Approval — 等待最终发布确认**

## 发布控制

- [x] GEO V1 本地实施验收通过。
- [x] Preview Validation 完成。
- [x] 两个 Mobile P1 完成修复与复测。
- [x] 已知问题已由发布负责人接受。
- [x] 最终 Production Build 通过。
- [ ] 最终发布批准尚未收到。
- [ ] 未 commit。
- [ ] 未 push。
- [ ] 未 merge。
- [ ] 未创建 PR。
- [ ] 未发布 Production。

在收到明确的最终发布批准前，不执行任何 Git 集成或 Production 发布动作。

## GEO V1 发布范围

- GEO Entity 优化。
- Homepage GEO 模块。
- About GEO 模块与 Manufacturing Process。
- Product GEO 模板。
- Basketball FAQ 可见内容与 FAQPage Schema。
- Organization Schema。
- Canonical 优化。
- robots AI crawler 优化。
- Mobile About 裁切与 Homepage CTA 遮挡 P1 修复。

## Git Diff 摘要

- 仓库：`F:\codex\codex-test\poxiol-site`
- 分支：`main`
- 当前 HEAD：`7b3a5cdcab8f`
- 上游：`origin/main`
- Ahead/Behind：Git 状态未显示 ahead 或 behind。
- 已跟踪修改：11 个文件。
- 新增未跟踪文件：11 个文件（包含本 Checklist）。
- 发布工作区文件总数：22 个。
- 已跟踪 diff：59 insertions、55 deletions。
- `package-lock.json`：未修改。
- `next-env.d.ts`：Build 自动变化已恢复，不在发布 diff 中。
- `git diff --check`：PASS，仅有 Windows LF/CRLF 提示，无空白错误。

## 修改文件列表

### 已跟踪修改

- `app/about/page.tsx`
- `app/page.tsx`
- `app/products/[slug]/page.tsx`
- `components/cms/PageTemplate.tsx`
- `components/seo/GEOStructuredData.tsx`
- `components/sports/SportsLandingPage.tsx`
- `lib/buyer-decision.ts`
- `package.json`
- `public/robots.txt`
- `scripts/check-buyer-decision-clarity.test.mjs`
- `scripts/check-gsc-verification.test.mjs`

### 新增文件

- `components/sections/GeoV1Sections.tsx`
- `lib/geo-v1.ts`
- `scripts/check-geo-v1.test.mts`
- `scripts/check-geo-v1-output.mjs`
- `scripts/check-geo-v1-mobile-layout.test.mjs`
- `docs/superpowers/specs/2026-08-11-poxiol-geo-v1-design.md`
- `docs/superpowers/plans/2026-08-11-poxiol-geo-v1-implementation.md`
- `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md`
- `docs/POXIOL_GEO_V1_PREVIEW_VALIDATION_REPORT.md`
- `docs/POXIOL_GEO_V1_MOBILE_FIX_VALIDATION_REPORT.md`
- `docs/POXIOL_GEO_V1_PRODUCTION_RELEASE_CHECKLIST.md`

## Build 结果

命令：`npm run build`

结果：**PASS，退出码 0**。

- Next.js 15.5.21 编译成功。
- TypeScript 检查成功。
- 静态页面生成成功：139 个。
- Static export 成功。
- Solutions image integrity：PASS。
- GSC verification：PASS。
- Canonical 检查：PASS。

非阻塞警告：

- 仓库已有多处 `<img>` 优化提示。
- 本地 Sanity redirect 查询失败时，继续使用已有 1 条基础 redirect；没有导致 Build 失败。
- Node TypeScript strip-types 与 module type 提示不影响 Build 结果。

## 测试结果

### GEO 专项

- `npm run check:geo-v1`：PASS。
- `npm run check:geo-v1:output`：PASS。
- `node scripts/check-geo-v1-mobile-layout.test.mjs`：PASS。
- `node scripts/check-sitemap-output.mjs`：PASS。

### 完整 `npm test`

状态：**KNOWN FAILURE / ACCEPTED**。

GEO V1 及 ContactForm 之前执行的既有检查均通过，随后在已接受的 ContactForm 既有回归处停止：

```text
AssertionError: ContactForm must retain exactly three file inputs
actual: 0
expected: 3
```

该失败没有通过修改 ContactForm 或测试进行绕过。

## SEO 检查

Production Build 的 Canonical/H1 审计：

- Sitemap URLs：70。
- Audited URLs：71。
- Failures：0。
- Canonical path mismatches：0。
- Canonical missing：0。
- Canonical duplicates：0。
- Canonical targets missing：0。
- Non-home canonical to home：0。
- Sitemap/noindex conflicts：0。
- Shared canonical targets：0。
- Missing H1：0。
- Duplicate H1：0。

Canonical 域名统一为 `https://www.poxiol.com`。

robots 检查：

- GPTBot：Allow。
- PerplexityBot：Allow。
- ClaudeBot：Allow。
- Google-Extended：Allow。

## Schema 检查

构建产物专项测试确认：

- Homepage Organization：1 个，无重复。
- Homepage WebSite：1 个，保留成功。
- WebSite publisher 指向 `https://www.poxiol.com/#organization`。
- Organization：
  - `@id`: `https://www.poxiol.com/#organization`
  - `name`: `POXIOL`
  - `url`: `https://www.poxiol.com`
  - `description`: `Custom Teamwear Manufacturer specializing in basketball, soccer and multi-sport uniforms.`
  - `industry`: `Sportswear Manufacturing`
- Basketball 页面输出 FAQPage。
- 四个 GEO V1 优先 FAQ 同时存在于可见 HTML 与 FAQPage JSON-LD。
- JSON-LD 与可见内容使用共享数据源。

## AI 可读 HTML 检查

构建产物包含并通过检查：

- Homepage GEO H1。
- Who Is POXIOL Entity Definition。
- B2B Custom Teamwear Manufacturer。
- OEM / Private Label。
- Clubs / Schools / Teamwear Brands / Distributors。
- About Manufacturing Process 六个步骤。
- Product Overview。
- Technical Specifications。
- Recommended For。

核心事实位于服务端输出 HTML 中，不依赖客户端 JavaScript 才能读取。

## Mobile 验证

| 视口 | Homepage CTA 重叠 | 固定底栏 | About H1 | About 正文 | 横向溢出 | 结果 |
| --- | ---: | --- | --- | --- | --- | --- |
| 390 × 844 | 0px | 保留 | 完整 | 完整 | 无 | PASS |
| 375 × 812 | 0px | 保留 | 完整 | 完整 | 无 | PASS |
| 360 × 800 | 0px | 保留 | 完整 | 完整 | 无 | PASS |

Desktop 1440 × 1000 回归检查：

- Homepage H1 仍为 96px，双列布局保持。
- About H1 仍为 72px，双列布局保持。
- 无横向溢出或文字裁切。
- Desktop CTA 首屏位置未调整。

截图与详细数据见 `docs/POXIOL_GEO_V1_MOBILE_FIX_VALIDATION_REPORT.md`。

## 已知问题接受记录

### 1. ContactForm

- 分类：Existing Known Issue / Pre-existing Regression。
- 状态：接受，不阻塞 GEO V1 发布。
- 范围：不属于 GEO V1。
- 本次没有修改 ContactForm 或相关测试。

### 2. Desktop CTA

- 分类：P2 Conversion Optimization。
- 状态：接受，后续独立优化。
- 当前现象：1440 × 1000 下主 CTA 不在首屏。
- 本次没有调整 Desktop CTA。

### 3. Next.js 15 params warning

- 分类：Technical Debt。
- 状态：接受，后续独立处理。
- 当前现象：Preview 模式提示 `/products/[slug]` 应 await `params`。
- Production Build 当前通过。

## Production 发布判断

GEO V1 发布范围已完成检查，状态为：**Ready for Final Production Approval**。

已接受问题已记录，不作为本次 GEO V1 发布阻塞项。当前唯一待办是获得最终发布确认。在确认前，不执行 commit、push、merge、PR 或 Production 发布。
