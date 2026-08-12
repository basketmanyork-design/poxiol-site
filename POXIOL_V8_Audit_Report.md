# POXIOL V8 Website Audit Report

日期：2026-08-11
审计基线：`main` / `17c258dd5c1569cbee7c6177bcc0da9ed3fe755d`
网站：`https://www.poxiol.com/`

## 1. 审计结论

POXIOL 已具备完整的产品、工厂、定制、资源、FAQ、询价和 GEO V1 基础，但当前结构更像“制造能力资料库”，还不是一条清晰的 B2B 销售路径。V8 应保留现有 URL、Canonical、Schema、Sanity 和 GEO V1 资产，通过共享数据与组件把页面重组为：识别买家 → 解释风险 → 展示解决方案 → 说明设计/样品/生产/QC → 提交合格询盘。

本次审计确认：

- 关键公开页面均返回 HTTP 200，每页只有一个 H1，并已有 Canonical。
- `/products/basketball-uniforms/` 已是 “Custom Basketball Uniform Manufacturer” 的唯一主商业页。
- `/custom-basketball-uniforms/` 当前是 `noindex` + Canonical + 浏览器端跳转，并不是真正的 HTTP 301。
- `/factory/`、`/manufacturing/`、`/quality-control-process/` 已有独立 URL，但页面职责仍需进一步区分。
- Homepage 已有 GEO V1 实体、客户类型、产品、信任、FAQ 和 CTA，但模块数量多、信息层级重复，首要转化路径不够集中。
- `ContactForm` 缺少现有测试要求的三个附件字段；这也是当前全量测试的已知失败。
- 生产视觉中存在来源或真实性无法确认的图片；V8 不应继续把这些素材当作制造证据。
- 页面大量使用原生 `<img>`，部分图片超过 1 MB，当前没有 `next/image` 使用记录。
- 源码与历史文档中存在异常编码残留，可能影响用户信任和可读性。

## 2. SEO/GEO 保护资产

以下资产必须保持：

- 正式域名：`https://www.poxiol.com`
- Organization：`https://www.poxiol.com/#organization`
- Homepage WebSite Schema
- 现有产品、文章、资源和指南 URL
- `/products/basketball-uniforms/` 的 Canonical、Schema 和主关键词意图
- `/factory/`、`/manufacturing/`、`/quality-control-process/` 的现有索引价值
- Sitemap 中已公开且非 `noindex` 的页面
- GPTBot、PerplexityBot、ClaudeBot、Google-Extended 的 robots 规则
- Sanity 字段与当前 fallback 能力

## 3. 页面审计

| 页面 | 当前用途 | 转化问题 | SEO 风险 | GEO 机会 | UX 问题 | 优先级 |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage `/` | 品牌、产品、工厂能力和询盘入口集合 | 模块过多且 CTA 语义不统一；买家问题、设计旅程和生产证明未形成连续漏斗 | 新增模块若直接复制已有内容会造成页面内部重复 | 用共享事实解释 POXIOL、买家、流程、风险控制和下一步 | 页面很长；移动端需要持续保证 CTA 不被底栏遮挡 | P0 |
| Basketball `/products/basketball-uniforms/` | 核心篮球商业落地页 | 内容丰富但缺少一条从买家问题到样品/QC/CTA 的统一故事线 | 与任何新篮球制造商商业页存在关键词互相竞争风险 | 将 FAQ、买家问题、定制、样品、生产和 QC 使用同一数据源 | 模块多，需建立清晰锚点与 CTA 节奏 | P0 |
| Products `/products/` | 产品分类入口 | 更接近产品目录，缺少按买家目标选择的入口 | 与 Solutions 内容部分重叠 | 从产品分类导向买家解决方案和制造流程 | 卡片以产品为中心，不够突出适用对象 | P1 |
| Customization `/customization/` | 说明定制能力 | 目前没有设计需求收集和明确转化路径 | 标题与内容可继续保留定制主题，不宜复制产品页 | 解释 Idea → Logo/Reference → Mockup → Sample | 无上传入口，无逐步设计体验 | P0 |
| Factory `/factory/` | 工厂与制造能力介绍 | 公司身份、能力和信任理由不够集中 | 与 Manufacturing 容易重复 | 回答“POXIOL 是谁、能制造什么、为什么可信” | 视觉真实性边界不清 | P1 |
| Manufacturing `/manufacturing/` | OEM/ODM 制造概览 | 没有完整、易扫描的生产时间线 | 与 Factory/QC 重复风险 | 成为唯一的生产流程权威页 | 真实媒体不足，应使用安全占位 | P0 |
| QC `/quality-control-process/` | 质量检查说明 | 检查点较少，缺少样品与批量生产风险说明 | 应避免复述完整生产流程 | 回答“如何确保质量”，支持产品页引用 | 缺少分阶段 QC 与 Request Sample CTA | P0 |
| About `/about/` | 品牌实体和制造商定义 | 已完成 GEO V1，可作为稳定身份页 | V8 不应覆盖或复制 Factory 全部内容 | 继续强化实体一致性 | 无主要阻塞问题 | P2 |
| Resources `/resources/` | 内容与采购指南入口 | 指南到商业页的 CTA 不够统一 | 篮球文章链接若分散会稀释主页面 | 信息型内容统一指向对应商业页 | 分类较多，需更明确的下一步 | P1 |
| FAQ `/faq/` | 全站采购问答 | 缺少与买家阶段和产品页的明确连接 | 页面 FAQ 与各页 Schema 必须保持同源 | 可按 buyer/product/process 过滤共享 FAQ | 长页面需要分组导航 | P1 |
| Contact `/contact/` | 通用询盘 | 表单缺少角色、运动、截止日期、WhatsApp 和附件 | 无直接 SEO 风险，但提交失败会损害转化 | 将结构化需求作为 AI/销售可读事实 | 已知附件回归；静态 HTML 主要依赖客户端表单 | P0 |
| Get Quote `/get-quote/` | 报价询盘 | 与 Contact 使用同一表单但没有场景化字段默认值 | 不应新建重复报价页 | 统一 qualification metadata | 表单字段不足 | P0 |
| Free Mockup `/free-mockup/` | 设计 Mockup 询盘 | 现有独立 `FreeMockupForm` 未被页面使用，入口实际复用 `ContactForm` | 两套表单数据模型容易漂移 | 统一表单，通过 `intent` 区分 Mockup/Quote/Sample | 缺少直接 Logo/Reference 上传 | P0 |
| Solutions `/solutions/` | 多类买家和产品解决方案 | 单页聚合，缺少专门的青年队、学校、俱乐部和品牌转化页 | 与未来买家页需要严格区分搜索意图 | 作为总入口链接到四个专用买家页 | 部分卡片没有验证视觉 | P1 |

## 4. URL 与内容重叠审计

### 篮球

- 主页面：`/products/basketball-uniforms/`
- 旧页面：`/custom-basketball-uniforms/`
- 当前旧页面行为：客户端 `router.replace()`，并非 HTTP 301
- V8 决策：主页面保持唯一；旧 URL 使用 Cloudflare Pages 301；不创建 `/custom-basketball-uniform-manufacturer/`

### 制造

- `/factory/`：公司身份、能力、品类、工厂概览和选择理由
- `/manufacturing/`：设计准备到包装的完整生产流程
- `/quality-control-process/`：来料、印花、缝制、尺寸、终检和包装验证
- V8 决策：不创建 `/production-process/`

### 买家页

以下页面在当前静态路由中不存在，可使用清晰且互不冲突的受众意图：

- `/youth-team-uniforms/`
- `/school-teamwear/`
- `/private-label-teamwear/`
- `/club-teamwear-program/`

## 5. 表单与线索审计

当前 `ContactForm` 包含姓名、Email、公司、国家、产品、数量和留言，但缺少：

- Role
- Sport
- Deadline
- Customization requirements 的结构化字段
- WhatsApp
- Logo、Reference Design、Size Chart / Tech Pack 三个附件
- Lead classification metadata

`scripts/check-public-inquiry-integrity.mjs` 已要求三个附件和 Formspree FormData 合约，但当前实现缺失，因此该测试失败。V8 应通过真实恢复表单能力解决，而不是放宽测试。

## 6. 媒体与性能审计

### 真实性

仓库内部分人物、机器和工厂视觉无法从代码证明来源与授权，不得作为 V8 生产证据。V8 统一使用可验证媒体模型：只有 `verified=true` 且具备 Alt Text 的媒体才可公开渲染；否则显示 `Verified production visual pending`。

### 待准备媒体

生产图片：

- Fabric inspection
- Printing
- Cutting
- Sewing
- QC
- Packing

生产视频：

- Factory overview
- Production workflow
- Quality inspection

### 性能

- 多个 PNG/WebP 文件为 1.6–2.3 MB。
- 页面普遍使用原生 `<img>`，缺少统一的尺寸、加载优先级与响应式策略。
- V8 新组件应优先使用 `next/image` 或明确 `width`、`height`、`loading` 和 `sizes`，但不得无范围地重写所有旧页面。

## 7. 内部链接目标

主链路：

```text
Homepage → Factory → Manufacturing → Quality Control → Inquiry
```

产品链路：

```text
Product → Manufacturing → Quality Control → Request Sample
```

篮球商业链接统一指向：

```text
/products/basketball-uniforms/
```

信息型资源保留原 URL，通过 CTA 和上下文链接指向对应商业页。

## 8. 优先级排序

### P0：必须先完成

1. URL、301、Canonical、Sitemap 和链接守卫测试
2. 共享 V8 数据、FAQ、CTA、媒体槽位和 Lead qualification
3. Project Qualification Form 与三个附件恢复
4. Homepage 漏斗
5. Basketball 主落地页
6. Manufacturing 与 QC 权威页面
7. 三个移动端视口和 Build 验证

### P1：同一 V8 发布包完成

1. 四个 Buyer Landing Pages
2. Customization 设计转化页
3. Factory 页面职责收敛
4. Products、Solutions、Resources 和 Guides 内链统一
5. Schema、Breadcrumb 和 Metadata 调整

### P2：不阻塞 V8

1. 全站旧图片的完整 `next/image` 迁移
2. 全量历史文档编码清理
3. 真实视频与照片接入
4. 外部 CRM 或数据库

## 9. 审计后的实施边界

- 仅在功能分支工作。
- 不修改 Production、Cloudflare 项目设置、CMS 数据或数据库。
- 可扩展 Sanity Schema 和查询，但不发布或写入内容。
- 不使用未验证视觉。
- 不创建已否决的重复 URL。
- 所有共享事实必须来自 V8 数据层或已有 GEO/CMS 事实源。
