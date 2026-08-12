# POXIOL V8 Design Specification

状态：待用户书面审核
日期：2026-08-11
批准方案：Option A — Shared V8 Data and Component System

## 1. 目标

把 POXIOL 从传统制造商信息网站升级为专业的 B2B custom teamwear 销售平台，同时保持 Next.js、Tailwind CSS、Sanity CMS、现有 URL、Canonical、Schema、GEO V1 和索引价值。

统一定位：

> POXIOL is a professional teamwear manufacturing partner helping clubs, schools and sports brands turn ideas into finished uniforms.

V8 必须在用户进入页面后快速回答：POXIOL 是谁、服务谁、如何降低采购风险、下一步做什么。

## 2. 非目标

- 不建设 B2C 电商、购物车、在线付款或库存系统。
- 不创建外部 CRM 或数据库。
- 不写入或发布 Sanity 内容。
- 不使用 AI 生成、库存、来源未知或未授权的生产视觉。
- 不创建 `/custom-basketball-uniform-manufacturer/` 或 `/production-process/`。
- 不在本任务中发布 Production。

## 3. 架构原则

1. 单一事实源：品牌、买家、流程、FAQ、CTA、Lead scoring 和媒体规则不得在页面中复制多个版本。
2. 配置优先：页面传递配置给共享组件，不为每个页面复制 JSX。
3. 安全媒体：只有验证过的资产才能渲染；缺失或未验证时使用中性占位。
4. SEO 稳定：保留现有主 URL、Canonical 和 Schema，只增加明确意图的买家页。
5. CMS 可接管：代码提供安全默认值，Sanity 可在未来逐步提供已审核媒体和页面覆盖值。
6. 渐进增强：没有 JavaScript、媒体或 CMS 请求失败时，关键身份、CTA 和联系方式仍可读。

## 4. 共享 V8 数据层

### 4.1 文件边界

```text
lib/v8/types.ts          共享类型
lib/v8/brand.ts          品牌定位、客户类型、CTA 和链接
lib/v8/processes.ts      设计、样品、生产、QC 和交付步骤
lib/v8/faqs.ts           FAQ 数据与页面过滤
lib/v8/pages.ts          首页、买家页和权威页配置
lib/v8/media.ts          媒体验证与占位解析
lib/v8/leads.ts          表单值、数量区间和 Lead classification
lib/v8/index.ts          对外稳定导出
```

`lib/geo-v1.ts` 继续作为已上线 GEO V1 的事实源。V8 引用 GEO V1 的 Organization、Canonical 和核心实体定义，不复制另一套公司事实。

### 4.2 核心类型

```ts
export type V8BuyerId = 'youth-teams' | 'schools' | 'clubs' | 'sports-brands' | 'distributors'

export type V8MediaKind = 'image' | 'video'
export type V8MediaStage =
  | 'factory-overview'
  | 'fabric-inspection'
  | 'printing'
  | 'cutting'
  | 'sewing'
  | 'production-workflow'
  | 'quality-inspection'
  | 'packing'

export type V8MediaAsset = {
  kind: V8MediaKind
  stage: V8MediaStage
  url?: string
  alt?: string
  caption?: string
  verified: boolean
}

export type V8FaqItem = {
  id: string
  question: string
  answer: string
  pages: string[]
  buyers?: V8BuyerId[]
}

export type V8Cta = {
  label: string
  href: '/free-mockup/' | '/get-quote/' | '/sample-order/' | '/contact/'
  intent: 'mockup' | 'quote' | 'sample' | 'contact'
}
```

### 4.3 稳定接口

```ts
getV8PageConfig(pageId: V8PageId): V8PageConfig
getV8Faqs(filter: {pageId: V8PageId; buyerId?: V8BuyerId}): V8FaqItem[]
resolveVerifiedMedia(asset?: V8MediaAsset): V8MediaAsset | null
classifyLead(input: ProjectQualificationInput): 'HIGH' | 'MEDIUM' | 'LOW'
```

`resolveVerifiedMedia` 仅在 `verified === true`、URL 存在、图片有 Alt Text 时返回媒体；其他情况返回 `null`。

## 5. 可复用组件

```text
components/v8/V8Hero.tsx
components/v8/CustomerSegmentation.tsx
components/v8/BuyerProblems.tsx
components/v8/SolutionCards.tsx
components/v8/DesignJourney.tsx
components/v8/ManufacturingTimeline.tsx
components/v8/ProductionProof.tsx
components/v8/SampleApproval.tsx
components/v8/QualityControl.tsx
components/v8/FAQSection.tsx
components/v8/FinalCTA.tsx
components/v8/ProjectQualificationForm.tsx
components/v8/VerifiedMediaPlaceholder.tsx
components/v8/V8BuyerLandingPage.tsx
components/v8/index.ts
```

### 5.1 组件规则

- 所有标题层级可配置，但每页只能有一个 H1。
- CTA 使用现有 `PrimaryButton` / `SecondaryButton` 视觉体系。
- 页面可通过配置选择模块和数据，不复制组件实现。
- FAQ 可视内容和 `FAQPage` JSON-LD 使用同一个数组。
- 流程步骤使用有序列表语义。
- 卡片、表单和导航满足键盘操作与可见焦点要求。
- 新视觉资产使用固定宽高比和响应式 `sizes`，避免布局跳动。

### 5.2 VerifiedMediaPlaceholder

无验证媒体时渲染：

```text
Verified production visual pending
```

占位包含媒体阶段标签，例如 `Printing` 或 `Quality inspection`，使用 `role="img"` 与描述性 `aria-label`。占位不输出虚构图片、视频封面或结构化媒体字段。

## 6. Sanity 媒体扩展

新增可选对象 `verifiedMediaAsset`：

- Media type：Image / Video
- Production stage
- Image
- Video file
- Alt text
- Caption
- Verification status
- Verification note

新增 `productionMediaSet`：

生产图片槽位：

- Fabric inspection
- Printing
- Cutting
- Sewing
- QC
- Packing

生产视频槽位：

- Factory overview
- Production workflow
- Quality inspection

Schema 扩展到 `sitePage` 和适用的 `pageSection`，但所有字段可选；本任务不上传文件、不写入 Dataset、不发布 Sanity。

前端查询只读取 `verified == true` 的资产；CMS 无内容时由代码占位接管。

## 7. 页面设计

### 7.1 Homepage

顺序：

1. `V8Hero`
2. `CustomerSegmentation`
3. `BuyerProblems`
4. `DesignJourney`
5. `ProductionProof`
6. `SolutionCards`
7. `FAQSection`
8. `FinalCTA`

Hero：

- H1：`Custom Teamwear Manufacturer For Clubs, Schools & Sports Brands`
- 主 CTA：`Get Free Mockup`
- 次 CTA：`Request Sample`
- 右侧只使用验证媒体或安全占位。

旧 Homepage 中重复的工厂、优势、流程和 CTA 模块不与 V8 同时重复显示；保留有独立价值的 GEO、指南和产品入口，并按销售路径重新排序。

### 7.2 Basketball

唯一主页面：`/products/basketball-uniforms/`

新增或重组：

- Basketball buyer problems
- Clubs / schools / youth / training / brands segmentation
- Logo / name / number / colors / fabric / packaging / labels
- Sample approval before bulk
- Manufacturing confidence
- QC risk reduction
- Shared basketball FAQ
- `Start Your Team Project` 与 `Request Sample`

继续使用现有 Product、Service、Breadcrumb 和 FAQ Schema，不创建第二个商业 URL。

### 7.3 Buyer Landing Pages

创建：

- `/youth-team-uniforms/`
- `/school-teamwear/`
- `/private-label-teamwear/`
- `/club-teamwear-program/`

四页使用同一个 `V8BuyerLandingPage`。页面只配置 buyer、痛点、解决方案、FAQ、Metadata 和 CTA。

### 7.4 Customization

`/customization/` 转换为设计入口：

```text
Idea / Logo / Reference → Mockup → Sample → Approved Production
```

页面嵌入 Project Qualification Form，并将默认 intent 设为 `mockup`。

### 7.5 Factory

`/factory/` 只回答：POXIOL 是谁、服务哪些客户、覆盖哪些运动品类、有哪些制造能力、为什么值得进入下一步。详细生产步骤链接到 `/manufacturing/`，不重复流程正文。

### 7.6 Manufacturing

`/manufacturing/` 成为生产流程权威页面：

1. Design preparation
2. Material selection
3. Printing process
4. Cutting
5. Sewing
6. Assembly
7. Inspection preparation
8. Packing

同时展示 Production timeline、Custom workflow、Sample-to-bulk 和 `Start Your Team Project`。

### 7.7 Quality Control

`/quality-control-process/` 专注：

1. Incoming material checks
2. Printing inspection
3. Sewing inspection
4. Size checking
5. Final inspection
6. Packing verification

CTA：`Request Sample`。

## 8. Project Qualification Form

### 8.1 字段

- Role
- Sport
- Quantity
- Deadline
- Customization requirements
- Logo upload
- Reference design upload
- Size chart / tech pack upload
- WhatsApp
- Email

保留必要的姓名、团队/公司、国家和来源页面字段。

### 8.2 Intent

同一组件支持：

- mockup
- quote
- sample
- contact

页面通过 props 提供标题、说明、按钮、成功页和默认 intent。

### 8.3 Lead classification

```text
HIGH   = 50+ sets + clear deadline + at least one design asset
MEDIUM = 10–49 sets + clear inquiry
LOW    = research stage, quantity below 10, or insufficient project detail
```

`leadPriority`、`intent`、`sourcePage` 和 UTM 数据作为 Formspree metadata 提交。分类不显示为对客户的评分，不写入数据库。

附件限制：接受 AI、EPS、PDF、PNG、JPG/JPEG、WebP；每个文件不超过 Formspree 当前支持范围。客户端提供清晰错误信息，最终大小限制以已配置 Formspree 计划为准。

## 9. URL、Redirect 与内部链接

### 9.1 301

`public/_redirects` 新增：

```text
/custom-basketball-uniforms/ /products/basketball-uniforms/ 301
```

构建输出必须验证实际 Cloudflare Pages 重定向文件包含该规则。旧 React 跳转页可继续作为非 Cloudflare 环境的安全 fallback，但不能作为 301 的唯一实现。

### 9.2 链路

```text
Homepage → Factory → Manufacturing → Quality Control → Inquiry
Product → Manufacturing → Quality Control → Request Sample
```

所有篮球商业 CTA 指向 `/products/basketball-uniforms/`。信息型文章继续保留自己的 URL。

## 10. SEO、GEO 与 Schema

- 保持现有 Organization 和 WebSite Schema 唯一。
- 每页一个 H1、一个 Canonical。
- Buyer Pages 使用 `Service` + `BreadcrumbList`；只有可见 FAQ 存在时输出 `FAQPage`。
- Manufacturing 与 QC 使用 `Service`、Breadcrumb 和同源 FAQ。
- 不在 Product Schema 中增加未经确认的价格、评价、库存或媒体。
- 新页面加入 Sitemap；301 源 URL 不加入 Sitemap。
- Breadcrumb 与页面实际层级一致。
- Metadata 针对不同 buyer/process 意图编写，不复制篮球主关键词。

## 11. 错误与降级

- Sanity 请求失败：使用代码 V8 数据与现有 CMS fallback。
- 媒体缺失或未验证：显示安全占位。
- Formspree endpoint 缺失或请求失败：显示 Email 与 WhatsApp fallback，不丢失已输入字段。
- JavaScript 禁用：页面显示联系信息和项目准备清单。
- 文件不合规：阻止提交并指明具体文件问题。

## 12. 可访问性、移动端与性能

- 验证 390×844、375×812、360×800。
- 首屏必须显示身份、主要利益和主 CTA。
- Sticky CTA 不遮挡 Hero CTA、表单按钮或页尾内容。
- 所有输入有可见 Label、错误关联和键盘焦点。
- FAQ 使用 `<details>` 或等价可访问控件。
- 保持无横向滚动，表格使用局部滚动容器。
- 新图片控制尺寸、格式、`sizes` 和懒加载；Hero 验证图才允许 priority。

## 13. 测试设计

新增：

- `scripts/check-v8-architecture.test.mjs`
- `scripts/check-v8-urls.test.mjs`
- `scripts/check-v8-lead-qualification.test.mts`
- `scripts/check-v8-output.mjs`
- `scripts/check-v8-mobile-layout.test.mjs`
- `scripts/check-v8-accessibility.test.mjs`

覆盖：

- 共享数据存在且页面不复制核心事实
- 301、Canonical、Sitemap 和内部链接
- 篮球页唯一商业意图
- 媒体验证和占位规则
- FAQ 可见内容与 Schema 同源
- 表单字段、三个附件、Formspree metadata 和 Lead classification
- 页面职责与内部链接
- H1、Metadata、Breadcrumb 和 Schema
- 三个移动端视口、横向溢出和 CTA 可见性

## 14. 分支、提交与发布边界

- 工作分支：`feature/poxiol-v8-growth-upgrade`
- 每个可独立审阅的任务形成单独 commit。
- 不 force push、不修改 Git 历史。
- 不发布 Production、不写入 CMS、不修改数据库。
- 完成后先提供 Preview Validation、Architecture Summary、Changed Files、SEO/Conversion Impact 和测试结果，再等待合并与发布批准。

## 15. 已解决的设计决策

- 使用 Option A 共享数据与组件系统。
- 不创建新的篮球制造商 URL。
- `/custom-basketball-uniforms/` 使用 301 指向篮球主页面。
- 不创建 `/production-process/`；升级 `/manufacturing/`。
- 不使用未验证生产视觉。
- 缺少真实媒体时使用统一占位。
- 无外部 CRM/数据库，仅提交 Formspree metadata。
