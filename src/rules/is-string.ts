/* eslint-disable no-undefined */

import makeVariableCheckingRule from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'

function isStringImpl(node: Node, _variables?: Variables): RuleResponse {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return undefined
  }

  if (node.type === 'TemplateLiteral') {
    return undefined
  }

  return {
    message: 'a string literal',
  }
}

const isString: RuleCheck = makeVariableCheckingRule(isStringImpl)

export default isString
