import type { Node } from 'estree'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'

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

const isRelativeLength: RuleCheck = (
  node: Node,
  _variables?: Variables,
): RuleResponse => {
  if (node.type === 'Literal') {
    const val = node.value

    if (
      typeof val === 'string' &&
      [...relativeLengthUnits].some((unit) =>
        // eslint-disable-next-line require-unicode-regexp
        new RegExp(String.raw`^([-,+]?\d+(\.\d+)?${unit})$`).exec(val),
      )
    ) {
      // eslint-disable-next-line no-undefined
      return undefined
    }
  }

  return {
    message: `a number ending in ${[...relativeLengthUnits].join(', ')}`,
  }
}

export default isRelativeLength
