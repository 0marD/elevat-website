import { describe, it, expect } from 'vitest'
import { readingTime, formatDate } from '@/lib/utils/format'

describe('readingTime', () => {
  it('retorna mínimo 1 min para texto muy corto', () => {
    expect(readingTime('Hola mundo')).toBe('1 min')
  })

  it('calcula correctamente 200 palabras como 1 min', () => {
    const text = Array(200).fill('palabra').join(' ')
    expect(readingTime(text)).toBe('1 min')
  })

  it('calcula correctamente 400 palabras como 2 min', () => {
    const text = Array(400).fill('palabra').join(' ')
    expect(readingTime(text)).toBe('2 min')
  })

  it('calcula correctamente 1000 palabras como 5 min', () => {
    const text = Array(1000).fill('palabra').join(' ')
    expect(readingTime(text)).toBe('5 min')
  })

  it('maneja contenido vacío retornando 1 min', () => {
    expect(readingTime('')).toBe('1 min')
  })
})

describe('formatDate', () => {
  it('formatea una fecha como Date object', () => {
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toMatch(/enero/)
    expect(result).toMatch(/2024/)
  })

  it('formatea una fecha como string ISO', () => {
    const result = formatDate('2024-06-20')
    expect(result).toMatch(/junio/)
    expect(result).toMatch(/2024/)
  })

  it('retorna una cadena no vacía', () => {
    expect(formatDate(new Date())).toBeTruthy()
  })
})
