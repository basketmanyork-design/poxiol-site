import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ArticleTemplate, metadataFromArticle} from '@/components/cms/ArticleTemplate'
import {getArticle, getArticles} from '@/lib/sanity/content'

type Props = {params: {slug: string}}

export const dynamicParams = false

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({slug: article.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return {title: 'Not Found'}
  return metadataFromArticle({...article, articleType: 'blog'})
}

export default async function BlogArticlePage({params}: Props) {
  const article = await getArticle(params.slug)
  if (!article) notFound()
  return <ArticleTemplate article={{...article, articleType: 'blog'}} />
}