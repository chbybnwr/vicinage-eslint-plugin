export { isCSSVariable }

/* eslint-disable no-magic-numbers */
/* eslint-disable no-undefined */
/* eslint-disable unicorn/prefer-string-slice */
/* eslint-disable require-unicode-regexp */

const isCSSVariable = makeVariableCheckingRule(function (
  node: Expression | Pattern,
  _variables?: Variables,
): RuleResponse {
  if (node.type === 'Literal') {
    const val = node.value

    if (
      val != null &&
      typeof val === 'string' &&
      typeof val === 'string' &&
      val.startsWith('var(') &&
      val.endsWith(')') &&
      /--\S/.exec(val.substring(4, val.length - 1)) !== null // too many characters are valid css variables, lets just check for --
    ) {
      return undefined
    }
  }

  return {
    message: 'a CSS Variable',
  }
})

import type { Expression } from 'estree'
import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Pattern } from 'estree'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
