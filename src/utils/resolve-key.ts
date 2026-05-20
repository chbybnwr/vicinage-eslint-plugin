export { resolveKey }

/* eslint-disable no-undefined */

function resolveKey(
  property: Identifier,
  variables?: Variables,
): string | undefined {
  const { name } = property
  let existingVar = variables?.get(name)

  while (existingVar != null) {
    if (existingVar === 'ARG') {
      return undefined
    }

    // @ts-expect-error FIXME: invalid-compare
    if (existingVar.type === 'TSAsExpression') {
      // @ts-expect-error FIXME: please
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      existingVar = existingVar.expression
    }

    // @ts-expect-error FIXME: invalid-compare
    if (existingVar.type === 'TSSatisfiesExpression') {
      // @ts-expect-error FIXME: please
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      existingVar = existingVar.expression
    }

    // @ts-expect-error FIXME: please
    if (existingVar.type === 'Literal') {
      // @ts-expect-error FIXME: please
      const { value } = existingVar

      if (typeof value === 'string') {
        return value
      }

      return undefined
    }

    // @ts-expect-error FIXME: please
    if (existingVar.type === 'Identifier') {
      existingVar = variables?.get(existingVar.name)
    } else {
      return undefined
    }
  }

  // TODO: maybe not idk
  return undefined
}

import type { Identifier } from 'estree'
import type { Variables } from '#/rules/types'
//
