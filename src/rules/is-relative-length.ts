export { isRelativeLength }

const relativeLengthUnits = new Set([
  // font units
  'ch',
  'em',
  'ex',
  'ic',
  'rem',
  // viewport units
  'vh',
  'vw',
  'vmin',
  'vmax',
  'svh',
  'dvh',
  'lvh',
  'svw',
  'dvw',
  'ldw',
  // container units
  'cqw',
  'cqh',
  'cqmin',
  'cqmax',
])

const isRelativeLength: RuleCheck = (node: Node): RuleResponse => {
  if (node.type === 'Literal') {
    const value = node.value

    if (
      typeof value === 'string' &&
      [...relativeLengthUnits].some((unit) =>
        new RegExp(String.raw`^([-,+]?\d+(\.\d+)?${unit})$`, 'u').exec(value),
      )
    ) {
      return undefined
    }
  }

  return {
    message: `a number ending in ${[...relativeLengthUnits].join(', ')}`,
  }
}

import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
//
