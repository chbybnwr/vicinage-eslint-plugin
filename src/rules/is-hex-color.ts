export { isHexColor }

const isHexColor = makeVariableCheckingRule(function (
  node: Node,
  _vars?: Variables,
): RuleResponse {
  return node.type === 'Literal' &&
    typeof node.value === 'string' &&
    // eslint-disable-next-line require-unicode-regexp
    /^#(?:[\dA-Fa-f]{3,4}|[\dA-Fa-f]{6}|[\dA-Fa-f]{8})$/.test(node.value)
    ? // eslint-disable-next-line no-undefined
      undefined
    : { message: 'a valid hex color (#FFAADD or #FFAADDFF)' }
})

import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
