export { getNodeIndentation }

function isSameLine(
  aNode: Node | Comment | AST.Token | null,
  bNode: Node | Comment | AST.Token | null,
): boolean {
  return aNode?.loc != null && aNode.loc.start.line === bNode?.loc?.start.line
}

function getNodeIndentation(
  sourceCode: SourceCode,
  node: Readonly<Node | Comment>,
): string {
  const tokenBefore = sourceCode.getTokenBefore(node, {
    includeComments: false,
  })

  const isTokenBeforeSameLineAsNode =
    Boolean(tokenBefore) && isSameLine(tokenBefore, node)

  const sliceStart =
    isTokenBeforeSameLineAsNode && tokenBefore?.loc
      ? tokenBefore.loc.end.column
      : 0

  if (node.loc) {
    const segment = sourceCode.lines[node.loc.start.line - 1]

    if (segment == null) {
      throw new TypeError('segment is required')
    }

    return segment.slice(sliceStart, node.loc.start.column)
  }

  return ''
}

import type { AST } from 'eslint'
import type { Comment } from 'estree'
import type { Node } from 'estree'
import type { SourceCode } from 'eslint'
//
