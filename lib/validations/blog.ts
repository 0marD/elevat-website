import { z } from 'zod'

export const BlogPostSchema = z.object({
  titulo:        z.string().min(5, 'Mínimo 5 caracteres').max(160, 'Máximo 160 caracteres'),
  extracto:      z.string().min(20, 'Mínimo 20 caracteres').max(300, 'Máximo 300 caracteres'),
  contenido:     z.string().min(50, 'Mínimo 50 caracteres'),
  imagenPortada: z.string().url('Debe ser una URL válida').optional(),
  categoria:     z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  publicado:     z.boolean().default(false),
})

export type BlogPostInput = z.infer<typeof BlogPostSchema>

export type BlogPostFieldErrors = Partial<Record<keyof BlogPostInput, string>>
