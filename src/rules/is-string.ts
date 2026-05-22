export { isString }

const isString = makeVariableCheckingRule(function (
  node: Node,
  _variables?: Variables,
): RuleResponse {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return undefined
  }

  if (node.type === 'TemplateLiteral') {
    return undefined
  }

  return {
    message: 'a string literal',
  }
})

import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
