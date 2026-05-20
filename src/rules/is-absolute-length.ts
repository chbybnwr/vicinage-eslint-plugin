export { isAbsoluteLength as default }

const absoluteLengthUnits = new Set(['px', 'mm', 'in', 'pc', 'pt'])

const isAbsoluteLength: RuleCheck = (
  node: Node,
  _variables?: Variables,
): RuleResponse => {
  if (node.type === 'Literal') {
    const val = node.value

    if (
      typeof val === 'string' &&
      [...absoluteLengthUnits].some((unit) =>
        // eslint-disable-next-line require-unicode-regexp
        new RegExp(String.raw`^([-,+]?\d+(\.\d+)?${unit})$`).exec(val),
      )
    ) {
      // eslint-disable-next-line no-undefined
      return undefined
    }
  }

  return {
    message: `a number ending in ${[...absoluteLengthUnits].join(', ')}`,
  }
}

import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
