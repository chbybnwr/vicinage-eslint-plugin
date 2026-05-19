export { tsdownConfig as default }

/** @type {import('tsdown').UserConfig} */
const tsdownConfig = {
  entry: {
    index: 'src/index.ts',
  },

  alias: {
    '#': fileURLToPath(new URL('src', import.meta.url)),
  },

  deps: {
    onlyBundle: [],
  },

  minify: true,
  fixedExtension: false,
}

import { fileURLToPath } from 'node:url'
//
