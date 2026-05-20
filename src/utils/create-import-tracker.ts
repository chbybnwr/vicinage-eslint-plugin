export { createImportTracker }

function createImportTracker(
  importsToLookFor: (string | { from: string; as: string })[],
): {
  ImportDeclaration: (node: ImportDeclarationNode) => void
  isDefaultImport: (name: string) => boolean
  isNamedImport: (importName: string, name: string) => boolean
  clear: () => void
} {
  const defaultImports = new Set<string>()
  const namedImports = new Map<string, Set<string>>()

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
          defaultImports.add(specifier.local.name)
        }

        if (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier'
        ) {
          const importName = specifier.imported.name

          if (!namedImports.has(importName)) {
            namedImports.set(importName, new Set())
          }

          namedImports.get(importName)?.add(specifier.local.name)
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
          defaultImports.add(specifier.local.name)
        }
      }
    }
  }

  function isDefaultImport(name: string): boolean {
    return defaultImports.has(name)
  }

  function isNamedImport(importName: string, name: string): boolean {
    return namedImports.get(importName)?.has(name) ?? false
  }

  function clear() {
    defaultImports.clear()
    namedImports.clear()
  }

  return {
    ImportDeclaration,
    isDefaultImport,
    isNamedImport,
    clear,
  }
}

import type { ImportDeclaration as ImportDeclarationNode } from 'estree'
//
