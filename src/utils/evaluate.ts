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
    const existingVariable = variables.get(node.name) as
      | TSESTree.Expression
      | 'ARG'
      | undefined

    if (existingVariable === 'ARG') {
      return 'ARG'
    }

    if (existingVariable != null) {
      return evaluate(existingVariable, variables)
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
