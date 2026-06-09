# POXIOL V6 网站图片素材使用说明

## 1. 使用原则

这些图片不是普通图库图，而是用于替换 POXIOL 独立站中存在版权风险、B2B 信任不足、工厂感不足的页面视觉。

使用时请遵守：

- 不要再叠加 Nike、Adidas、NBA、职业球队、国家队等任何第三方元素。
- 页面展示中统一使用 POXIOL 品牌。
- 图片文件建议上传到网站 `/public/images/poxiol-v6/` 目录。
- 如果网站是 Next.js 项目，建议使用 `next/image` 调用图片。
- 页面文字尽量用 HTML 文本，不要全部写死在图片里，利于移动端和 SEO。
- 图片上传前建议压缩成 WebP，同时保留 PNG 原图备份。

---

## 2. 推荐上传目录

建议放到：

```text
/public/images/poxiol-v6/
```

前端调用路径：

```text
/images/poxiol-v6/文件名.png
```

---

## 3. 图片对应页面使用位置

| 文件名 | 页面 | 模块 | 用法 |
|---|---|---|---|
| home_hero_custom_teamwear_manufacturer.png | Home 首页 | Hero Banner | 首页首屏主视觉 |
| home_oem_odm_solutions.png | Home / OEM ODM | OEM / ODM Solutions | 替换原有有风险 OEM/ODM 图片 |
| home_club_partnership_program.png | Home 首页 | Club Partnership Program | 替换原有有风险合作项目图片 |
| projects_basketball_academy_uniform_program.png | Projects 案例页 | Basketball Academy Case | 篮球学院案例图 |
| projects_soccer_club_kit_launch.png | Projects 案例页 | Soccer Club Kit Launch | 足球俱乐部案例图 |
| manufacturing_quality_control.png | Manufacturing / Home | Quality Control | 质检流程信任图 |
| manufacturing_sublimation_printing.png | Manufacturing | Sublimation Printing | 热升华印花工艺图 |
| manufacturing_cutting_sewing.png | Manufacturing | Cutting & Sewing | 裁剪缝制工厂图 |
| manufacturing_packing_global_delivery.png | Manufacturing / Contact | Packing & Global Delivery | 包装发货信任图 |

---

## 4. 首页替换建议

### Hero Banner

使用：

```text
home_hero_custom_teamwear_manufacturer.png
```

建议页面文字：

```text
Custom Teamwear Manufacturer for Clubs, Schools & Sports Brands
Free Mockup | OEM / ODM | Quality Control | Global Delivery
```

CTA：

```text
Get Free Mockup
Request OEM / Bulk Quote
```

Alt Text：

```text
POXIOL custom teamwear manufacturer for clubs schools and sports brands
```

---

### OEM / ODM Solutions

使用：

```text
home_oem_odm_solutions.png
```

建议替换原图：

```text
/images/homepage-v3/06_v4_oem_odm_solutions.png
```

Alt Text：

```text
POXIOL OEM ODM custom teamwear solutions
```

---

### Club Partnership Program

使用：

```text
home_club_partnership_program.png
```

建议替换原图：

```text
/images/homepage-v3/09_v4_club_partnership_program.png
```

Alt Text：

```text
POXIOL club partnership program for custom teamwear
```

---

## 5. Projects 页面替换建议

### Basketball Academy

使用：

```text
projects_basketball_academy_uniform_program.png
```

案例标题：

```text
Basketball Academy Uniform Program
```

案例信息：

```text
Buyer Type: Basketball Academy
Product: Reversible Basketball Uniforms
Quantity: 300 Sets
Timeline: 21 Days
```

---

### Soccer Club

使用：

```text
projects_soccer_club_kit_launch.png
```

案例标题：

```text
Soccer Club Kit Launch
```

案例信息：

```text
Buyer Type: Soccer Club
Product: Home & Away Soccer Kits
Quantity: 500 Sets
Timeline: 25 Days
```

---

## 6. Manufacturing 页面替换建议

使用这 4 张图组成完整工厂信任链路：

1. `manufacturing_sublimation_printing.png`
2. `manufacturing_cutting_sewing.png`
3. `manufacturing_quality_control.png`
4. `manufacturing_packing_global_delivery.png`

建议模块顺序：

```text
Mockup & Design Confirmation
Sublimation Printing
Cutting & Sewing
Quality Control
Packing & Global Delivery
```

---

## 7. Next.js 图片调用示例

```tsx
import Image from "next/image";

<Image
  src="/images/poxiol-v6/home_hero_custom_teamwear_manufacturer.png"
  alt="POXIOL custom teamwear manufacturer for clubs schools and sports brands"
  width={1672}
  height={941}
  priority
  className="w-full h-auto rounded-2xl"
/>
```

---

## 8. 建议图片压缩规格

原图：PNG，适合备份和再次编辑。  
上线图：建议转成 WebP。

推荐尺寸：

- Hero Banner: 1920 x 1080 或保持 16:9
- 普通模块图: 1600 x 900
- Projects 案例图: 1200 x 675 或 1200 x 900
- 移动端可另外裁切 1080 x 1350

---

## 9. 上线前检查

上传前请逐张检查：

- 衣服上是否只有 POXIOL
- 鞋子上是否没有第三方 Logo
- 背景是否没有品牌广告牌
- 是否没有职业球队队徽
- 是否没有国家队、联盟、赛事标志
- 人脸是否清晰自然
- 图片是否和 POXIOL 黑白绿风格统一
- Alt Text 是否填写
- 移动端裁切是否正常

---

## 10. 推荐执行顺序

第一步：替换首页 Hero、OEM/ODM、Club Partnership 三张图。  
第二步：替换 Projects 页面篮球和足球案例图。  
第三步：更新 Manufacturing 页面四张工厂流程图。  
第四步：压缩 WebP 并检查移动端。  
第五步：重新检查首页和 Projects 页面是否还存在第三方商标风险。
