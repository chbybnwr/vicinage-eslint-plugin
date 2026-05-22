export { resolveKey }

/* eslint-disable no-undefined */

function resolveKey(
  property: Identifier,
  variables?: Variables,
): string | undefined {
  const { name } = property
  let existingVar = variables?.get(name) as
    | 'ARG'
    | TSESTree.Expression
    | undefined

  while (existingVar != null) {
    if (existingVar === 'ARG') {
      return undefined
    }

    if (existingVar.type === AST_NODE_TYPES.TSAsExpression) {
      existingVar = existingVar.expression
    }

    if (existingVar.type === AST_NODE_TYPES.TSSatisfiesExpression) {
      existingVar = existingVar.expression
    }

    if (existingVar.type === AST_NODE_TYPES.Literal) {
      const { value } = existingVar

      if (typeof value === 'string') {
        return value
      }

      return undefined
    }

    if (existingVar.type !== AST_NODE_TYPES.Identifier) {
      return undefined
    }

    existingVar = variables?.get(existingVar.name) as
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
