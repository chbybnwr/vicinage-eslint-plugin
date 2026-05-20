export { evaluate as default }

function evaluate(
  node: Expression | Pattern,
  variables?: Variables,
): null | Literal | 'ARG' {
  if (
    // @ts-expect-error FIXME: invalid-compare
    node.type === 'TSSatisfiesExpression' ||
    // @ts-expect-error FIXME: invalid-compare
    node.type === 'TSAsExpression'
  ) {
    // @ts-expect-error FIXME: please
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return evaluate(node.expression, variables)
  }

  if (node.type === 'Identifier' && variables != null) {
    const existingVar = variables.get(node.name)

    if (existingVar === 'ARG') {
      return 'ARG'
    }

    if (existingVar != null) {
      return evaluate(existingVar, variables)
    }
  }

  if (node.type === 'Literal') {
    return node
  }

  return null
}

import type { Expression } from 'estree'
import type { Literal } from 'estree'
import type { Pattern } from 'estree'
import type { Variables } from '#/rules/types'
//
