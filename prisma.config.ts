import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Prisma 7 no carga .env automáticamente — lo hacemos manualmente.
config({ path: '.env' })
config({ path: '.env.local', override: true })

// Para CLI (db push, migrate): usar DIRECT_URL si existe (conexión directa
// sin pooler), o DATABASE_URL como fallback.
const cliUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ''

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: cliUrl,
  },
})
