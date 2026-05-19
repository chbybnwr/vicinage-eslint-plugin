/* eslint-disable unicorn/no-keyword-prefix */

import getNodeIndentation from './get-node-indentation'
import type { Node } from 'estree'
import type { SourceCode } from 'eslint'

export default function formatPropertiesWithNodeIndentation(
  node: Readonly<Node>,
  properties: readonly string[],
  sourceCode?: SourceCode,
): string {
  const indentation =
    sourceCode == null
      ? node.loc == null
        ? ''
        : ' '.repeat(node.loc.start.column)
      : getNodeIndentation(sourceCode, node)

  const newLineAndIndent = `\n${indentation}`

  return properties
    .map((property, index) => `${index > 0 ? newLineAndIndent : ''}${property}`)
    .join(',')
}
