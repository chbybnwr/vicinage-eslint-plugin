export { createImportTracker as default }

function createImportTracker(
  importsToLookFor: (string | { from: string; as: string })[],
): {
  ImportDeclaration: (node: ImportDeclarationNode) => void
  isStylexDefaultImport: (name: string) => boolean
  isStylexNamedImport: (importName: string, name: string) => boolean
  clear: () => void
} {
  const styleXDefaultImports = new Set<string>()
  const styleXNamedImports = new Map<string, Set<string>>()

  function ImportDeclaration(node: ImportDeclarationNode) {
    if (
      // node.source.type !== 'Literal' ||
      typeof node.source.value !== 'string'
    ) {
      return
    }

    const foundImportSource = importsToLookFor.find((importSource) => {
      if (typeof importSource === 'string') {
        return importSource === node.source.value
      }

      return importSource.from === node.source.value
    })

    if (!foundImportSource) {
      return
    }

    if (typeof foundImportSource === 'string') {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === 'ImportDefaultSpecifier' ||
          specifier.type === 'ImportNamespaceSpecifier'
        ) {
          styleXDefaultImports.add(specifier.local.name)
        }

        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier'
        ) {
          const importName = specifier.imported.name

          if (!styleXNamedImports.has(importName)) {
            styleXNamedImports.set(importName, new Set())
          }

          styleXNamedImports.get(importName)?.add(specifier.local.name)
        }
      }
    }

    if (typeof foundImportSource === 'object') {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          specifier.imported.name === foundImportSource.as
        ) {
          styleXDefaultImports.add(specifier.local.name)
        }
      }
    }
  }

  function isStylexDefaultImport(name: string): boolean {
    return styleXDefaultImports.has(name)
  }

  function isStylexNamedImport(importName: string, name: string): boolean {
    return styleXNamedImports.get(importName)?.has(name) ?? false
  }

  function clear() {
    styleXDefaultImports.clear()
    styleXNamedImports.clear()
  }

  return {
    ImportDeclaration,
    isStylexDefaultImport,
    isStylexNamedImport,
    clear,
  }
}

import type { ImportDeclaration as ImportDeclarationNode } from 'estree'
//
