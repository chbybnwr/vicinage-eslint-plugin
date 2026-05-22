export { plugin as default }

const { name, version } = pkg

const rules = {
  'no-conflicting-props': noConflictingProperties,
  // 'no-nonstandard-styles': noNonStandardStyles,
  'sort-keys': sortKeys,
  'valid-shorthands': validShorthands,
  'valid-styles': validStyles,
} satisfies Plugin['rules']

/**
 * @public
 */
const plugin = {
  meta: { name, version },
  rules,
  configs: {
    recommended: {
      plugins: {
        vicinage: {
          rules,
        },
      },
      rules: {
        'vicinage/no-conflicting-props': 'error',
        'vicinage/valid-styles': 'error',
        'vicinage/valid-shorthands': 'warn',
        'vicinage/sort-keys': 'warn',
      },
    },
  },
} satisfies Plugin

import { noConflictingProperties } from './no-conflicting-properties'
import pkg from '../package.json'
import type { Plugin } from '@eslint/config-helpers'
// import noNonStandardStyles from './no-nonstandard-styles'
import { sortKeys } from './sort-keys'
import { validShorthands } from './valid-shorthands'
import { validStyles } from './valid-styles'
