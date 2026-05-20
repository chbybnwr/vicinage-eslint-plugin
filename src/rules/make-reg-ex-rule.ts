export { makeRegExRule }

function makeRegExRule(regex: RegExp, message: string): RuleCheck {
  function regexChecker(node: Node, _variables?: Variables): RuleResponse {
    if (
      node.type === 'Literal' &&
      typeof node.value === 'string' &&
      regex.test(node.value)
    ) {
      // eslint-disable-next-line no-undefined
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
import type { Variables } from '#/rules/types'
//
