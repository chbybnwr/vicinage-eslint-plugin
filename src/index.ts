export { plugin as default }

const { name, version } = pkg

const plugin = {
  meta: { name, version },
  rules: {
    'no-conflicting-props': noConflictingProps,
    // 'no-lookahead-selectors': noLookaheadSelectors,
    // 'no-nonstandard-styles': noNonStandardStyles,
    'sort-keys': sortKeys,
    'valid-shorthands': validShorthands,
    // 'valid-styles': validStyles,
  },
}

// import validStyles from './valid-styles'
import noConflictingProps from './no-conflicting-props'
// import validStyles from './valid-styles'
import pkg from '../package.json'
// import noLookaheadSelectors from './no-lookahead-selectors'
// import noNonStandardStyles from './no-nonstandard-styles'
import sortKeys from './sort-keys'
import validShorthands from './valid-shorthands'
