import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/utils/slugify'

describe('slugify', () => {
  it('convierte espacios en guiones', () => {
    expect(slugify('Hola Mundo')).toBe('hola-mundo')
  })

  it('convierte a minúsculas', () => {
    expect(slugify('ÉLEVA Viajes')).toBe('eleva-viajes')
  })

  it('elimina caracteres especiales', () => {
    expect(slugify('Guía de Japón: lo mejor')).toBe('guia-de-japon-lo-mejor')
  })

  it('elimina acentos', () => {
    expect(slugify('café con leche')).toBe('cafe-con-leche')
  })

  it('elimina ñ', () => {
    expect(slugify('España y su gastronomía')).toBe('espana-y-su-gastronomia')
  })

  it('no tiene guiones al inicio ni al final', () => {
    const result = slugify('  hola  ')
    expect(result).not.toMatch(/^-/)
    expect(result).not.toMatch(/-$/)
  })

  it('no tiene guiones consecutivos', () => {
    const result = slugify('hola   mundo')
    expect(result).not.toMatch(/--/)
  })

  it('maneja cadena vacía', () => {
    expect(slugify('')).toBe('')
  })
})
