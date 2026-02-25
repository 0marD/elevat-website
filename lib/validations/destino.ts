import { z } from 'zod'

export const DestinoSchema = z.object({
  nombre:          z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  pais:            z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  tipo:            z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  descripcion:     z.string().min(20, 'Mínimo 20 caracteres').max(600, 'Máximo 600 caracteres'),
  imagenPrincipal: z.string().url('Debe ser una URL válida'),
  etiquetas:       z.array(z.string().min(1)).min(1, 'Al menos una etiqueta').max(6, 'Máximo 6 etiquetas'),
  activo:          z.boolean().default(true),
})

export type DestinoInput = z.infer<typeof DestinoSchema>

export type DestinoFieldErrors = Partial<Record<keyof DestinoInput, string>>
