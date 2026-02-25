# Instrucciones para Claude Code — ÉLEVA

## Stack
Next.js 15 · TypeScript strict · Tailwind CSS · Yarn

## Reglas obligatorias

1. **TypeScript estricto:** Nunca usar `any`. Tipar todas las props con interfaces nombradas.
2. **Clean code:** Funciones de una sola responsabilidad. Nombres descriptivos. Sin código muerto.
3. **Accesibilidad:** Todos los inputs con label asociado. Imágenes con alt. Botones con aria-label si no tienen texto visible.
4. **Seguridad:** Validar inputs con Zod. Variables sensibles solo en .env.local. Nunca exponer secretos en NEXT_PUBLIC_.
5. **Componentes reutilizables:** Usar los componentes de components/ui/. Si algo se repite, abstraer.
6. **Tailwind:** Usar variables de marca definidas en tailwind.config.js. No hardcodear colores hex en className.
7. **Convenciones:** PascalCase para componentes, camelCase para funciones, UPPER_SNAKE_CASE para constantes globales.
8. **Yarn:** Siempre usar yarn, nunca npm.

## Número de WhatsApp
523337084290