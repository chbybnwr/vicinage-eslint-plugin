export { plugin as default }

const { name, version } = pkg

const rules = {
  'no-conflicting-props': noConflictingProps,
  // 'no-lookahead-selectors': noLookaheadSelectors,
  // 'no-nonstandard-styles': noNonStandardStyles,
  'sort-keys': sortKeys,
  'valid-shorthands': validShorthands,
  // 'valid-styles': validStyles,
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
        'vicinage/valid-shorthands': 'error',
        'vicinage/sort-keys': 'warn',
      },
    },
  },
} satisfies Plugin

// import validStyles from './valid-styles'
import noConflictingProps from './no-conflicting-props'
// import validStyles from './valid-styles'
import pkg from '../package.json'
import type { Plugin } from '@eslint/config-helpers'
// import noLookaheadSelectors from './no-lookahead-selectors'
// import noNonStandardStyles from './no-nonstandard-styles'
import sortKeys from './sort-keys'
import validShorthands from './valid-shorthands'
