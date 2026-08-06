import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ArticleTemplate, metadataFromArticle} from '@/components/cms/ArticleTemplate'
import {getArticle, getArticles} from '@/lib/sanity/content'
import {WEEK3_GUIDE_SLUGS} from '@/lib/week3-guides'

type Props = {params: {slug: string}}

export const dynamicParams = false

export async function generateStaticParams() {
  const articles = await getArticles('resource')
  const slugs = new Set([...articles.map((article) => article.slug), ...WEEK3_GUIDE_SLUGS])
  return Array.from(slugs).map((slug) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = params
  const article = await getArticle(slug)
  if (!article || article.articleType !== 'resource') return {title: 'Not Found'}
  return metadataFromArticle(article)
}

export default async function ArticleDetailPage({params}: Props) {
  const {slug} = params
  const article = await getArticle(slug)
  if (!article || article.articleType !== 'resource') notFound()
  return <ArticleTemplate article={article} />
}
