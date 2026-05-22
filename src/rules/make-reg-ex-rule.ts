export { makeRegExRule }

function makeRegExRule(regex: RegExp, message: string): RuleCheck {
  function regexChecker(node: Node): RuleResponse {
    if (
      node.type === 'Literal' &&
      typeof node.value === 'string' &&
      regex.test(node.value)
    ) {
      return undefined
    }

    return {
      message,
    }
  }

  return makeVariableCheckingRule(regexChecker)
}

import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
//
