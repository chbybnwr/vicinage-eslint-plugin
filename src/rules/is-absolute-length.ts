export { isAbsoluteLength }

const absoluteLengthUnits = new Set(['px', 'mm', 'in', 'pc', 'pt'])

const isAbsoluteLength: RuleCheck = (
  node: Node,
  _variables?: Variables,
): RuleResponse => {
  if (node.type === 'Literal') {
    const value = node.value

    if (
      typeof value === 'string' &&
      [...absoluteLengthUnits].some((unit) =>
        new RegExp(String.raw`^([-,+]?\d+(\.\d+)?${unit})$`, 'u').exec(value),
      )
    ) {
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
