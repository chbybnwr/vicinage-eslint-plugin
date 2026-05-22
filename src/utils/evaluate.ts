export { evaluate }

function evaluate(
  node: Expression | Pattern | TSESTree.Expression,
  variables?: Variables,
): null | Literal | 'ARG' {
  if (
    node.type === AST_NODE_TYPES.TSSatisfiesExpression ||
    node.type === AST_NODE_TYPES.TSAsExpression
  ) {
    return evaluate(node.expression, variables)
  }

  if (node.type === AST_NODE_TYPES.Identifier && variables != null) {
    const existingVar = variables.get(node.name) as
      | TSESTree.Expression
      | 'ARG'
      | undefined

    if (existingVar === 'ARG') {
      return 'ARG'
    }

    if (existingVar != null) {
      return evaluate(existingVar, variables)
    }
  }

  if (node.type === AST_NODE_TYPES.Literal) {
    return node
  }

  return null
}

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { Expression } from 'estree'
import type { Literal } from 'estree'
import type { Pattern } from 'estree'
import type { TSESTree } from '@typescript-eslint/types'
import type { Variables } from '#/rules/types'
//
