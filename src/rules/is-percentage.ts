import makeVariableCheckingRule from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'

function isPercentage(node: Node, _variables?: Variables): RuleResponse {
  if (node.type === 'Literal') {
    const val = node.value

    if (
      typeof val === 'string' &&
      // eslint-disable-next-line prefer-regex-literals, require-unicode-regexp
      new RegExp(String.raw`^([-,+]?\d+(\.\d+)?%)$`).test(val)
    ) {
      // eslint-disable-next-line no-undefined
      return undefined
    }
  }

  return {
    message: 'A string literal representing a percentage (e.g. 100%)',
  }
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default makeVariableCheckingRule(isPercentage) as RuleCheck
