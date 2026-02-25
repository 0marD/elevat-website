'use client'
import { useState, useEffect } from 'react'

/**
 * Hook genérico para persistir estado en localStorage.
 * Seguro en SSR: el valor inicial se aplica antes de la hidratación.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Hidratación desde localStorage solo en el cliente
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T)
      }
    } catch {
      // Silenciar errores de localStorage (modo privado, cuotas, etc.)
    }
  }, [key])

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // Silenciar errores de escritura
    }
  }

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {
      // Silenciar errores
    }
  }

  return [storedValue, setValue, removeValue]
}
