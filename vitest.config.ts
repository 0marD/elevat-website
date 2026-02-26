import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals:     true,
    environment: 'node',
    include:     ['tests/**/*.test.{ts,tsx}'],
    setupFiles:  ['tests/setup.ts'],
    environmentMatchGlobs: [
      ['tests/components/**', 'jsdom'],
    ],
    maxForks: 2,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'lib/**/*.ts',
        'hooks/**/*.ts',
        'app/api/**/*.ts',
        'app/(public)/**/*.tsx',
        'app/components/**/*.tsx',
      ],
      exclude: ['lib/db.ts', 'lib/data/*.json', '**/*.d.ts'],
    },
  },
})
