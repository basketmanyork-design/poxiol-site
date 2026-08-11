# POXIOL GEO V1 Mobile Fix Validation Report

日期：2026-08-11

## 结论

本次批准的两个 Mobile P1 问题已完成修复，并在 390 × 844、375 × 812、360 × 800 三个手机视口通过真实 Preview 验证。

- Homepage 主 CTA 与固定底栏的重叠量在三个视口均为 0px。
- About 标题与正文在三个视口均完整落在内容区内。
- 三个视口均无页面级横向溢出。
- 固定底栏继续保留。
- GEO 文案、Schema、SEO 与 Canonical 未修改，原始 HTML 检查继续通过。
- Desktop 使用原有字号和双列布局，没有被手机端修复影响。

## 修改文件

- `app/page.tsx`
- `components/cms/PageTemplate.tsx`
- `scripts/check-geo-v1-mobile-layout.test.mjs`（新增回归检查）
- `docs/POXIOL_GEO_V1_MOBILE_FIX_VALIDATION_REPORT.md`（本报告）

本次没有修改 `lib/geo-v1.ts`、Schema、SEO、ContactForm、Next 动态路由参数处理或 Desktop CTA 位置。

## 根因与修复方式

### 1. Mobile About 首屏右侧裁切

根因：About Hero 的 Grid 在手机端使用隐式 `auto` 列。长标题和长 CTA 的最小内容宽度把 Grid track 撑到约 402px，而 390、375、360 视口对应的实际内容宽度只有 335、320、305px。父级 Section 使用 `overflow-hidden`，因此超出的标题和正文被裁掉。

修复：

- 显式增加 `grid-cols-1`，使手机端 Grid 使用可收缩的一列。
- Hero 内容容器增加 `min-w-0`。
- H1 增加 `break-words`，手机字号调整为 `text-4xl`；`md:text-7xl` 保持不变。
- About CTA 在手机端改为纵向排列并拉伸到容器宽度；`sm` 以上恢复横向布局。
- 没有修改、缩短或隐藏任何 GEO 文案。

### 2. Mobile Homepage 主 CTA 被固定底栏遮挡

根因：固定底栏高度约 81px。修复前主 CTA 底部固定在约 784.6px，在三个视口分别与固定底栏重叠约 21.6px、53.6px、64px。同时 Hero Grid 也受到最小内容宽度影响。

修复：

- 显式增加 `grid-cols-1`，Hero 内容容器增加 `min-w-0`。
- H1 增加 `break-words`，手机字号使用 `text-4xl`；`md:text-8xl` 保持不变。
- 只压缩手机端 Eyebrow、Description、CTA Group 的垂直间距。
- `md` 和 `lg` 断点继续使用原有间距与字号。
- 没有隐藏主 CTA，也没有删除或缩小固定底栏。

## 测试优先记录

先新增 `scripts/check-geo-v1-mobile-layout.test.mjs`，首次执行按预期失败：

```text
AssertionError: About hero must constrain the mobile grid to one minmax(0, 1fr) column
MOBILE_LAYOUT_TEST_EXIT=1
```

完成最小 CSS 修改后，同一测试通过：

```text
POXIOL GEO V1 mobile layout source checks passed
```

## 三个移动端视口结果

| 视口 | Homepage 主 CTA | 固定底栏 | CTA 重叠 | 横向溢出 | About H1 | About 正文 | GEO HTML |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 390 × 844 | 完整可见，底部 631.4px | 顶部 763px，继续保留 | 0px | 无 | 完整，宽 335px | 完整，宽 335px | PASS |
| 375 × 812 | 完整可见，底部 631.4px | 顶部 731px，继续保留 | 0px | 无 | 完整，宽 320px | 完整，宽 320px | PASS |
| 360 × 800 | 完整可见，底部 631.4px | 顶部 719px，继续保留 | 0px | 无 | 完整，宽 305px | 完整，宽 305px | PASS |

### 390 × 844

![390x844 Homepage](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-mobile-fix/390x844-homepage.png)

![390x844 About](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-mobile-fix/390x844-about.png)

### 375 × 812

![375x812 Homepage](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-mobile-fix/375x812-homepage.png)

![375x812 About](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-mobile-fix/375x812-about.png)

### 360 × 800

![360x800 Homepage](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-mobile-fix/360x800-homepage.png)

![360x800 About](C:/Users/Administrator/.codex/visualizations/2026/08/11/019ff016-2e71-7ae2-a044-0ab3bdee1998/poxiol-geo-v1-mobile-fix/360x800-about.png)

## Desktop 回归检查

1440 × 1000 验证结果：

- Homepage H1 仍为 96px，Hero 仍为双列，页面无横向溢出。
- About H1 仍为 72px，Hero 仍为双列，标题和正文没有裁切。
- 按执行限制，没有调整 Desktop CTA 首屏位置。

## GEO HTML 与 Schema 保持检查

Preview 原始 HTML 继续包含：

- Homepage GEO H1。
- Who Is POXIOL Entity Definition。
- About 精确 B2B custom teamwear manufacturer 定义。
- OEM、Private Label、Clubs、Schools、Teamwear Brands、Distributors。
- Organization `https://www.poxiol.com/#organization`。
- Basketball FAQPage。

结果：全部 PASS。CSS 修复没有改变 GEO 数据、Schema 或 SEO 输出。

## 自动验证结果

| 检查 | 结果 |
| --- | --- |
| `node scripts/check-geo-v1-mobile-layout.test.mjs` | PASS |
| `npm run check:geo-v1` | PASS |
| `npm run check:geo-v1:output` | PASS |
| `npm run build` | PASS，编译、类型检查和 139 个静态页面生成成功 |
| Canonical / H1 | PASS，71 个 URL，0 个失败；H1 缺失和重复均为 0 |
| Sitemap | PASS，70 个 URL |
| `git diff --check` | PASS |

Build 仍显示仓库已有的 `<img>` 优化警告；本地 Sanity redirect 查询失败时继续使用已有基础 redirect 降级逻辑。这两项没有导致 Build 失败。

## 明确保留的非本次范围问题

- Desktop CTA 首屏位置 P2：未处理。
- Next.js 15 `params.slug` Preview 警告 P2：未处理。
- ContactForm 已知回归：未处理，也没有修改相关测试。

## Production Ready 判断

**本次 Mobile GEO V1 P1 修复范围：Production Ready。**

两个获批 P1 问题均已在三个目标视口通过，GEO HTML、Schema、SEO、Desktop 布局和 Build 均保持正常。

**整站 Production 发布：条件通过。** 发布负责人仍需明确接受或另行处理已知的 ContactForm 回归、Desktop CTA P2 和 Next.js 15 params P2。本任务没有发布 Production。
