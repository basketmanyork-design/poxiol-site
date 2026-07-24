import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ArticleTemplate, metadataFromArticle} from '@/components/cms/ArticleTemplate'
import {getArticle, getArticles} from '@/lib/sanity/content'

type Props = {params: {slug: string}}

export const dynamicParams = false

export async function generateStaticParams() {
  const articles = await getArticles('guide')
  return articles.map((article) => ({slug: article.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = params
  const article = await getArticle(slug)
  if (!article || article.articleType !== 'guide') return {title: 'Not Found'}
  return metadataFromArticle(article)
}

export default async function ArticleDetailPage({params}: Props) {
  const {slug} = params
  const article = await getArticle(slug)
  if (!article || article.articleType !== 'guide') notFound()
  return <ArticleTemplate article={article} />
}
