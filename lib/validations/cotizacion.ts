import { z } from 'zod'

export const CotizacionSchema = z.object({
  nombre:        z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  email:         z.string().email('Correo electrónico inválido'),
  whatsapp:      z.string().min(7, 'Número inválido').max(25, 'Número inválido'),
  tipo_viaje:    z.string().min(1, 'Selecciona un tipo de viaje'),
  destino:       z.string().min(2, 'Mínimo 2 caracteres').max(120, 'Máximo 120 caracteres'),
  fecha_salida:  z.string().optional().default(''),
  fecha_regreso: z.string().optional().default(''),
  adultos:       z.string().min(1),
  ninos:         z.string(),
  presupuesto:   z.string().optional().default(''),
  categoria:     z.string().min(1, 'Selecciona una categoría'),
  intereses:     z.array(z.string()),
  mensaje:       z.string().max(1000, 'Máximo 1000 caracteres').optional().default(''),
})

export type CotizacionInput = z.infer<typeof CotizacionSchema>
