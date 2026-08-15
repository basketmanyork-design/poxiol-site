# POXIOL Legacy Content Governance V1 Report

- 基线：`main` / `2348ea74974383d4ed3f11f62806e6f8ac1ebf14`
- 实施分支：`feature/legacy-content-governance-v1`
- 审计日期：2026-08-15
- 性质：内容治理；无视觉、URL、Canonical、Sitemap、V8、Formspree 或媒体安全门架构变更

## 1. 范围与结果

原只读清单包含 47 个 URL，另有 4 个格式变体候选。本次从源码、CMS 回退数据、生成 HTML、metadata、FAQ、JSON-LD、资源索引和 AI/GEO 输出重新扫描，最终确认 75 个受影响 URL：P0 5 个、P1 24 个、P2 46 个。与预计 51 个相比，新增发现 24 个 URL。

基线源码扫描覆盖源码、`geo` 发现文件和 `public` 静态 AI 文件，其中 30 个文件包含 141 处受管控表述：MOQ 61、单件样品 8、样品周期 33、生产周期 11、Mockup/响应周期 6、运输周期 10、经营规模 12。`guaranteed delivery` 的唯一额外源码命中来自 Studio 验证规则的负面测试文本，不是公开内容，因此未计入 141 处。

生成页面基线采用两次独立构建扫描并取并集：一次包含完整 CMS 缓存/回退数据，确认 63 个 URL；另一次从干净 `main` 构建并使用扩展规则，补充 12 个 PSEO 别名 URL，合计 75 个页面 URL；另治理 2 个公开 AI JSON 端点：`/brand.json`、`/ai-summary.json`。治理后源码命中为 0，169 页静态输出中的 HTML、RSC 序列化内容、JSON-LD、静态 JSON 和 `llms.txt` 命中为 0。

## 2. 表述代码与安全替换

| 代码 | 原表述家族 | 安全替换口径 |
|---|---|---|
| M | `MOQ 1`、`MOQ: 1 set`、`from 1 piece` 等 | Order quantity is confirmed according to the product format, customization and project requirements. |
| O | `1 set sample`、`1-Set Sample` 等 | Sample quantity is confirmed for the specific product and project. |
| S | `sample 2-3/3-5/5-7/7-10 days` 等 | Sample availability and timing are confirmed after the design, materials and project requirements are reviewed. |
| P | `production 3-5/7-12/10-20 days` 等 | Production scheduling is confirmed after quantity, sizes, customization and approvals are defined. |
| K | `within 2 hours`、`2h mockup`、固定响应时间等 | A mockup can be prepared after the project brief, logo, colors and reference files are received. |
| D | 固定运输天数 | Shipping method, freight assumptions and delivery timing are confirmed for the destination and project requirements. |
| H | 年限、团队数、员工数、厂房、机器或产能数字 | 改为职责、能力、项目规划和工艺范围等不含未经核实数字的事实表达。 |

基线中实际命中的写法包括：

- M：`MOQ 1`、`MOQ 1 set`、`MOQ: 1 set`、`1 set MOQ`、`1-set MOQ`、`minimum order 1 set`、`from 1 piece`。
- O：`1 set sample`、`1-piece custom jersey sample`、`1-Set Sample Production`。
- S：`sample 2-3 days`、`2-3 working days`，以及 `3-5`、`5-7`、`7-10 days` 的历史样品周期写法和破折号变体。
- P：`production 3-5 days`、`7-12 working days`、`10-20 days` 及其破折号、大小写和空格变体。
- K：`within 2 hours`、`1-2 hours`、`within 24 hours`、`Free Mockup in 2h`、`response within 1 business day`。
- D：`3-5`、`3-6`、`3-7`、`4-6`、`4-7 business days` 与 shipping/delivery/courier 连用的固定运输周期。
- H：`15+ years`、`over 20 years`、`3,000+/5,000+ teams`、`over 500 academies`、`30,000+ units monthly`、`50+ countries` 等未经仓库证据支持的规模数字。

## 3. 逐 URL 治理记录

说明：`CMS` 表示 Sanity 内容在 `lib/sanity/content.ts` 公共输出映射处治理；`PSEO` 表示 `lib/pseo.ts`；`Direct` 表示对应 `app/**/page.tsx` 或共享本地数据。`同源` 表示可见 FAQ 和 FAQPage JSON-LD 继续读取同一份已治理数据。所有 75 个 URL 的 SEO 意图均保留为 **YES**。

### P0：商业 / 高购买意图（5）

| URL | 类型 / 搜索意图 | 原表述 | 替换 | 来源位置 | Metadata | Schema | Canonical / Sitemap | SEO 意图 |
|---|---|---|---|---|---|---|---|---|
| `/products/hoodies-jackets/` | 商业；定制卫衣夹克 | S/O | S/O 安全口径 | CMS 产品与采购字段 | 否 | 同源 | 保留 / 是 | YES |
| `/products/soccer-jerseys/` | 商业；定制足球服 | S | S 安全口径 | CMS 产品、FAQ 与采购字段 | 否 | 同源 | 保留 / 是 | YES |
| `/products/team-accessories/` | 商业；队服配件 | S/O | S/O 安全口径 | CMS 产品与采购字段 | 否 | 同源 | 保留 / 是 | YES |
| `/products/training-wear/` | 商业；训练服 | S/O | S/O 安全口径 | CMS 产品与采购字段 | 否 | 同源 | 保留 / 是 | YES |
| `/oem-odm/` | 商业；品牌 OEM/ODM | M | M 安全口径 | Direct `app/oem-odm/page.tsx` | 否 | 否 | 保留 / 是 | YES |

### P1：Guide / Resource / FAQ（24）

| URL | 类型 / 搜索意图 | 原表述 | 替换 | 来源位置 | Metadata | Schema | Canonical / Sitemap | SEO 意图 |
|---|---|---|---|---|---|---|---|---|
| `/guides/b2b-sourcing-faq/` | Guide；B2B 采购判断 | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/guides/basketball-uniform-size-guide/` | Guide；篮球尺码 | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/guides/custom-teamwear-manufacturer-buying-guide/` | Guide；制造商选择 | M | M 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/guides/how-to-choose-teamwear-manufacturer-china/` | Guide；中国供应商选择 | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/guides/private-label-teamwear-manufacturing/` | Guide；Private Label | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/guides/sublimation-printing-guide/` | Guide；热升华工艺 | M/S | M/S 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/guides/teamwear-sample-approval-checklist/` | Guide；样品审核 | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/resources/custom-teamwear-moq-production-time/` | Resource；数量和排期 | M/S/P | M/S/P 安全口径 | CMS Article/table | 否 | 同源 | 保留 / 是 | YES |
| `/resources/private-label-teamwear-launch-checklist/` | Resource；品牌上线清单 | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/resources/sports-uniform-fabric-guide/` | Resource；面料选择 | M/S | M/S 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/resources/teamwear-manufacturer-evaluation-checklist/` | Resource；供应商评估 | M/S/P | M/S/P 安全口径 | CMS Article/FAQ | 否 | 同源 | 保留 / 是 | YES |
| `/faq/` | FAQ；通用采购问答 | M/O/S/D | M/O/S/D 安全口径 | CMS + `lib/faq.ts`/`lib/b2b-faq.ts` | 否 | 同源 | 保留 / 是 | YES |
| `/guides/how-to-order-custom-basketball-uniforms/` | Guide；篮球订购流程 | M/S/P/D | M/S/P/D 安全口径 | CMS Article/table | 否 | 同源 | 保留 / 是 | YES |
| `/guides/school-basketball-uniform-order-checklist/` | Guide；学校订购清单 | S | S 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/guides/teamwear-quality-control-checklist/` | Guide；质量检查 | M/S | M/S 安全口径 | CMS Article/table | 否 | 同源 | 保留 / 是 | YES |
| `/ai-summary/` | AI/GEO；实体摘要 | M/S/P | M/S/P 安全口径 | Direct `app/ai-summary/page.tsx` + shared schema | 是 | 是 | 原状态无 / 否 | YES |
| `/guides/how-to-choose-a-custom-soccer-kit-manufacturer/` | Guide；足球服供应商选择 | M | M 安全口径 | Direct page | 否 | 否 | 原状态无 / 否 | YES |
| `/guides/how-to-order-custom-basketball-uniforms-for-your-team/` | Guide；篮球订购流程 | M | M 安全口径 | Direct page | 否 | 否 | 原状态无 / 否 | YES |
| `/guides/moq-1-custom-teamwear-how-it-works/` | Guide；订单数量说明 | M | M 安全口径 | Direct page | 是；仅该页标题与描述去除固定 MOQ | 否 | 原状态无 / 否 | YES |
| `/guides/oem-odm-sportswear-manufacturing-guide-for-brands/` | Guide；品牌制造 | M | M 安全口径 | Direct page | 否 | 否 | 原状态无 / 否 | YES |
| `/guides/sublimation-vs-screen-printing-for-custom-teamwear/` | Guide；印花工艺比较 | M | M 安全口径 | Direct page | 否 | 否 | 原状态无 / 否 | YES |
| `/projects/` | Resource index；项目案例入口 | M | M 安全口径 | shared CMS/resource listing | 否 | 否 | 保留 / 否 | YES |
| `/resources/` | Resource index；资源入口 | M | M 安全口径 | `lib/resources-data.ts` + CMS excerpt mapping | 否 | 否 | 保留 / 是 | YES |
| `/shipping-after-sales/` | Resource；运输售后 | P/D | P/D 安全口径 | Direct `app/shipping-after-sales/page.tsx` | 否 | 否 | 保留 / 是 | YES |

### P2：Blog / Article / Secondary Product（46）

| URL | 类型 / 搜索意图 | 原表述 | 替换 | 来源位置 | Metadata | Schema | Canonical / Sitemap | SEO 意图 |
|---|---|---|---|---|---|---|---|---|
| `/blog/best-sportswear-fabrics/` | Blog；面料比较 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-baseball-jerseys-for-clubs/` | Blog；俱乐部棒球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-basketball-jerseys-melbourne/` | Blog；墨尔本篮球服 | M/S/D | M/S/D 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-basketball-uniforms-for-schools/` | Blog；学校篮球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-soccer-kits-london/` | Blog；伦敦足球服 | M/S/D | M/S/D 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-soccer-uniforms-for-academies/` | Blog；学院足球服 | M/S/H | M/S/H 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-sports-apparel-distributor/` | Blog；分销商采购 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-teamwear-new-york/` | Blog；纽约队服 | M/S/D | M/S/D 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/custom-volleyball-uniforms-for-schools/` | Blog；学校排球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/how-sublimation-printing-works-for-teamwear/` | Blog；热升华说明 | M/S/H | M/S/H 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/how-to-choose-a-teamwear-manufacturer/` | Blog；供应商选择 | M/S/H | M/S/H 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/oem-baseball-apparel-manufacturer/` | Blog；OEM 棒球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/oem-basketball-apparel-manufacturer/` | Blog；OEM 篮球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/oem-soccer-apparel-manufacturer/` | Blog；OEM 足球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/oem-volleyball-apparel-manufacturer/` | Blog；OEM 排球服 | M/S/P | M/S/P 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/oem-vs-odm-sportswear/` | Blog；OEM/ODM 比较 | M/S/H | M/S/H 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/soccer-jersey-supplier-australia/` | Blog；澳洲足球供应 | M/S/D | M/S/D 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/soccer-teamwear-supplier-uk/` | Blog；英国足球供应 | M/S/D | M/S/D 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/soccer-teamwear-supplier-usa/` | Blog；美国足球供应 | M/S/D | M/S/D 安全口径 | CMS Article | 否 | 同源 | 保留 / 是 | YES |
| `/blog/soccer-jersey-buying-guide/` | Blog；足球服采购 | M/O/S | M/O/S 安全口径 | CMS Article/table | 否 | 同源 | 保留 / 是 | YES |
| `/products/hoodies-jackets-1/` | 次级产品；套头卫衣 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/hoodies-jackets-2/` | 次级产品；拉链夹克 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/hoodies-jackets-3/` | 次级产品；抓绒外套 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/pro-basketball-jersey-set/` | 次级产品；篮球套装 | M | M 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/team-accessories-1/` | 次级产品；队袜 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/team-accessories-2/` | 次级产品；定制包 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/team-accessories-custom-bags/` | 次级产品；历史定制包 | M/S | M/S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/team-accessories-team-socks/` | 次级产品；历史队袜 | M/S | M/S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/training-wear-1/` | 次级产品；运动套装 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/training-wear-2/` | 次级产品；热身夹克 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/training-wear-3/` | 次级产品；训练上衣 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/products/training-wear-4/` | 次级产品；旅行套装 | S | S 安全口径 | CMS Product | 否 | 同源 | 保留 / 否 | YES |
| `/custom-basketball-uniforms-for-schools/` | PSEO；学校篮球服 | P | P 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/how-to-order-custom-basketball-uniforms/` | PSEO；篮球订购流程 | P/H | P/H 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/custom-baseball-jerseys-for-clubs/` | PSEO；俱乐部棒球服 | M/O | M/O 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/custom-basketball-jerseys-melbourne/` | PSEO；墨尔本篮球服 | D | D 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/custom-soccer-kits-london/` | PSEO；伦敦足球服 | D | D 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/custom-soccer-uniforms-for-academies/` | PSEO；学院足球服 | H | H 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/custom-teamwear-new-york/` | PSEO；纽约队服 | D | D 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/how-sublimation-printing-works-for-teamwear/` | PSEO；热升华说明 | H | H 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/how-to-choose-a-teamwear-manufacturer/` | PSEO；供应商选择 | H | H 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/oem-vs-odm-sportswear/` | PSEO；OEM/ODM 比较 | H | H 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/soccer-jersey-buying-guide/` | PSEO；足球服采购 | M/O | M/O 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/soccer-jersey-supplier-australia/` | PSEO；澳洲足球供应 | D | D 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/soccer-teamwear-supplier-uk/` | PSEO；英国足球供应 | D | D 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |
| `/soccer-teamwear-supplier-usa/` | PSEO；美国足球供应 | D | D 安全口径 | PSEO | 否 | 同源 | 保留 / 是 | YES |

## 4. Metadata、Schema 与 AI/GEO

- Metadata：只改含不安全固定表述的描述。`/guides/moq-1-custom-teamwear-how-it-works/` 的 title、H1 和 description 必须同步去掉固定 MOQ，因此改为“Custom Teamwear Order Quantities”；URL 保持不变。其他页面的 title/H1 保持。
- Schema：未改 Schema 类型或组织结构。`components/seo/StructuredData.tsx`、`lib/seo-data.ts` 以及 CMS/PSEO 的 FAQ 数据先治理再同时供可见 FAQ 与 FAQPage 使用，避免两套文案漂移。
- AI/GEO：`/ai-summary/`、`/brand.json`、`/ai-summary.json`、`geo/ai-search-question-map.csv`、`geo/geo-content-checklist.md`、资源摘要、文章摘要和 `llms.txt` 均纳入扫描；治理后无受管控固定承诺。`/ai-summary/` 的 3 条可见 FAQ 与 FAQPage JSON-LD 改为同一数组生成；CSV 中篮球链接统一到 `/products/basketball-uniforms/`。
- Certification：没有发现真实公开的未经支持认证声明。最初的 `WRAP` 命中来自 CSS `flex-wrap`/`overflow-wrap` 的大小写误判，规则改为大小写敏感认证 token 后确认 0 个真实命中。
- Guarantee：没有公开输出保留保证性承诺。测试或说明中的否定语境不作为公开承诺处理。

## 5. SEO 与结构保护

- 75/75 个审计 URL 均成功生成 HTML。
- 既有 Canonical 和 Sitemap 策略未改：69 个 URL 具有既有 Canonical，57 个在 Sitemap；6 个历史独立 Guide/AI 页面原本无 Canonical，18 个历史/次级页面原本不在 Sitemap，本次保持原状。
- Canonical failures 0；canonical path mismatches 0；missing H1 0；duplicate H1 0；sitemap/noindex conflicts 0；duplicate routes 0。
- `/products/basketball-uniforms/` 的唯一篮球商业页角色与 `/custom-basketball-uniforms/` 301 均未改。
- V8、Product Visualization、Real Production Proof、Verified Media Gate、Formspree 和视觉组件均未改。

## 6. Release Guard

新增 `scripts/legacy-claim-policy.mts` 和 `scripts/check-legacy-content-governance.test.mts`，并把源码检查纳入 `npm test`、把生成输出检查纳入 `npm run build`。规则覆盖短横线/破折号、大小写、空格和常见编码变体，并包含：

- 不安全 fixture 必须 FAIL：固定 MOQ、单件样品、固定样品/生产/Mockup/运输周期、经营规模、保证性承诺、认证 token。
- 安全 fixture 必须 PASS：按产品、设计、数量、尺码、目的地和项目要求确认的表述。
- 同时扫描源文件、生成 HTML、去标签可见文本、RSC/JSON-LD 和 `llms.txt`。

## 7. B2B 买家复核

| 问题 | 结论 |
|---|---|
| 数量政策是否清楚？ | 是。说明需提供产品、预计数量和定制要求，再按项目确认。 |
| 样品规划是否清楚？ | 是。说明设计、材料、结构和当前项目要求会影响样品。 |
| 生产排期是否清楚？ | 是。说明数量、尺码、定制和审批状态会影响排期。 |
| 运输政策是否清楚？ | 是。说明目的地、运输方式、运费假设和项目要求会影响交付。 |
| 文案是否可信而非回避？ | 是。没有承诺未经证实的数字，同时明确买家需要提交什么信息。 |
| 是否减少有用信息？ | 否。保留订购步骤、尺码、设计文件、样品审核、生产审批、QC 和运输准备信息。 |

## 8. 已知限制与发布边界

- 本地无法证明 Google 实际是否收录单个 URL；报告中的 Sitemap/Canonical 状态只反映构建输出。
- 6 个历史独立 Guide/AI URL 原本没有 Canonical，18 个历史/次级 URL 原本不在 Sitemap；这是既有架构状态，本任务未扩大范围处理。
- CMS 中未来新增内容仍需遵守相同治理规则；当前公共映射和 CI 输出扫描会对已知表述 fail closed。
- 本报告不批准 Merge 或 Production 发布；仅用于本分支 Preview 和 PR 审核。
