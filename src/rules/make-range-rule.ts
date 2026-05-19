import makeVariableCheckingRule from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'

export default function makeRangeRule(
  min: number,
  max: number,
  message: string,
): RuleCheck {
  function rangeChecker(node: Node, _variables?: Variables): RuleResponse {
    if (
      node.type === 'Literal' &&
      typeof node.value === 'number' &&
      node.value >= min &&
      node.value <= max
    ) {
      // eslint-disable-next-line no-undefined
      return undefined
    }

    return {
      message,
    }
  }

  return makeVariableCheckingRule(rangeChecker)
}
