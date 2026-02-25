import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBySlug, getPublished } from '@/lib/data/blog-store'
import { formatDate, readingTime } from '@/lib/utils/format'
import JsonLd from '@/app/components/seo/JsonLd'

interface BlogArticuloParams {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: BlogArticuloParams): Promise<Metadata> {
  const { slug } = await params
  const post = await getBySlug(slug)
  if (!post) return { title: 'Artículo no encontrado — ÉLEVA.' }

  return {
    title:       `${post.titulo} — ÉLEVA. Viajes de Autor`,
    description: post.extracto,
    alternates:  { canonical: `https://elevaviajes.mx/blog/${slug}` },
    openGraph: {
      title:       post.titulo,
      description: post.extracto,
      url:         `https://elevaviajes.mx/blog/${slug}`,
      type:        'article',
      images:      post.imagenPortada ? [{ url: post.imagenPortada }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.titulo,
      description: post.extracto,
    },
  }
}

export default async function BlogArticuloPage({ params }: BlogArticuloParams) {
  const { slug } = await params
  const post = await getBySlug(slug)
  if (!post) notFound()

  const otrosPosts = (await getPublished())
    .filter((p) => p.id !== post.id)
    .slice(0, 3)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.extracto,
    image: post.imagenPortada ?? undefined,
    datePublished: post.creadoEn.toISOString(),
    dateModified: post.actualizadoEn.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ÉLEVA.',
      url: 'https://elevaviajes.mx',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ÉLEVA.',
      url: 'https://elevaviajes.mx',
      logo: { '@type': 'ImageObject', url: 'https://elevaviajes.mx/icons/icon-512.svg' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://elevaviajes.mx/blog/${post.slug}`,
    },
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <JsonLd data={articleJsonLd} />
      <div className="max-w-3xl mx-auto px-6 md:px-12">

        {/* Breadcrumb ─────────────────────────────────────── */}
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-12 text-[10px] tracking-widest uppercase">
          <Link href="/blog" className="text-plata/50 hover:text-dorado transition-colors">
            Blog
          </Link>
          <span aria-hidden="true" className="text-plata/20">›</span>
          <span className="text-dorado/70 line-clamp-1">{post.categoria}</span>
        </nav>

        {/* Encabezado del artículo ───────────────────────── */}
        <header className="mb-12">
          <div
            className="section-label mb-4"
            style={{ color: 'rgba(201,168,76,0.7)' }}
          >
            {post.categoria}
          </div>

          <h1
            className="display-heading mb-6"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {post.titulo}
          </h1>

          <p
            className="text-plata/70 leading-loose mb-8"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontStyle: 'italic' }}
          >
            {post.extracto}
          </p>

          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-plata/40">
            <span>{formatDate(post.creadoEn)}</span>
            <span aria-hidden="true">·</span>
            <span>{readingTime(post.contenido)} de lectura</span>
          </div>

          <div className="mt-8 h-px bg-dorado/10" />
        </header>

        {/* Imagen de portada ─────────────────────────────── */}
        {post.imagenPortada && (
          <div className="mb-12 overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imagenPortada}
              alt={post.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenido del artículo ────────────────────────── */}
        <article aria-label={`Artículo: ${post.titulo}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(26px, 3vw, 38px)' }}
                  className="text-crema mb-4 mt-10"
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(22px, 2.5vw, 30px)' }}
                  className="text-crema mb-3 mt-8"
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-crema text-base font-medium tracking-wider mb-2 mt-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '19px', fontWeight: 300 }}
                  className="text-plata/80 leading-loose mb-6"
                >
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="text-crema font-medium">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-crema/80 italic">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside text-plata/80 space-y-2 mb-6 ml-6">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside text-plata/80 space-y-2 mb-6 ml-6">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 300 }}
                >
                  {children}
                </li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-dorado hover:text-dorado-claro underline underline-offset-4 transition-colors"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-dorado/40 pl-6 italic text-plata/60 mb-6 my-6">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-negro/60 text-dorado/80 px-1.5 py-0.5 text-sm">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-negro/60 p-6 overflow-x-auto mb-6 text-sm">
                  {children}
                </pre>
              ),
              hr: () => <hr className="border-dorado/10 my-10" />,
            }}
          >
            {post.contenido}
          </ReactMarkdown>
        </article>

        {/* CTA ───────────────────────────────────────────── */}
        <div className="mt-16 card-dark p-8 text-center">
          <div className="section-label mb-3">¿Listo para vivir tu propio viaje?</div>
          <p className="text-plata/60 text-sm leading-loose mb-6 max-w-sm mx-auto">
            En ÉLEVA diseñamos experiencias a medida. Tu próximo destino te está esperando.
          </p>
          <Link href="/cotizacion" className="btn-gold">
            Solicitar cotización →
          </Link>
        </div>

        {/* Otros artículos ───────────────────────────────── */}
        {otrosPosts.length > 0 && (
          <section aria-labelledby="otros-articulos" className="mt-16">
            <h2
              id="otros-articulos"
              className="text-[9px] tracking-[0.4em] uppercase text-plata/40 mb-8"
            >
              Más del blog
            </h2>
            <ul className="space-y-4">
              {otrosPosts.map((p) => (
                <li key={p.id} className="border-b border-crema/5 pb-4">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col gap-1"
                  >
                    <span
                      className="text-[9px] tracking-widest uppercase text-plata/30"
                    >
                      {p.categoria}
                    </span>
                    <span
                      className="text-crema/70 group-hover:text-dorado transition-colors"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300 }}
                    >
                      {p.titulo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  )
}
