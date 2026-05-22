export { isCSSVariable }

const isCSSVariable = makeVariableCheckingRule(function (
  node: Expression | Pattern,
  _variables?: Variables,
): RuleResponse {
  if (node.type === 'Literal') {
    const value = node.value

    if (
      value != null &&
      typeof value === 'string' &&
      typeof value === 'string' &&
      value.startsWith('var(') &&
      value.endsWith(')') &&
      /--\S/u.exec(value.slice(4, -1)) !== null // too many characters are valid css variables, lets just check for --
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
