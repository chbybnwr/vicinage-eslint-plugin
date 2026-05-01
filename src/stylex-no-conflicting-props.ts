export { stylexNoConflictingProps as default }

const stylexNoConflictingProps: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow using `className` or `style` props on elements that spread `stylex.props()`',
      // category: 'Best Practices',
      recommended: true,
    },
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
            default: ['stylex', '@stylexjs/stylex'],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context: Rule.RuleContext) => {
    const options = context.options as { validImports: string[] }[]

    const validImports = options[0]?.validImports ?? [
      'stylex',
      '@stylexjs/stylex',
    ]

    const importTracker = createImportTracker(validImports)

    function isStylexPropsCallee(node: Node) {
      return (
        (node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          importTracker.isStylexDefaultImport(node.object.name) &&
          node.property.type === 'Identifier' &&
          node.property.name === 'props') ||
        (node.type === 'Identifier' &&
          importTracker.isStylexNamedImport('props', node.name))
      )
    }

    return {
      ImportDeclaration: importTracker.ImportDeclaration,

      JSXOpeningElement: (node: Node | JSXOpeningElement) => {
        if (!(node.type === 'JSXOpeningElement')) {
          return
        }

        const hasStylexPropsSpread = node.attributes.some(
          (attr) =>
            attr.type === 'JSXSpreadAttribute' &&
            attr.argument.type === 'CallExpression' &&
            isStylexPropsCallee(attr.argument.callee),
        )

        if (!hasStylexPropsSpread) {
          return
        }

        for (const attr of node.attributes) {
          if (
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            'name' in attr.name &&
            (attr.name.name === 'className' || attr.name.name === 'style')
          ) {
            context.report({
              // $FlowFixMe[incompatible-type]
              node: attr,
              message:
                'The `{{propName}}` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
              data: { propName: attr.name.name },
            })
          } else if (
            attr.type === 'JSXSpreadAttribute' &&
            attr.argument.type === 'ObjectExpression'
          ) {
            for (const prop of attr.argument.properties) {
              if (
                prop.type === 'Property' &&
                !prop.computed &&
                prop.key.type === 'Identifier' &&
                (prop.key.name === 'className' || prop.key.name === 'style')
              ) {
                context.report({
                  // $FlowFixMe[incompatible-type]
                  node: prop,
                  message:
                    'The `{{propName}}` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
                  data: { propName: prop.key.name },
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

import createImportTracker from './utils/create-import-tracker'
import type { Node } from 'estree'
import type { Rule } from 'eslint'
//
