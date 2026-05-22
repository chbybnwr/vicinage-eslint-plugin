export { noConflictingProperties }

const defaultValidImports = ['vicinage']
const stylingProperties = new Set(['style', 'class', 'className'])

const noConflictingProperties: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow using `className` or `style` props on elements that spread `apply()`',
      recommended: true,
    },
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
          //   default: defaultValidImports,
          // },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context: Rule.RuleContext) => {
    // const options = context.options as { validImports: string[] }[]
    // const validImports = options[0]?.validImports ?? defaultValidImports
    // const importTracker = createImportTracker(validImports)
    const importTracker = createImportTracker(defaultValidImports)

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

    return {
      Program: (node) => {
        for (const part of node.body) {
          if (part.type === 'ImportDeclaration') {
            importTracker.ImportDeclaration(part)
          }
        }
      },

      JSXOpeningElement: (node: Node | JSXOpeningElement) => {
        if (!(node.type === 'JSXOpeningElement')) {
          return
        }

        const hasPropertiesSpread = node.attributes.some(
          (attribute) =>
            attribute.type === 'JSXSpreadAttribute' &&
            attribute.argument.type === 'CallExpression' &&
            isApplyCallee(attribute.argument.callee),
        )

        if (!hasPropertiesSpread) {
          return
        }

        for (const attribute of node.attributes) {
          if (
            attribute.type === 'JSXAttribute' &&
            attribute.name.type === 'JSXIdentifier' &&
            'name' in attribute.name &&
            stylingProperties.has(attribute.name.name)
          ) {
            context.report({
              node: attribute,
              message:
                'The `{{propName}}` prop should not be used when spreading `apply()` to avoid conflicts.',
              data: { propName: attribute.name.name },
            })
          } else if (
            attribute.type === 'JSXSpreadAttribute' &&
            attribute.argument.type === 'ObjectExpression'
          ) {
            for (const property of attribute.argument.properties) {
              if (
                property.type === 'Property' &&
                !property.computed &&
                property.key.type === 'Identifier' &&
                stylingProperties.has(property.key.name)
              ) {
                context.report({
                  node: property,
                  message:
                    'The `{{propName}}` prop should not be used when spreading `apply()` to avoid conflicts.',
                  data: { propName: property.key.name },
                })
              }
            }
          }
        }
      },

      'Program:exit': () => {
        importTracker.clear()
      },
    }
  },
}

interface JSXIdentifier {
  type: 'JSXIdentifier'
  name: string
}

interface JSXAttribute {
  type: 'JSXAttribute'
  name: JSXIdentifier | { type: string }
}

interface JSXSpreadAttribute {
  type: 'JSXSpreadAttribute'
  argument: Node
}

interface JSXOpeningElement {
  type: 'JSXOpeningElement'
  attributes: readonly (JSXAttribute | JSXSpreadAttribute)[]
}

import { createImportTracker } from './utils/create-import-tracker'
import type { Node } from 'estree'
import type { Rule } from 'eslint'
//
