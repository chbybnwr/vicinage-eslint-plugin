export { noConflictingProps }

const defaultValidImports = ['vicinage']
const stylingProps = new Set(['style', 'class', 'className'])

const noConflictingProps: Rule.RuleModule = {
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
            // eslint-disable-next-line new-cap
            importTracker.ImportDeclaration(part)
          }
        }
      },

      JSXOpeningElement: (node: Node | JSXOpeningElement) => {
        if (!(node.type === 'JSXOpeningElement')) {
          return
        }

        const hasPropsSpread = node.attributes.some(
          (attr) =>
            attr.type === 'JSXSpreadAttribute' &&
            attr.argument.type === 'CallExpression' &&
            isApplyCallee(attr.argument.callee),
        )

        if (!hasPropsSpread) {
          return
        }

        for (const attr of node.attributes) {
          if (
            attr.type === 'JSXAttribute' &&
            attr.name.type === 'JSXIdentifier' &&
            'name' in attr.name &&
            stylingProps.has(attr.name.name)
          ) {
            context.report({
              // $FlowFixMe[incompatible-type]
              node: attr,
              message:
                'The `{{propName}}` prop should not be used when spreading `apply()` to avoid conflicts.',
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
                stylingProps.has(prop.key.name)
              ) {
                context.report({
                  // $FlowFixMe[incompatible-type]
                  node: prop,
                  message:
                    'The `{{propName}}` prop should not be used when spreading `apply()` to avoid conflicts.',
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

import { createImportTracker } from './utils/create-import-tracker'
import type { Node } from 'estree'
import type { Rule } from 'eslint'
//
