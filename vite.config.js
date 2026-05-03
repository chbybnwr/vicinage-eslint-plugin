/// <reference types="vitest/config" />

export { viteConfig as default }

/** @type {import("vite").UserConfig} */
const viteConfig = {
  test: {
    coverage: {
      exclude: ['src/test/**/*'],
    },

    projects: [
      {
        resolve: {
          alias: {
            '#': fileURLToPath(new URL('src', import.meta.url)),
          },
        },

        test: {
          name: 'unit',
          setupFiles: [
            fileURLToPath(new URL('src/test/setup.ts', import.meta.url)),
          ],
          include: ['**/*.{test,spec}.?(c|m)ts?(x)'],
        },
      },
    ],
  },
}

import { fileURLToPath } from 'node:url'
//
