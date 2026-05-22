export { makeVariableCheckingRule }

function makeVariableCheckingRule(rule: RuleCheck): RuleCheck {
  function variableCheckingRule(
    node: Expression | Pattern | TSESTree.Expression,
    variables?: Variables,
    property?: Readonly<Property>,
    context?: Rule.RuleContext,
  ): RuleResponse {
    if (
      node.type === AST_NODE_TYPES.TSSatisfiesExpression ||
      node.type === AST_NODE_TYPES.TSAsExpression
    ) {
      return variableCheckingRule(node.expression, variables, property, context)
    }

    if (node.type === 'Identifier' && variables != null) {
      const existingVariable = variables.get(node.name)

      if (existingVariable === 'ARG') {
        return undefined
      }

      if (existingVariable != null) {
        return variableCheckingRule(
          existingVariable,
          variables,
          property,
          context,
        )
      }
    }

    if (node.type === 'MemberExpression' && variables != null) {
      let object = node.object

      while (object.type === 'MemberExpression') {
        object = object.object
      }

      if (object.type === 'Identifier') {
        const existingVariable = variables.get(object.name)

        if (existingVariable === 'ARG') {
          return undefined
        }
      }
    }

    return rule(node as Parameters<RuleCheck>[0], variables, property, context)
  }

  return variableCheckingRule
}

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { Expression } from 'estree'
import type { Pattern } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { TSESTree } from '@typescript-eslint/types'
import type { Variables } from '#/rules/types'
//
