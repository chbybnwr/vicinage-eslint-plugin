/* eslint-disable no-magic-numbers */
export { sortKeys as default }

import type { AST } from 'eslint'
import type { CallExpression } from 'estree'
import type { Comment } from 'estree'
import createImportTracker from './utils/create-import-tracker'
import getPropertyName from './utils/get-property-name'
import getPropertyPriorityAndType from './utils/get-property-priority-and-type'
import getSourceCode from './utils/get-source-code'
import type { Node } from 'estree'
import type { ObjectExpression } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { SourceCode } from 'eslint'
import type { SpreadElement } from 'estree'

const sortKeys: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require style properties to be sorted by key',
      recommended: false,
      url: 'https://github.com/chbybnwr/vicinage-eslint-plugin',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          validImports: {
            type: 'array',
            items: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    from: { type: 'string' },
                    as: { type: 'string' },
                  },
                },
              ],
            },
            default: ['vicinage'],
          },
          order: {
            enum: ['default', 'clean', 'recess'],
            default: 'default',
          },
          minKeys: {
            type: 'integer',
            minimum: 2,
            default: 2,
          },
          allowLineSeparatedGroups: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context: Rule.RuleContext) {
    const {
      // validImports: importsToLookFor = ['vicinage'],
      order = 'default',
      minKeys = 2,
      allowLineSeparatedGroups = false,
    }: Schema = (context.options[0] ?? {}) as Schema

    const importTracker = createImportTracker(['vicinage'])

    function isApplyCallee(node: Node) {
      return (
        (node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          importTracker.isDefaultImport(node.object.name) &&
          node.property.type === 'Identifier' &&
          node.property.name === 'apply') ||
        (node.type === 'Identifier' &&
          importTracker.isNamedImport('apply', node.name))
      )
    }

    function isStyleDeclaration(node: Readonly<Node>) {
      return (
        node.type === 'CallExpression' &&
        isApplyCallee(node.callee) &&
        node.arguments.length === 1
      )
    }

    let stack: Stack | null = null
    let isInsideApplyCall = false
    let objectExpressionNestingLevel = -1

    return {
      Program: (node) => {
        for (const part of node.body) {
          if (part.type === 'ImportDeclaration') {
            // eslint-disable-next-line new-cap
            importTracker.ImportDeclaration(part)
          }
        }
      },

      CallExpression: (
        node: Readonly<CallExpression & Rule.NodeParentExtension>,
      ) => {
        const [arg] = node.arguments

        if (
          !isStyleDeclaration(node) ||
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          !('properties' in arg!) ||
          arg.properties.length === 0
        ) {
          return
        }

        isInsideApplyCall = true
      },

      ObjectExpression: (node: ObjectExpression) => {
        if (isInsideApplyCall) {
          // eslint-disable-next-line no-plusplus
          objectExpressionNestingLevel++
        }

        if (objectExpressionNestingLevel >= 0) {
          stack = {
            upper: stack,
            prevNode: null,
            prevName: null,
            prevBlankLine: false,
            numKeys: node.properties.length,
          }
        }
      },

      'ObjectExpression:exit'() {
        if (isInsideApplyCall && objectExpressionNestingLevel >= 0 && stack) {
          stack = stack.upper
        }

        if (isInsideApplyCall) {
          // eslint-disable-next-line no-plusplus
          objectExpressionNestingLevel--
        }
      },

      SpreadElement(node: Readonly<SpreadElement & Rule.NodeParentExtension>) {
        if (
          isInsideApplyCall &&
          objectExpressionNestingLevel >= 0 &&
          node.parent.type === 'ObjectExpression' &&
          stack
        ) {
          stack.prevName = null
        }
      },

      // eslint-disable-next-line complexity
      Property(node: Readonly<Property & Rule.NodeParentExtension>) {
        if (
          !isInsideApplyCall ||
          objectExpressionNestingLevel < 0 ||
          node.parent.type === 'ObjectPattern' ||
          stack === null
        ) {
          return
        }

        const { prevName, prevNode, numKeys } = stack
        const currName = getPropertyName(node)
        let isBlankLineBetweenNodes = stack.prevBlankLine

        const sourceCode = getSourceCode(context)

        const tokens =
          stack.prevNode &&
          sourceCode.getTokensBetween(stack.prevNode, node, {
            includeComments: true,
          })

        if (tokens && tokens.length > 0) {
          for (const [index, token] of tokens.entries()) {
            const previousToken = tokens[index - 1]

            if (
              previousToken &&
              token.loc &&
              previousToken.loc &&
              token.loc.start.line - previousToken.loc.end.line > 1
            ) {
              isBlankLineBetweenNodes = true
            }
          }

          if (
            !isBlankLineBetweenNodes &&
            (node.loc?.start.line ?? 0) - (tokens.at(-1)?.loc?.end.line ?? 0) >
              1
          ) {
            isBlankLineBetweenNodes = true
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const firstToken = tokens[0]!

          if (
            !isBlankLineBetweenNodes &&
            firstToken.loc &&
            stack.prevNode?.loc &&
            firstToken.loc.start.line - stack.prevNode.loc.end.line > 1
          ) {
            isBlankLineBetweenNodes = true
          }
        }

        stack.prevNode = node

        if (currName !== null) {
          stack.prevName = currName
        }

        if (allowLineSeparatedGroups && isBlankLineBetweenNodes) {
          stack.prevBlankLine = currName === null

          return
        }

        if (prevName === null || currName === null || numKeys < minKeys) {
          return
        }

        if (!isValidOrder(prevName, currName, order)) {
          context.report({
            node,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            loc: node.key.loc!,
            message: `Style property key "${currName}" should be above "${prevName}"`,
            // $FlowFixMe[incompatible-type]
            fix: createFix({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              prevNode: prevNode!,
              currNode: node,
              sourceCode,
            }),
          })
        }
      },

      'CallExpression:exit'(
        node: Readonly<CallExpression & Rule.NodeParentExtension>,
      ) {
        if (isInsideApplyCall && isStyleDeclaration(node)) {
          isInsideApplyCall = false
        }
      },

      'Program:exit'() {
        importTracker.clear()
      },
    }
  },
}

interface Schema {
  validImports?: (
    | string
    | {
        from?: string
        as?: string
      }
  )[]
  order?: 'default' | 'clean' | 'recess'
  minKeys?: number
  allowLineSeparatedGroups?: boolean
}

type Stack = null | {
  upper: Stack
  prevNode: Readonly<Property> | null
  prevName: string | null
  prevBlankLine: boolean
  numKeys: number
}

function isValidOrder(
  prevName: string,
  currName: string,
  order: Schema['order'],
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const prev = getPropertyPriorityAndType(prevName, order!)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const curr = getPropertyPriorityAndType(currName, order!)

  if (prev.type !== 'string' || curr.type !== 'string') {
    if (prev.priority === curr.priority) {
      return prevName <= currName
    }

    return prev.priority <= curr.priority
  }

  return prevName <= currName
}

function createFix({
  currNode,
  prevNode,
  sourceCode,
}: {
  currNode: Property
  prevNode: Property
  sourceCode: SourceCode
}) {
  return function (fixer: Rule.RuleFixer) {
    // Need to handle the case if there is white space between node and comment above
    // This can be especially tricky if the "sort between space groups" option is turned on
    const fixes = []

    // Retrieve comments before the previous node
    const prevNodeCommentsBefore = getPropertyCommentsBefore(prevNode)

    // Start node for the entire context with comments of prevNode
    const prevNodeContextStartNode =
      prevNodeCommentsBefore.length > 0 ? prevNodeCommentsBefore[0] : prevNode

    const { indentation: startNodeIndentation, isTokenBeforeSameLineAsNode } =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getNodeIndentation(prevNodeContextStartNode!)

    const prevNodeSameLineComment = getPropertySameLineComment(prevNode)

    const tokenAfterPrevNode = sourceCode.getTokenAfter(prevNode, {
      includeComments: false,
    })

    const prevNodeContextEndNode = prevNodeSameLineComment ?? tokenAfterPrevNode

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!prevNodeContextEndNode?.range || !prevNodeContextStartNode!.range) {
      // Early return if range or prevNode doesn't exist
      return []
    }

    const rangeStart =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      prevNodeContextStartNode!.range[0] - startNodeIndentation.length

    // eslint-disable-next-line prefer-destructuring
    const rangeEnd = prevNodeContextEndNode.range[1]

    const textToMove = sourceCode.getText().slice(rangeStart, rangeEnd)

    fixes.push(
      fixer.removeRange([
        // If previous token is not on the same line, we remove an extra char to account for newline
        rangeStart - Number(!isTokenBeforeSameLineAsNode),
        rangeEnd,
      ]),
    )

    const currNodeSameLineComment = getPropertySameLineComment(currNode)

    const tokenAfterCurrNode = sourceCode.getTokenAfter(currNode, {
      includeComments: false,
    })

    const hasCommaAfterCurrNode =
      tokenAfterCurrNode && isCommaToken(tokenAfterCurrNode)

    if (!hasCommaAfterCurrNode) {
      fixes.push(fixer.insertTextAfter(currNode, ','))
    }

    // eslint-disable-next-line unicorn/no-keyword-prefix
    const newLine = isSameLine(prevNode, currNode) ? '' : '\n'
    // If token after the current node is a comma then we insert after the comma
    // Otherwise we insert after the current node because there is a guaranteed fix to add comma (above)
    const fallbackNode = hasCommaAfterCurrNode ? tokenAfterCurrNode : currNode

    fixes.push(
      fixer.insertTextAfter(
        (currNodeSameLineComment ?? fallbackNode) as AST.Token,
        // eslint-disable-next-line unicorn/no-keyword-prefix
        `${newLine}${textToMove}`,
      ),
    )

    return fixes
  }

  function getEmptyLineCountBetweenNodes(
    aNode: Property | Comment,
    bNode: Property | Comment,
  ): number {
    const [upperNode, lowerNode] = [aNode, bNode].toSorted(
      (a, b) => (a.loc?.start.line ?? 0) - (b.loc?.start.line ?? 0),
    )

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const upperNodeLine = upperNode!.loc?.start.line
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lowerNodeLine = lowerNode!.loc?.start.line

    // eslint-disable-next-line no-undefined
    if (upperNodeLine === undefined || lowerNodeLine === undefined) {
      throw new Error('Invalid node location')
    }

    return sourceCode.lines
      .slice(upperNodeLine, lowerNodeLine - 1)
      .filter((line) => /^[\t ]*$/u.test(line)).length
  }

  function getPropertyCommentsBefore(node: Property): Comment[] {
    return sourceCode.getCommentsBefore(node).filter((comment) => {
      const tokenBefore = sourceCode.getTokenBefore(comment, {
        includeComments: false,
      })

      if (tokenBefore === null) {
        return true
      }

      // Only comments that have no other tokens on the same line are considered
      // Also, comments that have at least one empty line between node and comment will be ignored
      // For example:
      //
      //  create({
      //    foo: { // comment above a <- this comment does not belong to property below
      //      // comment above b <- this comment does not belong to property below
      //
      //      // comment above c <- this comment belongs to property below
      //      display: 'red'
      //    }
      //  })
      //
      return (
        !isSameLine(tokenBefore, comment) &&
        getEmptyLineCountBetweenNodes(node, comment) === 0
      )
    })
  }

  function getPropertySameLineComment(node: Property): Comment | undefined {
    const tokenAfter = sourceCode.getTokenAfter(node, {
      includeComments: false,
    })

    const sameLineComment = sourceCode
      .getCommentsAfter(
        tokenAfter && isCommaToken(tokenAfter) ? tokenAfter : node,
      )
      .find((comment) => isSameLine(node, comment))

    return sameLineComment
  }

  function getNodeIndentation(node: Property | Comment): {
    indentation: string
    isTokenBeforeSameLineAsNode: boolean
  } {
    const tokenBefore = sourceCode.getTokenBefore(node, {
      includeComments: false,
    })

    const isTokenBeforeSameLineAsNode =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Boolean(tokenBefore) && isSameLine(tokenBefore!, node)

    const sliceStart =
      isTokenBeforeSameLineAsNode && tokenBefore?.loc
        ? tokenBefore.loc.end.column
        : 0

    return {
      isTokenBeforeSameLineAsNode,
      indentation: node.loc
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          sourceCode.lines[node.loc.start.line - 1]!.slice(
            sliceStart,
            node.loc.start.column,
          )
        : '',
    }
  }
}

function isSameLine(
  aNode: Property | Comment | AST.Token,
  bNode: Property | Comment | AST.Token,
): boolean {
  return Boolean(aNode.loc && aNode.loc.start.line === bNode.loc?.start.line)
}

function isCommaToken(token: AST.Token): boolean {
  return token.type === 'Punctuator' && token.value === ','
}
