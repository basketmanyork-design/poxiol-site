import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ArticleTemplate, metadataFromArticle} from '@/components/cms/ArticleTemplate'
import {getArticle, getArticles} from '@/lib/sanity/content'
import {isArticleRouteReleased} from '@/lib/release/publication-policy'

type Props = {params: {slug: string}}

export const dynamicParams = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const articles = await getArticles('blog')
  const released = articles.filter((article) => isArticleRouteReleased(article.articleType, article.slug))
  return released.length
    ? released.map((article) => ({slug: article.slug}))
    : [{slug: '__no-public-blog-articles__'}]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article || article.articleType !== 'blog' || !isArticleRouteReleased(article.articleType, article.slug)) {
    return {title: 'Not Found'}
  }
  return metadataFromArticle(article)
}

export default async function BlogArticlePage({params}: Props) {
  const article = await getArticle(params.slug)
  if (!article || article.articleType !== 'blog' || !isArticleRouteReleased(article.articleType, article.slug)) notFound()
  return <ArticleTemplate article={article} />
}
