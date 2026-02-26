import type { MetadataRoute } from 'next'
import { getPublished } from '@/lib/data/blog-store'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://elevaviajes.mx'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublished()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/destinos`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/blog`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/testimonios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cotizacion`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/contacto`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url:            `${BASE_URL}/blog/${post.slug}`,
    lastModified:   post.actualizadoEn,
    changeFrequency: 'monthly',
    priority:       0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
