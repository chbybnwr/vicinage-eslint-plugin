export { isNumber }
export { isMathCall }

const numericOperators = new Set(['+', '-', '*', '/'])
const mathFunctions = new Set(['abs', 'ceil', 'floor', 'round'])

const isNumber: RuleCheck = makeVariableCheckingRule(function (
  node: Node,
  variables?: Variables,
  property?: Readonly<Property>,
  context?: Rule.RuleContext,
): RuleResponse {
  if (node.type === 'Literal' && typeof node.value === 'number') {
    return undefined
  }

  if (node.type === 'Identifier' && context) {
    const scope = context.sourceCode.getScope(node)
    const variable = scope.set.get(node.name)
    const definition = variable?.defs[0]

    const isLocalConst =
      definition?.node.type === 'VariableDeclarator' &&
      definition.parent !== null &&
      'kind' in definition.parent &&
      definition.parent.kind === 'const'

    const nodeName = variables?.get(node.name)

    return isLocalConst ||
      (typeof nodeName !== 'string' &&
        // @ts-expect-error TODO: find the case that cover this
        nodeName?.type === 'number')
      ? undefined
      : { message: 'a number literal or math expression' }
  }

  if (node.type === 'UnaryExpression' && node.operator === '-') {
    return isNumber(node.argument, variables, property, context)
  }

  if (node.type === 'BinaryExpression' && numericOperators.has(node.operator)) {
    // @ts-expect-error FIXME: please
    const left = isNumber(node.left, variables, property, context)
    const right = isNumber(node.right, variables, property, context)

    return left === undefined && right === undefined
      ? undefined
      : { message: 'a number literal or math expression' }
  }

  if (node.type === 'MemberExpression' && node.object.type === 'Identifier') {
    return undefined
  }

  if (node.type === 'CallExpression') {
    return undefined
  }

  if (isMathCall(node)) {
    return undefined
  }

  return { message: 'a number literal or math expression' }
})

function isMathCall(node: Node): boolean {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'Math' &&
    node.callee.property.type === 'Identifier' &&
    mathFunctions.has(node.callee.property.name) &&
    node.arguments.length === 1
  )
}

import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
