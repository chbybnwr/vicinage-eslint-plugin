export { makeVariableCheckingRule }

function makeVariableCheckingRule(rule: RuleCheck): RuleCheck {
  // eslint-disable-next-line max-params
  function varCheckingRule(
    node: Expression | Pattern | TSESTree.Expression,
    variables?: Variables,
    prop?: Readonly<Property>,
    context?: Rule.RuleContext,
  ): RuleResponse {
    if (
      node.type === AST_NODE_TYPES.TSSatisfiesExpression ||
      node.type === AST_NODE_TYPES.TSAsExpression
    ) {
      return varCheckingRule(node.expression, variables, prop, context)
    }

    if (node.type === 'Identifier' && variables != null) {
      const existingVar = variables.get(node.name)

      if (existingVar === 'ARG') {
        // eslint-disable-next-line no-undefined
        return undefined
      }

      if (existingVar != null) {
        return varCheckingRule(existingVar, variables, prop, context)
      }
    }

    if (node.type === 'MemberExpression' && variables != null) {
      let obj = node.object

      while (obj.type === 'MemberExpression') {
        obj = obj.object
      }

      if (obj.type === 'Identifier') {
        const existingVar = variables.get(obj.name)

        if (existingVar === 'ARG') {
          // eslint-disable-next-line no-undefined
          return undefined
        }
      }
    }

    return rule(node as Parameters<RuleCheck>[0], variables, prop, context)
  }

  return varCheckingRule
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
