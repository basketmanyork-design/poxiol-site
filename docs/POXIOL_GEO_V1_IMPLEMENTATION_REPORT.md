# POXIOL GEO V1 Implementation Report

日期：2026-08-11

## 实施状态

POXIOL GEO V1 已按“共享 GEO 数据 + 页面安全覆盖”方案完成本地实施。所有改动仅保存在本地工作区；未 commit、未 push、未创建 PR、未发布 Production，也未修改远端仓库或 Git 历史。

## GEO 数据结构

统一事实数据位于 `lib/geo-v1.ts`，页面和 Schema 不再分别维护不同版本的核心 GEO 文案。数据分为以下部分：

- `canonical`：统一正式域名 `https://www.poxiol.com`。
- `organization`：Organization 的 `@id`、名称、网址、描述和行业。
- `homepage`：Hero 标题、副标题、Who Is POXIOL 和 Who We Help 四类客户。
- `about`：About 首屏安全覆盖文案和六步 Manufacturing Process。
- `product`：Product Overview、Technical Specifications、推荐对象和缺失字段的事实型回退文本。
- `faq.basketball`：篮球页显示 FAQ 与 FAQPage JSON-LD 共用的四组问答。

同时提供纯函数解析层：

- `applyAboutGeoV1`：覆盖 About 首屏 GEO 信息并保留原 Sanity 数据和其它页面结构。
- `buildCmsProductGeoDetails`：优先读取 CMS 产品的 `fabric`、`printing`、`sizeRange` 和 `procurementOverride`。
- `buildSportsProductGeoDetails`：为运动分类模板生成同一结构的产品信息。
- `mergeGeoFaqs` / `resolveSportsFaqs`：把共享篮球 FAQ 作为优先数据，并复用到页面显示和 Schema。

任何无法由已有字段确认的信息统一显示 `Confirmed during project consultation`，不编造产品参数。

## 页面改动

### Homepage

- Hero H1 改为 `Custom Teamwear Manufacturer for Basketball, Soccer & Multi-Sport Teams`。
- Hero Subtitle 改为批准的 OEM、客户类型、灵活 MOQ 和质量控制表述。
- 新增 Who Is POXIOL。
- 新增 Who We Help，并展示 Youth Teams、Schools & Academies、Sports Brands、Distributors 四张卡片。
- 保留原 Hero 布局、CTA 和视觉结构。

### About

- Sanity 字段和已有页面区块继续保留。
- 首屏通过本地解析层优先显示明确的 B2B custom teamwear manufacturer 实体定义。
- 明确服务 Clubs、Schools、Teamwear Brands、Distributors，并说明 OEM / Private Label capability 和 custom production process。
- 使用现有 `processSteps` 渲染逻辑接入六步 Manufacturing Process：Design Confirmation、Sample Development、Material Preparation、Production、Quality Inspection、International Shipping。

选择覆盖位置的原因：在 Sanity 查询完成后、组件渲染前统一合并 GEO 数据，可以保证公开页面立即使用准确内容，同时不删除 CMS 字段，也不破坏将来由 Sanity 接管的能力。

### Product Templates

- 通用产品模板和运动分类模板均接入共享 `ProductGeoSections` 组件。
- 增加 Product Overview：Product Type、Application、Customization、Production Type、Suitable For。
- 增加 Technical Specifications：Fabric、Printing Technology、Customization Options、Available Sizes、MOQ、Production Type。
- 优先使用已有字段；缺失信息使用事实型咨询确认提示。

## FAQ 改动

- 建立共享篮球 FAQ 数据，包含批准的四个问题。
- 篮球页可见 FAQ 与 `FAQPage` JSON-LD 读取同一个 `resolvedFaqs` 数组。
- 合并时按问题去重，避免共享 FAQ 与 CMS FAQ 重复显示。

## Schema 改动

- 保留现有 WebSite Schema。
- 页面图中只保留一个 Organization 节点，不创建重复 Organization。
- Organization 使用：
  - `@id`: `https://www.poxiol.com/#organization`
  - `name`: `POXIOL`
  - `url`: `https://www.poxiol.com`
  - `description`: `Custom Teamwear Manufacturer specializing in basketball, soccer and multi-sport uniforms.`
  - `industry`: `Sportswear Manufacturing`
- 没有增加无法确认的组织字段。
- `robots.txt` 保留 GPTBot、PerplexityBot、ClaudeBot，并补充 Google-Extended。

## 测试优先实施记录

先增加 GEO V1 验证，再修改业务代码：

1. Runtime 测试首次运行因 `lib/geo-v1.ts` 尚不存在而失败，证明测试能识别缺失共享数据源。
2. Rendered-output 测试首次运行因首页缺少批准的 GEO H1 而失败，证明测试能识别公开输出缺口。
3. 完成共享数据、页面、FAQ 和 Schema 接入后，两组 GEO 测试均通过。

GEO V1 新增测试覆盖：

- Homepage GEO Entity 文案。
- About GEO 文案与 Manufacturing Process。
- Product Template 字段、已有字段优先级和缺失值回退。
- FAQ 可见内容与 FAQPage Schema 的同源一致性。
- Organization 唯一性、字段和值。
- Canonical Domain。
- robots AI crawler。

## 测试环境修复

- 为直接加载 TypeScript 的既有 Node 测试命令增加 `--experimental-strip-types`，解决 Node 22 的 `.ts` 加载兼容问题；没有修改业务逻辑。
- 更新首页标题检查，使其验证当前共享 GEO 数据引用和批准的 H1，而不是继续断言旧标题；这是需求变化后的真实断言更新，不是绕过失败。
- GSC verification 测试在精确比较前只统一 CRLF/LF，避免 Windows 检出换行造成假失败；文件名、内容和安全目的均保持不变。

## 验证结果

| 检查 | 结果 | 说明 |
| --- | --- | --- |
| `npm run check:geo-v1` | PASS | 共享数据、解析器、页面接线、FAQ、Schema、robots 源码检查通过 |
| `npm run check:geo-v1:output` | PASS | 公开构建输出中的首页、About、产品、FAQ、Schema、Canonical 和 robots 检查通过 |
| `npm run check:basketball-decision-page` | PASS | 篮球决策页检查通过 |
| `npm run check:canonical` | PASS | 71 个审计 URL；Canonical 缺失、重复、路径错误、目标缺失均为 0；H1 缺失和重复均为 0 |
| `node scripts/check-sitemap-output.mjs` | PASS | Sitemap 输出完整，共 70 个 URL |
| Analytics core/integration | PASS | 既有 Analytics 检查通过 |
| CMS safety | PASS | 既有 CMS 安全检查通过 |
| `git diff --check` | PASS | 没有空白错误，仅有 Windows 换行提示 |
| `npm run build` | PASS | Next.js 编译、类型检查和静态导出成功，共生成 120 个页面 |
| `npm test` | KNOWN FAILURE | GEO V1 及其之前执行的既有检查通过；流程在 ContactForm 既有失败处停止 |

Build 中仍出现仓库原有的 `<img>` 优化警告。Sanity redirect 查询在本地构建环境失败时沿用项目既有降级逻辑，只使用基础 redirects；两项都没有导致 Build 失败。

## Existing Known Issue / Pre-existing Regression

`ContactForm` 完整性测试仍失败：

```text
AssertionError: ContactForm must retain exactly three file inputs
actual: 0
expected: 3
```

该问题在 GEO V1 实施前已存在，不属于本次 GEO V1 修改范围。本次没有修改 ContactForm 代码，也没有修改相关测试来绕过失败。因此，全量 `npm test` 不能报告为全绿；GEO V1 专项测试和 Build 状态不受该问题影响。

## npm ci 结果

- 按 `package-lock.json` 安装 662 个锁定依赖，并审计 663 个包。
- `package-lock.json` SHA256 在安装前后保持 `6F87DE9524DF0DD5B501C1E29D50A951788691F968C1902835C628C6BBC1C4B6`，未被修改。
- `node_modules` 已被 Git 忽略。
- npm 报告 10 个依赖漏洞（2 moderate、8 high）；本次未运行会改动依赖版本的 `npm audit fix`。

## 修改文件列表

业务与共享数据：

- `lib/geo-v1.ts`（新增）
- `lib/buyer-decision.ts`
- `components/sections/GeoV1Sections.tsx`（新增）
- `app/page.tsx`
- `app/about/page.tsx`
- `app/products/[slug]/page.tsx`
- `components/sports/SportsLandingPage.tsx`
- `components/seo/GEOStructuredData.tsx`
- `public/robots.txt`

测试与命令：

- `scripts/check-geo-v1.test.mts`（新增）
- `scripts/check-geo-v1-output.mjs`（新增）
- `scripts/check-buyer-decision-clarity.test.mjs`
- `scripts/check-gsc-verification.test.mjs`
- `package.json`

文档：

- `docs/superpowers/specs/2026-08-11-poxiol-geo-v1-design.md`（新增）
- `docs/superpowers/plans/2026-08-11-poxiol-geo-v1-implementation.md`（新增）
- `docs/POXIOL_GEO_V1_IMPLEMENTATION_REPORT.md`（新增）

## 后续建议

1. 在单独任务中修复 ContactForm 的三项上传能力和 Formspree attachment 逻辑，再恢复全量测试为绿色；不要把这项修复混入 GEO V1。
2. 将已审核的 GEO 字段逐步同步到 Sanity schema/content，建立内容发布校验后再考虑移除本地安全覆盖。
3. 单独审计 npm 报告的依赖漏洞，评估升级影响后再更新锁文件。
4. 单独检查未使用的 `LocalBusinessSchema` 中地址等字段是否仍有业务依据；当前公开页面没有输出该 Schema，本次没有扩大修改范围。

## GEO V1 完成状态

GEO V1：完成。共享数据、页面覆盖、产品模板、FAQ、Organization、robots、Canonical/H1/Sitemap 与 Build 均已验证通过。唯一阻止全量 `npm test` 全绿的是已明确保留的 ContactForm 既有回归。
