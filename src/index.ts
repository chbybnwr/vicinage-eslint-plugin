export { plugin as default }

const { name, version } = pkg

const rules = {
  'no-conflicting-props': noConflictingProps,
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
        'vicinage/valid-styles': 'off',
        'vicinage/valid-shorthands': 'warn',
        'vicinage/sort-keys': 'warn',
      },
    },
  },
} satisfies Plugin

import { noConflictingProps } from './no-conflicting-props'
import pkg from '../package.json'
import type { Plugin } from '@eslint/config-helpers'
// import noNonStandardStyles from './no-nonstandard-styles'
import { sortKeys } from './sort-keys'
import { validShorthands } from './valid-shorthands'
import { validStyles } from './valid-styles'
