import { z } from 'zod'

export const TestimonioSchema = z.object({
  nombre:      z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  ciudad:      z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  viaje:       z.string().min(2, 'Mínimo 2 caracteres').max(120, 'Máximo 120 caracteres'),
  texto:       z.string().min(20, 'Mínimo 20 caracteres').max(800, 'Máximo 800 caracteres'),
  calificacion: z.number()
    .int('La calificación debe ser un número entero')
    .min(1, 'Mínimo 1 estrella')
    .max(5, 'Máximo 5 estrellas'),
})

export type TestimonioInput = z.infer<typeof TestimonioSchema>

// Tipo conveniente para errores campo a campo en los formularios
export type TestimonioFieldErrors = Partial<Record<keyof TestimonioInput, string>>
