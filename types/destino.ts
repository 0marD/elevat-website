export interface Destino {
  id: string
  nombre: string
  slug: string
  pais: string
  tipo: string
  descripcion: string
  imagenPrincipal: string
  etiquetas: string[]
  activo: boolean
  creadoEn: Date
}

export interface DestinoSerialized extends Omit<Destino, 'creadoEn'> {
  creadoEn: string
}
