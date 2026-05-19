import makeVariableCheckingRule from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { RuleCheck } from '../stylex-valid-styles'
import type { RuleResponse } from '../stylex-valid-styles'
import type { Variables } from '../stylex-valid-styles'

const isHexColor = makeVariableCheckingRule(
  (node: Node, _vars?: Variables): RuleResponse =>
    node.type === 'Literal' &&
    typeof node.value === 'string' &&
    // eslint-disable-next-line require-unicode-regexp
    /^#(?:[\dA-Fa-f]{3,4}|[\dA-Fa-f]{6}|[\dA-Fa-f]{8})$/.test(node.value)
      ? // eslint-disable-next-line no-undefined
        undefined
      : { message: 'a valid hex color (#FFAADD or #FFAADDFF)' },
)

export default isHexColor as RuleCheck
