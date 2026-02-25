export type EstadoCotizacion = 'pendiente' | 'atendida'

export interface Cotizacion {
  id:           string
  nombre:       string
  email:        string
  whatsapp:     string
  tipo_viaje:   string
  destino:      string
  fecha_salida: string
  fecha_regreso: string
  adultos:      string
  ninos:        string
  presupuesto:  string
  categoria:    string
  intereses:    string[]
  mensaje:      string
  estado:       EstadoCotizacion
  creadoEn:     Date
}

export interface CotizacionSerialized extends Omit<Cotizacion, 'creadoEn'> {
  creadoEn: string
}
