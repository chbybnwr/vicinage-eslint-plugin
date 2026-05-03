export { getSourceCode as default }

// Fallback to legacy `getSourceCode()` for compatibility with older ESLint versions
function getSourceCode(context: Rule.RuleContext): SourceCode {
  // const sourceCode =
  //   context.sourceCode ||
  //   (typeof context.getSourceCode === 'function'
  //     ? context.getSourceCode()
  //     : null)
  const { sourceCode } = context

  // if (!sourceCode) {
  //   throw new Error(
  //     'ESLint context does not provide source code access. Please update ESLint to v>=8.40.0. See: https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/',
  //   )
  // }

  return sourceCode
}

import type { Rule } from 'eslint'
import type { SourceCode } from 'eslint'
//
