export { isPercentage }

const isPercentage = makeVariableCheckingRule(function (
  node: Node,
): RuleResponse {
  if (node.type === 'Literal') {
    const value = node.value

    if (
      typeof value === 'string' &&
      /^(?<value>[-,+]?\d+(?<decimal>\.\d+)?%)$/u.test(value)
    ) {
      return undefined
    }
  }

  return {
    message: 'A string literal representing a percentage (e.g. 100%)',
  }
})

import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleResponse } from '#/rules/types'
//
