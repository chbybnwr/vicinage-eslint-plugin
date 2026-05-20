export { isNumber as default }
export { isNumber }
export { isMathCall }

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-undefined */

const numericOperators = new Set(['+', '-', '*', '/'])
const mathFunctions = new Set(['abs', 'ceil', 'floor', 'round'])

// eslint-disable-next-line max-params, complexity
const isNumber: RuleCheck = makeVariableCheckingRule(function (
  node: Node,
  variables?: Variables,
  prop?: Readonly<Property>,
  context?: Rule.RuleContext,
): RuleResponse {
  if (node.type === 'Literal' && typeof node.value === 'number') {
    return undefined
  }

  if (node.type === 'Identifier' && context) {
    // @ts-expect-error FIXME: [prop-missing] Flow libdefs doesn't know Rule.RuleContext has `getScope`
    const scope = context.getScope()
    const variable = scope.set.get(node.name)
    const def = variable?.defs?.[0]

    const isLocalConst =
      def?.node?.type === 'VariableDeclarator' && def.parent?.kind === 'const'

    // @ts-expect-error FIXME: please
    return isLocalConst || variables?.get(node.name)?.type === 'number'
      ? undefined
      : { message: 'a number literal or math expression' }
  }

  if (node.type === 'UnaryExpression' && node.operator === '-') {
    return isNumber(node.argument, variables, prop, context)
  }

  if (node.type === 'BinaryExpression' && numericOperators.has(node.operator)) {
    // @ts-expect-error FIXME: please
    const left = isNumber(node.left, variables, prop, context)
    const right = isNumber(node.right, variables, prop, context)

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

import makeVariableCheckingRule from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
