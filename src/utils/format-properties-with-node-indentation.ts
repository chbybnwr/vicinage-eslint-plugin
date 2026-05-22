export { formatPropertiesWithNodeIndentation }

function formatPropertiesWithNodeIndentation(
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

  return properties
    .map(
      (property, index) => `${index > 0 ? `\n${indentation}` : ''}${property}`,
    )
    .join(',')
}

import { getNodeIndentation } from './get-node-indentation'
import type { Node } from 'estree'
import type { SourceCode } from 'eslint'
//
