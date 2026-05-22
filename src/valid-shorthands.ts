export { validShorthands }

const legacyNameMapping: Readonly<Record<string, string>> = {
  marginStart: 'marginInlineStart',
  marginEnd: 'marginInlineEnd',
  marginHorizontal: 'marginInline',
  marginVertical: 'marginBlock',
  paddingStart: 'paddingInlineStart',
  paddingEnd: 'paddingInlineEnd',
  paddingHorizontal: 'paddingInline',
  paddingVertical: 'paddingBlock',
  gridColumnGap: 'columnGap',
  gridRowGap: 'rowGap',
  borderStart: 'borderInlineStart',
  borderEnd: 'borderInlineEnd',
}

const shorthandAliases: Readonly<
  Record<
    string,
    ReturnType<
      typeof createSpecificTransformer | typeof createDirectionalTransformer
    >
  >
> = {
  background: createSpecificTransformer('background'),
  font: createSpecificTransformer('font'),
  borderColor: createSpecificTransformer('border-color'),
  borderWidth: createSpecificTransformer('border-width'),
  borderStyle: createSpecificTransformer('border-style'),
  borderTop: createSpecificTransformer('border-top'),
  borderRight: createSpecificTransformer('border-right'),
  borderBottom: createSpecificTransformer('border-bottom'),
  border: createSpecificTransformer('border'),
  borderLeft: createSpecificTransformer('border-left'),
  borderRadius: createSpecificTransformer('border-radius'),
  cornerShape: createSpecificTransformer('corner-shape'),
  gridArea: createSpecificTransformer('grid-area'),
  gridColumn: createSpecificTransformer('grid-column'),
  gridRow: createSpecificTransformer('grid-row'),
  gridTemplate: createSpecificTransformer('grid-template'),
  outline: createSpecificTransformer('outline'),
  animation: createSpecificTransformer('animation'),
  flex: createSpecificTransformer('flex'),
  gap: createSpecificTransformer('gap'),
  gridGap: createSpecificTransformer('gap'),
  margin: createDirectionalTransformer('margin', 'Block', 'Inline'),
  padding: createDirectionalTransformer('padding', 'Block', 'Inline'),
  marginBlock: createBlockInlineTransformer('margin', 'Block'),
  marginInline: createBlockInlineTransformer('margin', 'Inline'),
  paddingBlock: createBlockInlineTransformer('padding', 'Block'),
  paddingInline: createBlockInlineTransformer('padding', 'Inline'),
}

const validShorthands: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require shorthand properties to be split into individual properties',
      recommended: false,
      url: 'https://github.com/chbybnwr/vicinage-eslint-plugin/',
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
          allowImportant: {
            type: 'boolean',
            default: false,
          },
          preferInline: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context: Rule.RuleContext) => {
    const {
      // validImports = ['vicinage'],
      allowImportant = false,
      preferInline = false,
    } = (context.options[0] ?? {}) as {
      // validImports?: string[]
      allowImportant?: boolean
      preferInline?: boolean
    }

    const importTracker = createImportTracker(['vicinage'])

    function isApplyCallee(node: Node) {
      return (
        // (node.type === 'MemberExpression' &&
        //   node.object.type === 'Identifier' &&
        //   importTracker.isDefaultImport(node.object.name) &&
        //   node.property.type === 'Identifier' &&
        //   node.property.name === 'create') ||
        node.type === 'Identifier' &&
        importTracker.isNamedImport('apply', node.name)
      )
    }

    function validateObject(object: ObjectExpression) {
      for (const property of object.properties) {
        if (property.type !== 'SpreadElement') {
          if (property.value.type === 'ObjectExpression') {
            validateObject(property.value)
          } else {
            validateProperty(property)
          }
        }
      }
    }

    function validateProperty(property: Property) {
      if (property.computed) {
        // can't resolve computed keys
        return
      }

      let key = null

      if (property.key.type === 'Identifier') {
        key = property.key.name
      } else if (property.key.type === 'Literal') {
        key = property.key.value
      }

      if (typeof key === 'string') {
        const modernName = legacyNameMapping[key]

        if (modernName != null) {
          context.report({
            node: property,
            message: `Use "${modernName}" instead of legacy formats like "${key}" to adhere to logical property naming.`,
            fix: (fixer) => fixer.replaceText(property.key, modernName),
          })
        }
      }

      if (typeof key !== 'string') {
        return
      }

      const shorthandAliasesForKey = shorthandAliases[key]

      if (
        typeof key !== 'string' ||
        !('value' in property.value) ||
        property.value.value === null ||
        shorthandAliasesForKey == null
      ) {
        return
      }

      const value = property.value.value

      if (typeof value !== 'string' && typeof value !== 'number') {
        return
      }

      if (key === 'flex' && isSingleToken(String(value))) {
        return
      }

      const values = shorthandAliasesForKey(value, allowImportant, preferInline)
      const [firstValue] = values

      const isUnfixableError =
        values.length === 1 && values[0]?.[1] === CANNOT_FIX

      if (
        values.length === 1 &&
        firstValue?.[0] === key &&
        (firstValue[1] === property.value.value ||
          firstValue[1] === property.value.value?.toString() ||
          firstValue[1] ===
            Number.parseInt(property.value.value as string, 10)) &&
        !isUnfixableError
      ) {
        return
      }

      if (
        key === 'gap' &&
        values.length === 2 &&
        values.every(
          ([, value]) =>
            'value' in property.value &&
            (value === property.value.value ||
              value === Number(property.value.value)),
        )
      ) {
        return
      }

      context.report({
        node: property,
        message: `Property shorthands using multiple values like "${key}: ${String(property.value.value)}" are not supported here. Separate into individual properties.`,
        data: {
          property: key,
        },
        fix: isUnfixableError
          ? null
          : (fixer) => {
              const sourceCode = getSourceCode(context)

              const startNodeIndentation = getNodeIndentation(
                sourceCode,
                property,
              )

              const propertiesText = values
                .map(
                  ([indexKey, value], index) =>
                    `${index > 0 ? `\n${startNodeIndentation}` : ''}${indexKey}: ${typeof value === 'string' ? `'${value}'` : (value?.toString() ?? '')}`,
                )
                .join(',')

              return fixer.replaceText(property, propertiesText)
            },
      })
    }

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
        if (!isApplyCallee(node.callee)) {
          return
        }

        for (const argument of node.arguments) {
          if (argument.type === 'ObjectExpression') {
            validateObject(argument)
          }
        }
      },

      'Program:exit': () => {
        importTracker.clear()
      },
    }
  },
}

import type { CallExpression } from 'estree'
import { CANNOT_FIX } from './utils/split-shorthands'
import { createBlockInlineTransformer } from './utils/split-shorthands'
import { createDirectionalTransformer } from './utils/split-shorthands'
import { createImportTracker } from './utils/create-import-tracker'
import { createSpecificTransformer } from './utils/split-shorthands'
import { getNodeIndentation } from './utils/get-node-indentation'
import { getSourceCode } from './utils/get-source-code'
import { isSingleToken } from './utils/split-shorthands'
import type { Node } from 'estree'
import type { ObjectExpression } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
//
