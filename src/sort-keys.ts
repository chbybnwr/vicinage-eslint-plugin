export { sortKeys }

/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
          // validImports: {
          //   type: 'array',
          //   items: {
          //     oneOf: [
          //       { type: 'string' },
          //       {
          //         type: 'object',
          //         properties: {
          //           from: { type: 'string' },
          //           as: { type: 'string' },
          //         },
          //       },
          //     ],
          //   },
          //   default: ['vicinage'],
          // },
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
        node.arguments.length > 0
      )
    }

    let stack: Stack | null = null
    let isInsideApplyCall = false
    let objectExpressionNestingLevel = -1

    return {
      Program: (node) => {
        for (const part of node.body) {
          if (part.type === 'ImportDeclaration') {
            importTracker.ImportDeclaration(part)
          }
        }
      },

      CallExpression: (
        node: Readonly<CallExpression & Rule.NodeParentExtension>,
      ) => {
        if (
          !isStyleDeclaration(node) ||
          !node.arguments.some(
            (argument) =>
              'properties' in argument && argument.properties.length > 0,
          )
        ) {
          return
        }

        isInsideApplyCall = true
      },

      ObjectExpression: (node: ObjectExpression) => {
        if (isInsideApplyCall) {
          objectExpressionNestingLevel += 1
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
          objectExpressionNestingLevel -= 1
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

      Property(node: Readonly<Property & Rule.NodeParentExtension>) {
        if (
          !isInsideApplyCall ||
          objectExpressionNestingLevel < 0 ||
          node.parent.type === 'ObjectPattern' ||
          stack === null
        ) {
          return
        }

        const { prevName, numKeys } = stack
        const currentName = getPropertyName(node)
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

          const [firstToken] = tokens

          if (
            !isBlankLineBetweenNodes &&
            firstToken?.loc &&
            stack.prevNode?.loc &&
            firstToken.loc.start.line - stack.prevNode.loc.end.line > 1
          ) {
            isBlankLineBetweenNodes = true
          }
        }

        stack.prevNode = node

        if (currentName !== null) {
          stack.prevName = currentName
        }

        if (allowLineSeparatedGroups && isBlankLineBetweenNodes) {
          stack.prevBlankLine = currentName === null

          return
        }

        if (prevName === null || currentName === null || numKeys < minKeys) {
          return
        }

        if (!isValidOrder(prevName, currentName, order)) {
          context.report({
            node,
            loc: node.key.loc!,
            message: `Style property key "${currentName}" should be above "${prevName}"`,
            fix: createFix({
              currNode: node,
              sourceCode,
              order,
              allowLineSeparatedGroups,
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

interface SortableProperty {
  node: Property
  name: string
  text: string
  rangeStart: number
  rangeEnd: number
}

function isValidOrder(
  previousName: string,
  currentName: string,
  order: Schema['order'],
): boolean {
  const previous = getPropertyPriorityAndType(previousName, order!)
  const current = getPropertyPriorityAndType(currentName, order!)

  if (previous.type !== 'string' || current.type !== 'string') {
    if (previous.priority === current.priority) {
      return previousName <= currentName
    }

    return previous.priority <= current.priority
  }

  return previousName <= currentName
}

function comparePropertyNames(
  aName: string,
  bName: string,
  order: Schema['order'],
): number {
  if (aName === bName) {
    return 0
  }

  return isValidOrder(aName, bName, order) ? -1 : 1
}

function createFix({
  currNode,
  sourceCode,
  order,
  allowLineSeparatedGroups,
}: {
  currNode: Property & Rule.NodeParentExtension
  sourceCode: SourceCode
  order: Schema['order']
  allowLineSeparatedGroups: boolean
}) {
  return function (fixer: Rule.RuleFixer) {
    const group = getSortableGroup(currNode)

    if (group.length < 2) {
      return []
    }

    const sortedGroup = [...group].toSorted((a, b) => {
      const result = comparePropertyNames(a.name, b.name, order)

      return result === 0 ? group.indexOf(a) - group.indexOf(b) : result
    })

    if (sortedGroup.every((item, index) => item === group[index])) {
      return []
    }

    const head = group[0]
    const tail = group.at(-1)

    if (!(head != null && tail != null)) {
      throw new TypeError('type error')
    }

    const replacementText = isInlineGroup(group)
      ? getInlineReplacementText(sortedGroup, head.text)
      : sortedGroup.map((item) => item.text).join('\n')

    return fixer.replaceTextRange(
      [head.rangeStart, tail.rangeEnd],
      replacementText,
    )
  }

  function getSortableGroup(
    node: Property & Rule.NodeParentExtension,
  ): SortableProperty[] {
    const { parent } = node

    if (parent.type !== 'ObjectExpression') {
      return []
    }

    const groups: SortableProperty[][] = []
    let group: SortableProperty[] = []

    for (const property of parent.properties) {
      if (property.type !== 'Property') {
        if (group.length > 0) {
          groups.push(group)
          group = []
        }

        continue
      }

      const name = getPropertyName(property)

      if (name === null) {
        if (group.length > 0) {
          groups.push(group)
          group = []
        }

        continue
      }

      const sortableProperty = getSortableProperty(property, name)

      if (sortableProperty === null) {
        if (group.length > 0) {
          groups.push(group)
          group = []
        }

        continue
      }

      const tail = group.at(-1)

      if (group.length > 0 && isGroupBoundary(tail, sortableProperty)) {
        groups.push(group)
        group = []
      }

      group.push(sortableProperty)
    }

    if (group.length > 0) {
      groups.push(group)
    }

    return (
      groups.find((sortableGroup) =>
        sortableGroup.some((item) => item.node === node),
      ) ?? []
    )
  }

  function getSortableProperty(
    node: Property,
    name: string,
  ): SortableProperty | null {
    const commentsBefore = getPropertyCommentsBefore(node)
    const contextStartNode =
      commentsBefore.length > 0 ? commentsBefore[0] : node

    if (!(contextStartNode != null)) {
      throw new TypeError('type error')
    }

    const { indentation } = getNodeIndentation(contextStartNode)
    const sameLineComment = getPropertySameLineComment(node)
    const tokenAfterNode = sourceCode.getTokenAfter(node, {
      includeComments: false,
    })
    const hasCommaAfterNode = tokenAfterNode && isCommaToken(tokenAfterNode)
    const contextEndNode =
      sameLineComment ?? (hasCommaAfterNode ? tokenAfterNode : node)
    const contextStartRange = contextStartNode.range
    const contextEndRange = contextEndNode.range
    const nodeRange = node.range

    if (!contextStartRange || !contextEndRange || !nodeRange) {
      return null
    }

    const rangeStart = contextStartRange[0] - indentation.length
    const rangeEnd = contextEndRange[1]
    const sourceText = sourceCode.getText()
    const commaInsertIndex = nodeRange[1] - rangeStart
    let text = sourceText.slice(rangeStart, rangeEnd)

    if (!hasCommaAfterNode) {
      text =
        text.slice(0, commaInsertIndex) + ',' + text.slice(commaInsertIndex)
    }

    return {
      node,
      name,
      text,
      rangeStart,
      rangeEnd,
    }
  }

  function isGroupBoundary(
    previousProperty: SortableProperty | undefined,
    currentProperty: SortableProperty,
  ): boolean {
    const textBetweenProperties = sourceCode
      .getText()
      .slice(previousProperty?.rangeEnd, currentProperty.rangeStart)

    if (/[^ \t\r\n]/.test(textBetweenProperties)) {
      return true
    }

    return (
      allowLineSeparatedGroups &&
      /(?:\r?\n)[ \t]*(?:\r?\n)/.test(textBetweenProperties)
    )
  }

  function isInlineGroup(group: SortableProperty[]): boolean {
    const head = group[0]
    const tail = group.at(-1)

    return !/[\r\n]/.test(
      sourceCode.getText().slice(head?.rangeStart, tail?.rangeEnd),
    )
  }

  function getEmptyLineCountBetweenNodes(
    aNode: Property | Comment,
    bNode: Property | Comment,
  ): number {
    const [upperNode, lowerNode] = [aNode, bNode].toSorted(
      (a, b) => (a.loc?.start.line ?? 0) - (b.loc?.start.line ?? 0),
    )

    const upperNodeLine = upperNode!.loc?.start.line
    const lowerNodeLine = lowerNode!.loc?.start.line

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
      Boolean(tokenBefore) && isSameLine(tokenBefore!, node)

    const sliceStart =
      isTokenBeforeSameLineAsNode && tokenBefore?.loc
        ? tokenBefore.loc.end.column
        : 0

    return {
      isTokenBeforeSameLineAsNode,
      indentation: node.loc
        ? sourceCode.lines[node.loc.start.line - 1]!.slice(
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

function getInlineReplacementText(
  sortedGroup: SortableProperty[],
  firstText: string,
): string {
  const leadingWhitespace = /^[ \t]*/.exec(firstText)?.[0] ?? ''

  return (
    leadingWhitespace +
    sortedGroup.map((item) => item.text.trimStart()).join(' ')
  )
}

import type { AST } from 'eslint'
import type { CallExpression } from 'estree'
import type { Comment } from 'estree'
import { createImportTracker } from './utils/create-import-tracker'
import { getPropertyName } from './utils/get-property-name'
import { getPropertyPriorityAndType } from './utils/get-property-priority-and-type'
import { getSourceCode } from './utils/get-source-code'
import type { Node } from 'estree'
import type { ObjectExpression } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { SourceCode } from 'eslint'
import type { SpreadElement } from 'estree'
//
