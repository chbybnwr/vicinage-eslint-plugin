export { validStyles }

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

type ValidationResult =
  | RuleResponse
  | (Rule.ReportDescriptor & {
      isSpecialCase: true
    })

const showError =
  (message: string): RuleCheck =>
  () => ({ message })

// Maps camelCase CSS shorthand property names to the hyphenated names
// used by splitSpecificShorthands
const shorthandExpansionMap: Record<string, string> = {
  animation: 'animation',
  font: 'font',
  gap: 'gap',
  gridArea: 'grid-area',
  gridColumn: 'grid-column',
  gridRow: 'grid-row',
  gridTemplate: 'grid-template',
  gridGap: 'gap',
}

const LEGACY_CONDITIONAL_SHORTHAND_FIXERS = new Set(['animation', 'font'])

function shouldEnableLegacyConditionalShorthandFixer(
  propertyKey: string,
): boolean {
  return !LEGACY_CONDITIONAL_SHORTHAND_FIXERS.has(propertyKey)
}

const LEGACY_CONDITIONAL_REPLACEMENT_FIXERS = new Set([
  'border',
  'borderTop',
  'borderBlockStart',
  'borderEnd',
  'borderInlineEnd',
  'borderRight',
  'borderBottom',
  'borderBlockEnd',
  'borderStart',
  'borderInlineStart',
  'borderLeft',
])

const NUMERIC_LITERAL_VALUE_REGEX = /^[+-]?(?:\d+|\d*\.\d+)$/u

const NUMERIC_LITERAL_PROPERTIES = new Set([
  'rowGap',
  'columnGap',
  'lineHeight',
  'fontWeight',
  'animationIterationCount',
])

const serializeValue = (
  propertyKey: string,
  value: number | string,
): string => {
  if (typeof value === 'number') {
    return String(value)
  }

  if (
    NUMERIC_LITERAL_PROPERTIES.has(propertyKey) &&
    NUMERIC_LITERAL_VALUE_REGEX.test(value)
  ) {
    return String(Number(value))
  }

  // Escape single quotes within the string
  const escaped = value.replaceAll('\\', '\\\\').replaceAll("'", String.raw`\'`)

  return `'${escaped}'`
}

const formatExpandedProperties = (
  property: Readonly<Property>,
  expanded: readonly Readonly<[string, number | string]>[],
  context?: Rule.RuleContext,
): string => {
  const sourceCode = context == null ? undefined : getSourceCode(context)
  const properties = expanded.map(
    ([key, value]) => `${key}: ${serializeValue(key, value)}`,
  )

  return formatPropertiesWithNodeIndentation(property, properties, sourceCode)
}

function showErrorWithFix(message: string, propertyKey: string): RuleCheck {
  return function (
    node: Readonly<Expression | Pattern>,
    _variables?: Variables,
    property?: Readonly<Property>,
    context?: Rule.RuleContext,
  ): RuleResponse {
    const response: NonNullable<RuleResponse> = { message }
    const shorthandProperty = shorthandExpansionMap[propertyKey]

    if (
      shorthandProperty == null ||
      node.type !== 'Literal' ||
      property == null
    ) {
      return response
    }

    const value = node.value

    if (typeof value !== 'string' && typeof value !== 'number') {
      return response
    }

    const expanded = splitSpecificShorthands(shorthandProperty, String(value))

    if (expanded.length <= 1 && expanded[0]?.[1] !== CANNOT_FIX) {
      // Single value that's unchanged — no expansion available
      return response
    }

    if (expanded.length === 1 && expanded[0]?.[1] === CANNOT_FIX) {
      // Cannot be auto-fixed
      return response
    }

    const propertiesText = formatExpandedProperties(property, expanded, context)

    const fixFunction = (fixer: Rule.RuleFixer) =>
      fixer.replaceText(property, propertiesText)

    // animation is suggest-only since animationName needs a keyframes() reference
    if (propertyKey !== 'animation') {
      response.fix = fixFunction
    }

    response.suggest = {
      desc: `Split '${propertyKey}' shorthand into individual longhand properties?`,
      fix: fixFunction,
    }

    return response
  }
}

/**
 * Check if a file has a valid extension for StyleX variable imports.
 *
 * `.stylex`: used when importing `defineVars` or `defineConsts` variables. This prevents
 *   the linter/compiler from marking imports as unresolved and allows computed
 *   keys in those cases.
 *
 *  `.stylex.const`: used when importing `defineConsts` constants. This prevents
 *   the linter/compiler from marking imports as unresolved and allows computed
 *   keys in those cases.
 *
 * `.transformed`: used for files that have already been processed by a custom
 *   transform that pre-resolve StyleX variables to silence ESLint/compiler errors.
 *
 */
function isValidStylexResolvedVariablesFileExtension(
  filename: string,
  themeFileExtension: string,
) {
  const baseExtensions = [
    themeFileExtension,
    `${themeFileExtension}.const`,
    '.transformed',
  ]
  const extensions = ['.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs']

  return ['', ...extensions].some((extension) =>
    baseExtensions.some((base) => filename.endsWith(`${base}${extension}`)),
  )
}

function getOverrideErrorRule(reason: string, propertyKey: string) {
  return shorthandExpansionMap[propertyKey] != null &&
    shouldEnableLegacyConditionalShorthandFixer(propertyKey)
    ? showErrorWithFix(reason, propertyKey)
    : showError(reason)
}

const validStyles: Rule.RuleModule = {
  meta: {
    type: 'problem',
    hasSuggestions: true,
    fixable: 'code',
    docs: {
      description: 'Enforce that you create valid stylex styles',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          validStylexImports: {
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
          allowRawCSSVars: {
            type: 'boolean',
            default: true,
          },
          propLimits: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                limit: {
                  oneOf: [
                    { type: 'null' },
                    { type: 'string' },
                    { type: 'number' },
                    {
                      type: 'array',
                      items: {
                        oneOf: [
                          { type: 'null' },
                          { type: 'string' },
                          { type: 'number' },
                        ],
                      },
                    },
                  ],
                },
                reason: { type: 'string' },
              },
            },
          },
        },
      },
    ],
  },

  create: (context: Rule.RuleContext) => {
    const variables = new Map<string, Expression | 'ARG'>()
    const dynamicStyleVariables = new Set<string>()
    const options = context.options[0] ?? {}
    const themeFileExtension = options.themeFileExtension ?? '.stylex'

    type PropertyLimits = Record<
      string,
      {
        limit: null | string | number | (string | number)[]
        reason: string
      }
    >

    interface Schema {
      validStylexImports: (
        | string
        | {
            from: string
            as: string
          }
      )[]
      allowRawCSSVars: boolean
      propLimits?: PropertyLimits
    }

    const {
      validStylexImports = ['stylex', '@stylexjs/stylex'],
      allowRawCSSVars: allowRawCSVariables = true,
      propLimits: propertyLimits = {},
    }: Schema = context.options[0] ?? {}

    const validImports = new Set(['vicinage'])

    const stylexResolvedVariablesTokenImports = new Set<string>()

    // Track same-file defineVars/defineVarsNested/defineConstsNested declarations.
    const currentFilename = context.filename
    const isStylexFile = isValidStylexResolvedVariablesFileExtension(
      currentFilename,
      themeFileExtension,
    )

    const styleXDefaultImports = new Set<string>()
    const styleXCreateImports = new Set<string>()
    const styleXKeyframesImports = new Set<string>()
    const styleXPositionTryImports = new Set<string>()
    const styleXWhenImports = new Set<string>()

    const overrides: PropertyLimits = propertyLimits

    const CSSPropertiesWithOverrides: Record<string, RuleCheck> = {
      ...CSSProperties,
      // TODO change this to a special function that looks for stylex.keyframes call
      animationName: makeUnionRule(
        makeLiteralRule('none'),
        isAnimationName(styleXDefaultImports, styleXKeyframesImports),
        all,
      ),
      positionTryFallbacks: makeUnionRule(
        makeLiteralRule('none'),
        isCSSVariable,
        isPositionTryFallbacks(styleXDefaultImports, styleXPositionTryImports),
        all,
      ),
    }

    for (const [overrideKey, { limit, reason }] of Object.entries(overrides)) {
      if (limit === null) {
        // For properties with known shorthand expansions, provide auto-fixers
        if (overrideKey.includes('*') || overrideKey.includes('+')) {
          for (const key in CSSPropertiesWithOverrides) {
            if (micromatch.isMatch(key, overrideKey)) {
              CSSPropertiesWithOverrides[key] = getOverrideErrorRule(
                reason,
                key,
              )
            }
          }
        } else {
          CSSPropertiesWithOverrides[overrideKey] = getOverrideErrorRule(
            reason,
            overrideKey,
          )
        }

        continue
      }

      const overrideValue =
        limit === '*'
          ? makeUnionRule(isString, isNumber, all)
          : limit === 'string'
            ? makeUnionRule(isString, all)
            : limit === 'number'
              ? makeUnionRule(isNumber, all)
              : typeof limit === 'string' || typeof limit === 'number'
                ? makeUnionRule(limit, all)
                : Array.isArray(limit)
                  ? makeUnionRule(
                      ...limit.map((l) => {
                        if (l === '*') {
                          return makeUnionRule(isString, isNumber)
                        }

                        if (l === 'string') {
                          return isString
                        }

                        if (l === 'number') {
                          return isNumber
                        }

                        return l
                      }),
                      all,
                    )
                  : undefined

      if (overrideValue === undefined) {
        // skip
        continue
      }

      if (overrideKey.includes('*') || overrideKey.includes('+')) {
        for (const key in CSSPropertiesWithOverrides) {
          if (micromatch.isMatch(key, overrideKey)) {
            CSSPropertiesWithOverrides[key] = overrideValue
          }
        }
      } else {
        CSSPropertiesWithOverrides[overrideKey] = overrideValue
      }
    }

    function isApplyCallee(node: Node) {
      return (
        (node.type === 'MemberExpression' &&
          node.object.type === 'Identifier' &&
          styleXDefaultImports.has(node.object.name) &&
          node.property.type === 'Identifier' &&
          node.property.name === 'apply') ||
        (node.type === 'Identifier' && styleXCreateImports.has(node.name))
      )
    }

    function isStyleDeclaration(node: Readonly<Node>) {
      return (
        node.type === 'CallExpression' &&
        isApplyCallee(node.callee) &&
        node.arguments.length > 0
      )
    }

    function validateStyleValue(
      valueNode: Expression | Pattern,
      variablesWithFunctionArguments: Variables,
      style: Property,
      styleKey: Expression | PrivateIdentifier,
      propertyKey: string,
      ruleChecker: RuleCheck,
    ): ValidationResult | null {
      if (valueNode.type === 'ArrowFunctionExpression') {
        return null
      }

      // For: condition ? <style-value> : <style-value>
      if (valueNode.type === 'ConditionalExpression') {
        const trueCheck = validateStyleValue(
          valueNode.consequent,
          variablesWithFunctionArguments,
          style,
          styleKey,
          propertyKey,
          ruleChecker,
        )

        if (trueCheck != null) {
          return trueCheck
        }

        const falseCheck = validateStyleValue(
          valueNode.alternate,
          variablesWithFunctionArguments,
          style,
          styleKey,
          propertyKey,
          ruleChecker,
        )

        if (falseCheck != null) {
          return falseCheck
        }

        return null
      }

      // For: color: "blue" || "green" or zIndex: var ?? 10
      if (
        valueNode.type === 'LogicalExpression' &&
        ['||', '??', '&&'].includes(valueNode.operator)
      ) {
        if (['||', '??'].includes(valueNode.operator)) {
          const leftCheck = validateStyleValue(
            valueNode.left,
            variablesWithFunctionArguments,
            style,
            styleKey,
            propertyKey,
            ruleChecker,
          )

          if (leftCheck != null) {
            return leftCheck
          }
        }

        const rightCheck = validateStyleValue(
          valueNode.right,
          variablesWithFunctionArguments,
          style,
          styleKey,
          propertyKey,
          ruleChecker,
        )

        if (rightCheck != null) {
          return rightCheck
        }

        return null
      }

      if (
        (propertyKey === 'float' || propertyKey === 'clear') &&
        valueNode.type === 'Literal' &&
        typeof valueNode.value === 'string' &&
        (valueNode.value === 'start' || valueNode.value === 'end')
      ) {
        const replacement =
          valueNode.value === 'start' ? 'inline-start' : 'inline-end'

        return {
          node: valueNode,
          loc: valueNode.loc!,
          message: `The value "${valueNode.value}" is not a standard CSS value for "${propertyKey}". Did you mean "${replacement}"?`,
          fix: (fixer) => fixer.replaceText(valueNode, `'${replacement}'`),
          suggest: [
            {
              desc: `Replace "${valueNode.value}" with "${replacement}"?`,
              fix: (fixer) => fixer.replaceText(valueNode, `'${replacement}'`),
            },
          ],
          isSpecialCase: true,
        }
      }

      const check = ruleChecker(
        valueNode,
        variablesWithFunctionArguments,
        style,
        context,
      )

      if (check != null) {
        return check
      }

      if (
        valueNode.type === 'Literal' &&
        typeof valueNode.value === 'string' &&
        isWhiteSpaceOrEmpty(valueNode.value) &&
        'name' in styleKey &&
        styleKey.name !== 'content'
      ) {
        return {
          node: valueNode,

          loc: valueNode.loc!,
          message:
            'The empty string is not allowed. Use `null` to reset a style.',
          suggest: [
            {
              desc: 'Replace empty string with `null`?',
              fix: (fixer) => fixer.replaceText(valueNode, 'null'),
            },
          ],
          isSpecialCase: true,
        }
      }

      return null
    }

    function checkStyleProperty(
      style: Node,
      level: number,
      propertyName: null | string,
      outerIsPseudoElement: boolean,
    ): void {
      // currently ignoring preset spreads.
      if (style.type === 'Property') {
        // const styleAsProperty: Property = style;
        if (style.value.type === 'ObjectExpression') {
          const styleValue: ObjectExpression = style.value

          // TODO: Remove this soon
          // But we want to make sure that the same "condition" isn't repeated
          if (
            level > 0 &&
            propertyName == null &&
            // Allow exactly one inner level when the outer/top nested layer is a pseudo-element
            !(outerIsPseudoElement && level === 1)
          ) {
            context.report({
              node: style.value,
              loc: style.value.loc,
              message: 'You cannot nest styles more than one level deep',
            } as Rule.ReportDescriptor)

            return
          }

          const { key } = style

          const keyName =
            key.type === 'Literal'
              ? key.value
              : key.type === 'Identifier'
                ? style.computed
                  ? resolveKey(key, variables)
                  : key.name
                : null

          if (
            isStylexDefineVariablesToken(
              key,
              stylexResolvedVariablesTokenImports,
            )
          ) {
            return
          }

          if (
            typeof keyName !== 'string' ||
            (key.type !== 'Literal' && key.type !== 'Identifier')
          ) {
            context.report({
              node: key,
              loc: key.loc,
              message: 'Keys must be strings',
            } as Rule.ReportDescriptor)

            return
          }

          if (keyName.startsWith('@') || keyName.startsWith(':')) {
            if (level === 0) {
              const ruleCheck = pseudoElements(key, variables)

              if (ruleCheck !== undefined) {
                if (keyName.startsWith('::')) {
                  context.report({
                    node: style.value,
                    loc: style.value.loc,
                    message: `Unknown pseudo element "${keyName}"`,
                  } as Readonly<Rule.ReportDescriptor>)

                  return
                }

                context.report({
                  node: style.value,
                  loc: style.value.loc,
                  message:
                    'Pseudo Classes, Media Queries and other At Rules should be nested as conditions within style properties. Only Pseudo Elements (::after) are allowed at the top-level',
                } as Readonly<Rule.ReportDescriptor>)

                return
              }
            } else {
              const ruleCheck = pseudoClassesAndAtRules(key, variables)

              if (ruleCheck !== undefined) {
                context.report({
                  node: style.value,
                  loc: style.value.loc,
                  message:
                    'Invalid Pseudo class or At Rule used for conditional style value',
                } as Readonly<Rule.ReportDescriptor>)

                return
              }
            }
          }

          for (const property of styleValue.properties)
            checkStyleProperty(
              property,
              level + 1,
              propertyName ??
                (keyName.startsWith('@') ||
                keyName.startsWith(':') ||
                keyName === 'default'
                  ? null
                  : keyName),
              outerIsPseudoElement || keyName.startsWith('::'),
            )

          return
        }

        let styleKey: Expression | PrivateIdentifier = style.key

        if (
          isStylexDefineVariablesToken(
            styleKey,
            stylexResolvedVariablesTokenImports,
          )
        ) {
          return
        }

        let isStylexWhenCall = false

        if (
          style.computed &&
          styleKey.type !== 'Literal' &&
          styleKey.type === 'CallExpression' &&
          styleKey.callee.type === 'MemberExpression'
        ) {
          const calleeObject = styleKey.callee.object
          const calleeProperty = styleKey.callee.property

          isStylexWhenCall =
            (calleeObject.type === 'MemberExpression' &&
              calleeObject.object.type === 'Identifier' &&
              styleXDefaultImports.has(calleeObject.object.name) &&
              calleeObject.property.type === 'Identifier' &&
              calleeObject.property.name === 'when' &&
              calleeProperty.type === 'Identifier') ||
            (calleeObject.type === 'Identifier' &&
              styleXWhenImports.has(calleeObject.name) &&
              calleeProperty.type === 'Identifier')

          if (!isStylexWhenCall) {
            const value = evaluate(styleKey, variables)

            if (value == null) {
              context.report({
                node: style.key,
                loc: style.key.loc,
                message: 'Computed key cannot be resolved.',
              } as Rule.ReportDescriptor)

              return
            } else if (value === 'ARG') {
              context.report({
                node: style.key,
                loc: style.key.loc,
                message: 'Computed key cannot depend on function argument',
              } as Rule.ReportDescriptor)

              return
            }

            styleKey = value
          }
        }

        if (
          styleKey.type !== 'Literal' &&
          styleKey.type !== 'Identifier' &&
          !isStylexWhenCall
        ) {
          context.report({
            node: styleKey,
            loc: styleKey.loc,
            message:
              'All keys in a stylex object must be static literal values.',
          } as Rule.ReportDescriptor)

          return
        }

        const key =
          propertyName ??
          (styleKey.type === 'Identifier'
            ? styleKey.name
            : 'value' in styleKey
              ? styleKey.value
              : null)

        if (typeof key !== 'string') {
          context.report({
            node: styleKey,
            loc: styleKey.loc,
            message:
              'All keys in a stylex object must be static literal string values.',
          } as Rule.ReportDescriptor)

          return
        }

        if (CSSPropertyReplacements[key] != null) {
          const propertyCheck: RuleCheck = CSSPropertyReplacements[key]

          const check = propertyCheck(style.value, variables, style, context)

          if (check != null) {
            const { message } = check
            const { suggest } = check
            let { fix } = check

            if (LEGACY_CONDITIONAL_REPLACEMENT_FIXERS.has(key)) {
              fix = undefined
            }

            const diagnostic: Rule.ReportDescriptor = {
              node: style,
              loc: style.loc!,
              message,
              fix: fix ?? undefined,
              suggest: suggest == null ? undefined : [suggest],
            }

            context.report(diagnostic)

            return
          }
        }

        const ruleChecker = CSSPropertiesWithOverrides[key]

        if (ruleChecker == null) {
          if (allowRawCSVariables && micromatch.isMatch(key, '--*')) {
            return
          }

          const closestKey = CSSPropertyKeys.find((cssProperty) => {
            const distance = getDistance(key, cssProperty, 2)

            return distance <= 2
          })

          context.report({
            node: style.key,
            loc: style.key.loc,
            message: 'This is not a key that is allowed',
            suggest:
              closestKey == null
                ? undefined
                : [
                    {
                      desc: `Did you mean "${closestKey}"?`,
                      fix: (fixer) => {
                        if (style.key.type === 'Identifier') {
                          return fixer.replaceText(style.key, closestKey)
                        } else if (
                          style.key.type === 'Literal' &&
                          (typeof style.key.value === 'string' ||
                            typeof style.key.value === 'number' ||
                            typeof style.key.value === 'boolean' ||
                            style.key.value == null)
                        ) {
                          const styleKey: Literal = style.key
                          const { raw } = style.key

                          if (raw != null) {
                            const quoteType = raw.slice(0, 1)

                            return fixer.replaceText(
                              styleKey,
                              `${quoteType}${closestKey}${quoteType}`,
                            )
                          }
                        }

                        return null
                      },
                    },
                  ],
          } as Rule.ReportDescriptor)

          return
        }

        if (typeof ruleChecker !== 'function') {
          throw new TypeError(`CSSProperties[${key}] is not a function`)
        }

        const isReferencingStylexDefineVariablesTokens =
          stylexResolvedVariablesTokenImports.size > 0 &&
          isStylexDefineVariablesToken(
            style.value,
            stylexResolvedVariablesTokenImports,
          )

        if (!isReferencingStylexDefineVariablesTokens) {
          let variablesWithFunctionArguments: Map<string, Expression | 'ARG'> =
            variables

          if (dynamicStyleVariables.size > 0) {
            variablesWithFunctionArguments = new Map()

            for (const [key, value] of variables) {
              variablesWithFunctionArguments.set(key, value)
            }

            for (const key of dynamicStyleVariables) {
              variablesWithFunctionArguments.set(key, 'ARG')
            }
          }

          const check = validateStyleValue(
            style.value,
            variablesWithFunctionArguments,
            style,
            styleKey,
            key,
            ruleChecker,
          )

          if (check != null) {
            if ('isSpecialCase' in check) {
              context.report({
                // @ts-expect-error FIXME: please
                node: check.node,
                // @ts-expect-error FIXME: please
                loc: check.loc,
                // @ts-expect-error FIXME: please
                message: check.message,
                fix: check.fix,
                suggest: check.suggest,
              })

              return
            }

            const { message } = check
            let { fix, suggest } = check

            // If the property has a known shorthand expansion and no fix yet,
            // try to attach one
            if (
              fix == null &&
              suggest == null &&
              shorthandExpansionMap[key] != null &&
              shouldEnableLegacyConditionalShorthandFixer(key) &&
              style.value.type === 'Literal'
            ) {
              const value = style.value.value

              if (typeof value === 'string' || typeof value === 'number') {
                const shorthandProperty = shorthandExpansionMap[key]
                const expanded = splitSpecificShorthands(
                  shorthandProperty,
                  String(value),
                )
                const canFix =
                  expanded.length > 1 ||
                  (expanded.length === 1 && expanded[0]?.[1] === CANNOT_FIX)
                const isFixable =
                  canFix &&
                  !(expanded.length === 1 && expanded[0]?.[1] === CANNOT_FIX)

                if (isFixable) {
                  const propertiesText = formatExpandedProperties(
                    style,
                    expanded,
                    context,
                  )
                  const fixFunction = (fixer: Rule.RuleFixer) =>
                    fixer.replaceText(style, propertiesText)

                  // animation is suggest-only since animationName needs keyframes()
                  if (key !== 'animation') {
                    fix = fixFunction
                  }

                  suggest = {
                    desc: `Split '${key}' shorthand into individual longhand properties?`,
                    fix: fixFunction,
                  }
                }
              }
            }

            const isBackgroundBlendModeFormatError =
              key === 'backgroundBlendMode' &&
              typeof message === 'string' &&
              message.includes(
                'backgroundBlendMode values must be separated by a comma and a space',
              )

            const finalMessage = isBackgroundBlendModeFormatError
              ? message.split('\n')[0]
              : `${key} value must be one of:\n${message}${
                  key === 'lineHeight'
                    ? '\nBe careful when fixing: lineHeight: 10px is not the same as lineHeight: 10'
                    : ''
                }`

            context.report({
              node: style.value,
              loc: style.value.loc,
              message: finalMessage,
              fix: fix ?? undefined,
              suggest: suggest == null ? undefined : [suggest],
            } as Rule.ReportDescriptor)
          }
        }
      }
    }

    return {
      Program(node: Program) {
        // Keep track of all the top-level local variable declarations
        // This is because stylex allows you to use local constants in your styles

        const collection = node.body.filter(
          (part) => part.type === 'VariableDeclaration',
        )

        const variableDeclarators = collection.flatMap(
          (constDecl) => constDecl.declarations,
        )
        const requires = []
        const others = []

        for (const declarator of variableDeclarators) {
          if (
            declarator.init?.type === 'CallExpression' &&
            declarator.init.callee.type === 'Identifier' &&
            declarator.init.callee.name === 'require'
          ) {
            requires.push(declarator)
          } else {
            others.push(declarator)
          }
        }

        for (const decl of requires) {
          // detect requires of "stylex" and "@stylexjs/stylex"
          if (
            decl.init?.type === 'CallExpression' &&
            decl.init.callee.type === 'Identifier' &&
            decl.init.callee.name === 'require' &&
            decl.init.arguments.length === 1 &&
            (() => {
              const [firstArgument] = decl.init.arguments

              return (
                firstArgument?.type === 'Literal' &&
                typeof firstArgument.value === 'string' &&
                validImports.has(firstArgument.value)
              )
            })()
          ) {
            if (decl.id.type === 'Identifier') {
              styleXDefaultImports.add(decl.id.name)
            }

            if (decl.id.type === 'ObjectPattern') {
              for (const property of decl.id.properties) {
                if (
                  property.type === 'Property' &&
                  property.key.type === 'Identifier' &&
                  property.key.name === 'apply' &&
                  !property.computed &&
                  property.value.type === 'Identifier'
                ) {
                  styleXCreateImports.add(property.value.name)
                }
              }
            }
          }
        }

        for (const decl of others.filter(
          (decl) => decl.id.type === 'Identifier',
        )) {
          const id: Identifier | null =
            decl.id.type === 'Identifier' ? decl.id : null
          const { init } = decl

          if (id != null && init != null) {
            variables.set(id.name, init)
          }
        }
      },

      ImportDeclaration(node: ImportDeclaration) {
        if (typeof node.source.value !== 'string') {
          return
        }

        const sourceValue = node.source.value

        const foundVicinageImportSource = validImports.has(sourceValue)

        const foundStylexImportSource = validStylexImports.find(
          (importSource) => {
            if (typeof importSource === 'string') {
              return importSource === sourceValue
            }

            return importSource.from === sourceValue
          },
        )

        const isVicinageImport = foundVicinageImportSource
        const isStylexImport = foundStylexImportSource !== undefined
        const isStylexResolvedVariablesImport =
          isValidStylexResolvedVariablesFileExtension(
            sourceValue,
            themeFileExtension,
          )

        if (
          !(
            isVicinageImport ||
            isStylexImport ||
            isStylexResolvedVariablesImport
          )
        ) {
          return
        }

        if (isVicinageImport) {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === 'ImportSpecifier' &&
              'name' in specifier.imported &&
              specifier.imported.name === 'apply'
            ) {
              styleXCreateImports.add(specifier.local.name)
            }
          }
        }

        if (isStylexImport) {
          if (typeof foundStylexImportSource === 'string') {
            for (const specifier of node.specifiers) {
              if (
                specifier.type === 'ImportDefaultSpecifier' ||
                specifier.type === 'ImportNamespaceSpecifier'
              ) {
                styleXDefaultImports.add(specifier.local.name)
              }

              if (
                !(
                  specifier.type === 'ImportSpecifier' &&
                  'name' in specifier.imported
                )
              ) {
                continue
              }

              if (specifier.imported.name === 'keyframes') {
                styleXKeyframesImports.add(specifier.local.name)
              }

              if (specifier.imported.name === 'positionTry') {
                styleXPositionTryImports.add(specifier.local.name)
              }

              if (specifier.imported.name === 'when') {
                styleXWhenImports.add(specifier.local.name)
              }
            }
          }

          if (typeof foundStylexImportSource === 'object') {
            for (const specifier of node.specifiers) {
              if (
                specifier.type === 'ImportSpecifier' &&
                'name' in specifier.imported &&
                specifier.imported.name === foundStylexImportSource.as
              ) {
                styleXDefaultImports.add(specifier.local.name)
              }
            }
          }
        }

        if (isStylexResolvedVariablesImport) {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              stylexResolvedVariablesTokenImports.add(specifier.local.name)
            }
          }
        }
      },
      // Track same-file token declarations in .stylex files.
      // This handles the case where defineVars/defineVarsNested/defineConstsNested
      // is defined and consumed via stylex.create in the same .stylex file.
      ExportNamedDeclaration(node): void {
        if (isStylexFile && node.declaration?.type === 'VariableDeclaration') {
          for (const decl of node.declaration.declarations) {
            if (decl.id.type === 'Identifier') {
              stylexResolvedVariablesTokenImports.add(decl.id.name)
            }
          }
        }
      },
      CallExpression(node: CallExpression & Rule.NodeParentExtension) {
        if (!isStyleDeclaration(node)) {
          return
        }

        for (const argument of node.arguments) {
          // const loc: ?AST['SourceLocation'] = namespaces.loc;
          if (argument.type !== 'ObjectExpression') {
            continue
          }

          for (const property of argument.properties) {
            checkStyleProperty(property, 0, null, false)
          }

          // for (const namespace of namespaces.properties) {
          //   if (namespace.type !== 'Property') {
          //     context.report({
          //       node: namespace,
          //       loc: namespace.loc,
          //       message: 'Styles cannot be spread objects',
          //     })
          //     continue
          //   }

          //   let styles = namespace.value

          //   if (styles.type !== 'ObjectExpression') {
          //     if (
          //       styles.type === 'ArrowFunctionExpression' &&
          //       (styles.body.type === 'ObjectExpression' ||
          //         // $FlowFixMe[invalid-compare]
          //         (styles.body.type === 'TSAsExpression' &&
          //           // $FlowFixMe[invalid-compare]
          //           styles.body.expression.type === 'ObjectExpression'))
          //     ) {
          //       const { params } = styles
          //       styles = styles.body

          //       // $FlowFixMe[invalid-compare]
          //       if (styles.type === 'TSAsExpression') {
          //         styles = styles.expression
          //       }

          //       if (params.some((param) => param.type !== 'Identifier')) {
          //         for (const param of params.filter(
          //           (param) => param.type !== 'Identifier',
          //         )) {
          //           context.report({
          //             node: param,
          //             loc: param.loc,
          //             message:
          //               'Dynamic Styles can only accept named parameters. Destructuring, spreading or default parameters are not allowed.',
          //           })
          //         }

          //         continue
          //       }

          //       for (const param of params) {
          //         if (param.type === 'Identifier') {
          //           dynamicStyleVariables.add(param.name)
          //         }
          //       }
          //     } else {
          //       // This case should be already handled by type checking.
          //       continue
          //     }
          //   }

          //   for (const prop of styles.properties) {
          //     checkStyleProperty(prop, 0, null, false)
          //   }

          //   // Reset local variables.
          //   dynamicStyleVariables.clear()
          // }
        }
      },
      'Program:exit'() {
        variables.clear()
      },
    }
  },
}

import { all } from './reference/css-properties'
import type { CallExpression } from 'estree'
import { CANNOT_FIX } from './utils/split-shorthands'
import { CSSProperties } from './reference/css-properties'
import { CSSPropertyKeys } from './reference/css-properties'
import { CSSPropertyReplacements } from './reference/css-properties'
import { evaluate } from './utils/evaluate'
import type { Expression } from 'estree'
import { formatPropertiesWithNodeIndentation } from './utils/format-properties-with-node-indentation'
import { getDistance } from './utils/get-distance'
import { getSourceCode } from './utils/get-source-code'
import type { Identifier } from 'estree'
import type { ImportDeclaration } from 'estree'
import { isAnimationName } from './rules/is-animation-name'
import { isCSSVariable } from './rules/is-css-variable'
import { isNumber } from './rules/is-number'
import { isPositionTryFallbacks } from './rules/is-position-try-fallbacks'
import { isString } from './rules/is-string'
import { isStylexDefineVariablesToken as isStylexDefineVariablesToken } from './rules/is-stylex-resolved-variables-token'
import { isWhiteSpaceOrEmpty } from './utils/is-white-space-or-empty'
import type { Literal } from 'estree'
import { makeLiteralRule } from './rules/make-literal-rule'
import { makeUnionRule } from './rules/make-union-rule'
import micromatch from 'micromatch'
import type { Node } from 'estree'
import type { ObjectExpression } from 'estree'
import type { Pattern } from 'estree'
import type { PrivateIdentifier } from 'estree'
import type { Program } from 'estree'
import type { Property } from 'estree'
import { pseudoClassesAndAtRules } from './reference/css-properties'
import { pseudoElements } from './reference/css-properties'
import { resolveKey } from './utils/resolve-key'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import { splitSpecificShorthands } from './utils/split-shorthands'
import type { Variables } from '#/rules/types'
//
