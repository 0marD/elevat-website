import { z } from 'zod'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+?52)?[1-9]\d{9}$|^\d{10}$/

export const MensajeRapidoSchema = z.object({
  nombre:   z.string().min(2, 'Ingresa tu nombre.').max(80, 'Máximo 80 caracteres.'),
  contacto: z
    .string()
    .refine(
      v => emailRegex.test(v.trim()) || phoneRegex.test(v.trim()),
      'Ingresa un correo válido o número de WhatsApp (10 dígitos).',
    ),
  mensaje: z.string().min(5, 'Escribe un mensaje más detallado.').max(1000, 'Máximo 1000 caracteres.'),
})

export type MensajeRapidoInput = z.infer<typeof MensajeRapidoSchema>
