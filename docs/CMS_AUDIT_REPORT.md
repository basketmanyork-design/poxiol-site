# POXIOL CMS 迁移审计报告
## 生成时间: 2026-07-16
## 开发分支: feature/sanity-cms-admin
## 初始 Commit: 6d78801

---

## 一、技术栈现状

| 项目 | 当前值 |
|------|--------|
| Next.js | 14.2.5 |
| React | 18.2.0 |
| TypeScript | 5.4.5 |
| Tailwind CSS | 3.4.4 |
| 输出模式 | `output: "export"` (Static Export) |
| 图片优化 | `images: { unoptimized: true }` |
| 运行时依赖 | 13 packages (无 Sanity) |
| 部署平台 | Cloudflare Pages |
| 代码托管 | GitHub: basketmanyork-design/poxiol-site |
| Production Branch | main |

---

## 二、路由结构 (57个页面入口)

### 核心页面 (静态路由)
```
/                         首页
/about/                   关于
/contact/                 联系
/factory/                 工厂
/manufacturing/           制造中心
/customization/           定制页面
/quality-control-process/ QC流程
/certificates-testing/    证书与测试
/design-gallery/          设计画廊
/solutions/               解决方案
/products/                产品列表
/free-mockup/             免费打样
/sample-order/            样品订单
/get-quote/               获取报价
/oem-odm/                 OEM/ODM
/faq/                     FAQ中心
/resources/               资源中心
/fabric-guide/            面料指南
/printing-guide/          印花指南
/ai-summary/              AI摘要
/builder/                 构建器
/projects/                项目案例
/sports/                  运动分类
/guides/                  指南总览
/guide/[slug]/            指南详情 (4个核心指南)
/guides/b2b-sourcing-faq/ B2B采购FAQ
/products/basketball-uniforms/ 篮球
/products/soccer-jerseys/      足球
/products/training-wear/       训练服
/products/hoodies-jackets/     帽衫
/products/team-accessories/    配件
/projects/[slug]/              案例详情 (5个)
/resources/[slug]/             资源详情 (PSEO, 15个)
/[slug]/                        动态路由
```

### 自定义运动页 (静态)
```
/custom-basketball-uniforms/
/custom-soccer-kits/
/custom-baseball-softball-uniforms/
/custom-american-football-uniforms/
/custom-training-wear/
/custom-volleyball-uniforms/
/custom-ice-hockey-jerseys/
/custom-tennis-wear/
/custom-golf-wear/
/custom-rugby-uniforms/
/custom-running-marathon-wear/
/custom-esports-jerseys/
```

---

## 三、硬编码内容数据源 (13个文件)

| 文件 | 职责 | 数据量 | CMS迁移优先级 |
|------|------|--------|-------------|
| `lib/home-data.ts` | 首页: 体育分类(12)、USP卡片(6)、FAQ(7)、工厂统计(6) | 31条 | 🔴 高 |
| `lib/faq.ts` | 全站FAQ: 6个分类+32条FAQ | 32条 | 🔴 高 |
| `lib/b2b-faq.ts` | B2B技术FAQ: 3个分类+9条FAQ | 9条 | 🔴 高 |
| `lib/guides-data.ts` | 4个核心采购指南 | 4篇 | 🔴 高 |
| `lib/guides.ts` | 3个普通购买指南 | 3篇 | 🟡 中 |
| `lib/sports-pages.ts` | 5个运动品类页 | 5页 | 🔴 高 |
| `lib/pseo.ts` | 18个PSEO/资源文章 | 18篇 | 🟡 中 |
| `lib/case-studies.ts` | 5个客户案例 | 5个 | 🔴 高 |
| `lib/resources-data.ts` | 9个资源文章 | 9篇 | 🟡 中 |
| `lib/seo-data.ts` | SEO/Schema硬编码 | 多项 | 🔴 高 |
| `lib/contact-data.ts` | 联系信息 | - | 🟡 中 |
| `lib/fabrics.ts` | 面料数据 | - | 🟢 低 |
| `lib/free-mockup-data.ts` | 免费打样数据 | - | 🟡 中 |

### 硬编码关键参数
- **WhatsApp号码**: `"https://wa.me/8613055646888"` (components/ui.tsx:7)
- **公开邮箱**: `york@basketman.cn` (分散在多个页面)
- **CTAHref**: `/free-mockup/`, `/get-quote/`, `/sample-order/` (components/ui.tsx:4-6)

---

## 四、现有数据量统计

| 数据类型 | 数量 |
|----------|------|
| 产品分类 (Sports Categories) | 12 |
| 产品品类 (Sports Pages) | 5 (篮球、足球、训练服、帽衫、配件) |
| 客户案例 (Case Studies) | 5 |
| FAQ (全站) | 32 |
| B2B FAQ | 9 |
| 指南 (Guides) | 7 (4核心+3普通) |
| 博客/SEO文章 (PSEO+Resources) | 27 |
| 作者 | 1 (York) |

---

## 五、表单和询盘系统

| 项目 | 当前实现 |
|------|----------|
| 表单组件 | `ContactForm.tsx` (Formspree) |
| FreeMockup表单 | `FreeMockupForm.tsx` (Formspree) |
| 表单端点 | `NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT` (环境变量) |
| OKKI CRM | `tfile.xiaoman.cn/okki/analyze.js` |
| 询盘追踪 | Formspree → OKKI (双系统) |

---

## 六、Schema生成

| Schema类型 | 生成位置 |
|------------|----------|
| Organization | `components/seo/GEOStructuredData.tsx` |
| FAQPage | `components/seo/StructuredData.tsx` (generateFaqSchema) |
| Product | `components/seo/GEOStructuredData.tsx` |
| Service | `components/seo/GEOStructuredData.tsx` |
| BreadcrumbList | `components/seo/GEOStructuredData.tsx` |
| Article | `app/guides/[slug]/page.tsx` (内联) |

---

## 七、CMS迁移风险矩阵

| 风险 | 等级 | 缓解措施 |
|------|------|----------|
| URL丢失导致404 | 🔴 高 | Slug严格保持一致，旧URL保留301 |
| SEO字段丢失 | 🔴 高 | 逐页对比迁移前后的Title/Meta/H1/Canonical |
| 图片Alt丢失 | 🔴 高 | 迁移脚本保留原始Alt，增加CMS校验 |
| Schema不一致 | 🟡 中 | 统一从结构化字段生成，不手写JSON-LD |
| 表单失效 | 🔴 高 | 保留Formspree现有逻辑，仅将配置项CMS化 |
| Performance下降 | 🟡 中 | Sanity图片走CDN+响应式URL，保持体积控制 |
| 构建失败 | 🔴 高 | staging先验证，配置CI fallback |
| 数据冲突 | 🟡 中 | 分阶段替换，硬编码文件标记deprecated后保留 |

---

## 八、当前URL清单 (核心可索引页面)

```
/
/products/basketball-uniforms/
/products/soccer-jerseys/
/products/training-wear/
/products/hoodies-jackets/
/products/team-accessories/
/factory/
/manufacturing/
/quality-control-process/
/certificates-testing/
/customization/
/about/
/contact/
/free-mockup/
/sample-order/
/get-quote/
/oem-odm/
/faq/
/fabric-guide/
/printing-guide/
/solutions/
/products/
/guides/
/guides/teamwear-sample-approval-checklist/
/guides/custom-basketball-uniform-fabric-gsm/
/guides/how-to-choose-teamwear-manufacturer-china/
/guides/private-label-teamwear-manufacturing/
/guides/b2b-sourcing-faq/
/projects/ (5 cases)
/resources/ (15 articles)
/design-gallery/
/sports/
```

---

## 九、现状总结

**已确认的硬编码数据源**: 13个 `.ts` 文件，包含约 130+ 条结构化内容数据。

**当前无 CMS**: 所有内容修改需要通过代码编辑 + Git Push + Cloudflare 部署。

**迁移规模**: 预计需迁移约 130+ 条文档到 Sanity Content Lake，涉及 10+ 个 Schema 类型。
