export interface BlogPost {
  id: string
  titulo: string
  extracto: string
  contenido: string
  slug: string
  imagenPortada?: string
  categoria: string
  publicado: boolean
  creadoEn: Date
  actualizadoEn: Date
}

export interface BlogPostSerialized extends Omit<BlogPost, 'creadoEn' | 'actualizadoEn'> {
  creadoEn: string
  actualizadoEn: string
}
