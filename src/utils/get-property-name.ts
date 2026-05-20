export { getPropertyName }

function isNullLiteral(node: Node) {
  return (
    node.type === 'Literal' &&
    node.value === null &&
    !('regex' in node) &&
    !('bigint' in node)
  )
}

function getStaticStringValue(node: Node): string | null {
  switch (node.type) {
    case 'Literal': {
      if (node.value === null) {
        if (isNullLiteral(node)) {
          return String(node.value) // "null"
        }

        if ('regex' in node) {
          return `/${node.regex.pattern}/${node.regex.flags}`
        }

        if ('bigint' in node) {
          return node.bigint
        }

        // Otherwise, this is an unknown literal. The function will return null.
      } else {
        return String(node.value)
      }

      break
    }

    case 'TemplateLiteral': {
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return node.quasis[0]!.value.cooked ?? null
      }

      break
    }

    // no default
  }

  return null
}

function getStaticPropertyName(node: Node | ChainExpression): string | null {
  // eslint-disable-next-line init-declarations
  let prop

  if (node.type === 'ChainExpression') {
    return getStaticPropertyName(node.expression)
  }

  switch (node.type) {
    case 'Property':

    // fallthrough
    case 'PropertyDefinition':

    // fallthrough
    case 'MethodDefinition': {
      prop = node.key

      break
    }

    case 'MemberExpression': {
      prop = node.property

      break
    }

    // no default
  }

  if (prop) {
    if (prop.type === 'Identifier' && !('computed' in node)) {
      return prop.name
    }

    if (prop.type === 'CallExpression') {
      const callee = getCalleeName(prop.callee)
      if (!callee) return null

      if (callee.startsWith('stylex.when') || callee.startsWith('when')) {
        const relation = callee.split('.').pop()
        const [arg] = prop.arguments
        if (!arg) return null

        return `:when:${relation ?? ''}${getStaticStringValue(arg) ?? ''}`
      }
    }

    return getStaticStringValue(prop)
  }

  return null
}

function getCalleeName(node: Node): string | null {
  const parts: string[] = []
  let current = node

  while (current.type === 'MemberExpression') {
    if (current.property.type === 'Identifier') {
      parts.unshift(current.property.name)
    }

    current = current.object
  }

  if (current.type === 'Identifier') {
    parts.unshift(current.name)
  }

  return parts.length > 0 ? parts.join('.') : null
}

function getPropertyName(node: Readonly<Property>): string | null {
  const staticName = getStaticPropertyName(node)

  return staticName ?? (node.key as { name: string | null }).name ?? null
}

import type { ChainExpression } from 'estree'
import type { Node } from 'estree'
import type { Property } from 'estree'
//
