# Google Search Console 提交流程

## 1. 添加资源

进入 Google Search Console，选择：

- Property type: Domain
- Domain: `poxiol.com`

## 2. 验证域名

推荐使用 DNS TXT 验证。

在 Cloudflare DNS 添加 Google 给出的 TXT 记录，等待验证通过。

## 3. 提交 Sitemap

验证通过后进入：

```txt
Indexing → Sitemaps
```

提交：

```txt
https://poxiol.com/sitemap.xml
```

## 4. 手动请求收录核心页面

优先检查并请求收录：

1. `https://poxiol.com/`
2. `https://poxiol.com/free-mockup/`
3. `https://poxiol.com/custom-basketball-uniforms/`
4. `https://poxiol.com/custom-soccer-kits/`
5. `https://poxiol.com/factory/`
6. `https://poxiol.com/oem-odm/`

## 5. 上线后一周检查

- Page indexing 是否有未收录页面
- Sitemap 是否成功读取
- Core Web Vitals 是否异常
- Mobile usability 是否异常
- 页面是否出现 Duplicate without user-selected canonical

## 6. 每次新增页面后

更新 `public/sitemap.xml`，重新部署 Cloudflare Pages，然后在 Search Console 重新提交 sitemap。
