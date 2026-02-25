/**
 * Script de seed: migra datos de los JSON locales a PostgreSQL.
 * Ejecutar con: yarn prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

function readJson<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'lib/data', filename)
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[]
}

async function main() {
  console.log('Iniciando seed...')

  // ─── Cotizaciones ────────────────────────────────────────────────────────────

  type RawCotizacion = {
    id: string; nombre: string; email: string; whatsapp: string
    tipo_viaje: string; destino: string; fecha_salida: string
    fecha_regreso: string; adultos: string; ninos: string
    presupuesto: string; categoria: string; intereses: string[]
    mensaje: string; estado: string; creadoEn: string
  }

  const cotizaciones = readJson<RawCotizacion>('cotizaciones.json')
  for (const c of cotizaciones) {
    await prisma.cotizacion.upsert({
      where:  { id: c.id },
      update: {},
      create: {
        id:           c.id,
        nombre:       c.nombre,
        email:        c.email,
        whatsapp:     c.whatsapp,
        tipo_viaje:   c.tipo_viaje,
        destino:      c.destino,
        fecha_salida: c.fecha_salida ?? '',
        fecha_regreso: c.fecha_regreso ?? '',
        adultos:      c.adultos,
        ninos:        c.ninos,
        presupuesto:  c.presupuesto ?? '',
        categoria:    c.categoria,
        intereses:    c.intereses,
        mensaje:      c.mensaje ?? '',
        estado:       c.estado,
        creadoEn:     new Date(c.creadoEn),
      },
    })
  }
  console.log(`✓ ${cotizaciones.length} cotizaciones`)

  // ─── Blog posts ──────────────────────────────────────────────────────────────

  type RawBlogPost = {
    id: string; titulo: string; extracto: string; contenido: string
    slug: string; imagenPortada?: string; categoria: string
    publicado: boolean; creadoEn: string; actualizadoEn: string
  }

  const posts = readJson<RawBlogPost>('posts.json')
  for (const p of posts) {
    await prisma.blogPost.upsert({
      where:  { id: p.id },
      update: {},
      create: {
        id:            p.id,
        titulo:        p.titulo,
        extracto:      p.extracto,
        contenido:     p.contenido,
        slug:          p.slug,
        imagenPortada: p.imagenPortada ?? null,
        categoria:     p.categoria,
        publicado:     p.publicado,
        creadoEn:      new Date(p.creadoEn),
        actualizadoEn: new Date(p.actualizadoEn),
      },
    })
  }
  console.log(`✓ ${posts.length} posts`)

  // ─── Testimonios ─────────────────────────────────────────────────────────────

  type RawTestimonio = {
    id: string; nombre: string; ciudad: string; viaje: string
    texto: string; calificacion: number; visible: boolean
    orden: number; creadoEn: string
  }

  const testimonios = readJson<RawTestimonio>('testimonios.json')
  for (const t of testimonios) {
    await prisma.testimonio.upsert({
      where:  { id: t.id },
      update: {},
      create: {
        id:          t.id,
        nombre:      t.nombre,
        ciudad:      t.ciudad,
        viaje:       t.viaje,
        texto:       t.texto,
        calificacion: t.calificacion,
        visible:     t.visible,
        orden:       t.orden,
        creadoEn:    new Date(t.creadoEn),
      },
    })
  }
  console.log(`✓ ${testimonios.length} testimonios`)

  // ─── Destinos ────────────────────────────────────────────────────────────────

  type RawDestino = {
    id: string; nombre: string; slug: string; pais: string
    tipo: string; descripcion: string; imagenPrincipal: string
    etiquetas: string[]; activo: boolean; creadoEn: string
  }

  const destinos = readJson<RawDestino>('destinos.json')
  for (const d of destinos) {
    await prisma.destino.upsert({
      where:  { id: d.id },
      update: {},
      create: {
        id:              d.id,
        nombre:          d.nombre,
        slug:            d.slug,
        pais:            d.pais,
        tipo:            d.tipo,
        descripcion:     d.descripcion,
        imagenPrincipal: d.imagenPrincipal,
        etiquetas:       d.etiquetas,
        activo:          d.activo,
        creadoEn:        new Date(d.creadoEn),
      },
    })
  }
  console.log(`✓ ${destinos.length} destinos`)

  console.log('Seed completado.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
