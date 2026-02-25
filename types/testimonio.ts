// Modelo completo — usado en la capa de datos (server-side)
export interface Testimonio {
  id: string
  nombre: string
  ciudad: string
  viaje: string
  texto: string
  calificacion: number
  visible: boolean
  orden: number
  creadoEn: Date
}

// Versión serializable para pasar como props a Client Components.
// Date → ISO string porque React no puede serializar Date objects entre
// server components y client components.
export interface TestimonioSerialized extends Omit<Testimonio, 'creadoEn'> {
  creadoEn: string
}
