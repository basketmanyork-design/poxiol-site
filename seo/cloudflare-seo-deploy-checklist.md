# Cloudflare Pages SEO 部署检查清单

## 部署前

```bash
npm install
npm run build
```

确认生成：

```txt
out/
```

## 文件检查

确认以下文件存在于 `public/`：

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `_headers`
- `_redirects`

## Cloudflare Pages 设置

```txt
Build command: npm run build
Build output directory: out
```

## 部署后检查

打开：

- `https://poxiol.com/robots.txt`
- `https://poxiol.com/sitemap.xml`
- `https://poxiol.com/llms.txt`

确认：

- HTTP status 200
- Sitemap 内容完整
- robots.txt 包含 Sitemap 地址
- www 是否 301 到 apex domain
- 主要页面没有 404
- Free Mockup 表单仍然可提交

## 域名规范

推荐：

```txt
https://poxiol.com/ 为主域名
https://www.poxiol.com/ 301 到 https://poxiol.com/
```

## 提交搜索引擎

- Google Search Console: `https://poxiol.com/sitemap.xml`
- Bing Webmaster Tools: `https://poxiol.com/sitemap.xml`
