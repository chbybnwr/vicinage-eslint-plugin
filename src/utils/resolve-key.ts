export { resolveKey }

function resolveKey(
  property: Identifier,
  variables?: Variables,
): string | undefined {
  const { name } = property
  let existingVariable = variables?.get(name) as
    | 'ARG'
    | TSESTree.Expression
    | undefined

  while (existingVariable != null) {
    if (existingVariable === 'ARG') {
      return undefined
    }

    if (existingVariable.type === AST_NODE_TYPES.TSAsExpression) {
      existingVariable = existingVariable.expression
    }

    if (existingVariable.type === AST_NODE_TYPES.TSSatisfiesExpression) {
      existingVariable = existingVariable.expression
    }

    if (existingVariable.type === AST_NODE_TYPES.Literal) {
      const { value } = existingVariable

      if (typeof value === 'string') {
        return value
      }

      return undefined
    }

    if (existingVariable.type !== AST_NODE_TYPES.Identifier) {
      return undefined
    }

    existingVariable = variables?.get(existingVariable.name) as
      | 'ARG'
      | TSESTree.Expression
      | undefined
  }

  // TODO: maybe not idk
  return undefined
}

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { Identifier } from 'estree'
import { TSESTree } from '@typescript-eslint/types'
import type { Variables } from '#/rules/types'
//
