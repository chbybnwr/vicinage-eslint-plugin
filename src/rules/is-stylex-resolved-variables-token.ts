export { isStylexDefineVariablesToken }

interface ASTNode {
  readonly type: string
  readonly name?: string
  readonly object?: ASTNode
}

/**
 * Walks a MemberExpression chain to find the root Identifier.
 * e.g., tokens.badge.info.bg → tokens
 *       colors.accent → colors
 */
function getRootIdentifierName(node: ASTNode): string | null {
  if (node.type === 'Identifier' && typeof node.name === 'string') {
    return node.name
  }

  if (
    node.type === 'MemberExpression' &&
    node.object != null &&
    typeof node.object === 'object'
  ) {
    return getRootIdentifierName(node.object)
  }

  return null
}

function isStylexDefineVariablesToken(
  node: Expression | Pattern,
  stylexResolvedVariablesTokenImports: Set<string>,
): boolean {
  // MemberExpression: tokens.color OR tokens.badge.info.bg (any depth)
  if (node.type === 'MemberExpression') {
    const rootName = getRootIdentifierName(node)

    return rootName != null && stylexResolvedVariablesTokenImports.has(rootName)
  }

  // Simple identifier: tokens
  if (node.type === 'Identifier') {
    return stylexResolvedVariablesTokenImports.has(node.name)
  }

  // Template literals: `${tokens.badge.info.bg}`
  if (node.type === 'TemplateLiteral' && node.expressions.length > 0) {
    let invalidTokenCounter = 0

    for (const expression of node.expressions) {
      if (expression.type === 'MemberExpression') {
        const rootName = getRootIdentifierName(expression)

        if (
          rootName == null ||
          !stylexResolvedVariablesTokenImports.has(rootName)
        ) {
          invalidTokenCounter += 1
        }
      } else {
        invalidTokenCounter += 1
      }
    }

    return invalidTokenCounter === 0
  }

  return false
}

import type { Expression } from 'estree'
import type { Pattern } from 'estree'
//
