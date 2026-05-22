export { validStyles }

/* eslint-disable no-magic-numbers */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-continue */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/no-keyword-prefix */
/* eslint-disable no-undefined */

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

const serializeValue = (propertyKey: string, val: number | string): string => {
  if (typeof val === 'number') {
    return String(val)
  }

  if (
    NUMERIC_LITERAL_PROPERTIES.has(propertyKey) &&
    NUMERIC_LITERAL_VALUE_REGEX.test(val)
  ) {
    return String(Number(val))
  }

  // Escape single quotes within the string
  const escaped = val.replaceAll('\\', '\\\\').replaceAll("'", String.raw`\'`)

  return `'${escaped}'`
}

const formatExpandedProperties = (
  prop: Readonly<Property>,
  expanded: readonly Readonly<[string, number | string]>[],
  context?: Rule.RuleContext,
): string => {
  const sourceCode = context == null ? undefined : getSourceCode(context)
  const properties = expanded.map(
    ([key, value]) => `${key}: ${serializeValue(key, value)}`,
  )

  return formatPropertiesWithNodeIndentation(prop, properties, sourceCode)
}

function showErrorWithFix(message: string, propertyKey: string): RuleCheck {
  return function (
    node: Readonly<Expression | Pattern>,
    _variables?: Variables,
    prop?: Readonly<Property>,
    context?: Rule.RuleContext,
  ): RuleResponse {
    const response: NonNullable<RuleResponse> = { message }
    const shorthandProp = shorthandExpansionMap[propertyKey]

    if (shorthandProp == null || node.type !== 'Literal' || prop == null) {
      return response
    }

    const val = node.value

    if (typeof val !== 'string' && typeof val !== 'number') {
      return response
    }

    const expanded = splitSpecificShorthands(shorthandProp, String(val))

    if (expanded.length <= 1 && expanded[0]?.[1] !== CANNOT_FIX) {
      // Single value that's unchanged — no expansion available
      return response
    }

    if (expanded.length === 1 && expanded[0]?.[1] === CANNOT_FIX) {
      // Cannot be auto-fixed
      return response
    }

    const newPropertiesText = formatExpandedProperties(prop, expanded, context)

    const fixFn = (fixer: Rule.RuleFixer) =>
      fixer.replaceText(prop, newPropertiesText)

    // animation is suggest-only since animationName needs a keyframes() reference
    if (propertyKey !== 'animation') {
      response.fix = fixFn
    }

    response.suggest = {
      desc: `Split '${propertyKey}' shorthand into individual longhand properties?`,
      fix: fixFn,
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
function isValidStylexResolvedVarsFileExtension(
  filename: string,
  themeFileExtension: string,
) {
  const baseExtensions = [
    themeFileExtension,
    `${themeFileExtension}.const`,
    '.transformed',
  ]
  const extensions = ['.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs']

  return ['', ...extensions].some((ext) =>
    baseExtensions.some((base) => filename.endsWith(`${base}${ext}`)),
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const themeFileExtension = options.themeFileExtension ?? '.stylex'

    type PropLimits = Record<
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
      propLimits?: PropLimits
    }

    const {
      validStylexImports = ['stylex', '@stylexjs/stylex'],
      allowRawCSSVars = true,
      propLimits = {},
    }: Schema = context.options[0] ?? {}

    const validImports = new Set(['vicinage'])

    const stylexResolvedVarsTokenImports = new Set<string>()

    // Track same-file defineVars/defineVarsNested/defineConstsNested declarations.
    const currentFilename =
      // @ts-expect-error FIXME: please
      context.getFilename == null ? '' : context.getFilename()
    const isStylexFile = isValidStylexResolvedVarsFileExtension(
      currentFilename,
      themeFileExtension,
    )

    const styleXDefaultImports = new Set<string>()
    const styleXCreateImports = new Set<string>()
    const styleXKeyframesImports = new Set<string>()
    const styleXPositionTryImports = new Set<string>()
    const styleXWhenImports = new Set<string>()

    const overrides: PropLimits = propLimits

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

    // eslint-disable-next-line guard-for-in
    for (const overrideKey in overrides) {
      // @ts-expect-error FIXME: please
      const { limit, reason } = overrides[overrideKey]

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
      varsWithFnArgs: Variables,
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
          varsWithFnArgs,
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
          varsWithFnArgs,
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
            varsWithFnArgs,
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
          varsWithFnArgs,
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

      const check = ruleChecker(valueNode, varsWithFnArgs, style, context)

      if (check != null) {
        return check
      }

      if (
        valueNode.type === 'Literal' &&
        typeof valueNode.value === 'string' &&
        isWhiteSpaceOrEmpty(valueNode.value) &&
        // @ts-expect-error FIXME: please
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
      propName: null | string,
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
            propName == null &&
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

          if (isStylexDefineVarsToken(key, stylexResolvedVarsTokenImports)) {
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

          for (const prop of styleValue.properties)
            checkStyleProperty(
              prop,
              level + 1,
              propName ??
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

        if (isStylexDefineVarsToken(styleKey, stylexResolvedVarsTokenImports)) {
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
            const val = evaluate(styleKey, variables)

            if (val == null) {
              context.report({
                node: style.key,
                loc: style.key.loc,
                message: 'Computed key cannot be resolved.',
              } as Rule.ReportDescriptor)

              return
            } else if (val === 'ARG') {
              context.report({
                node: style.key,
                loc: style.key.loc,
                message: 'Computed key cannot depend on function argument',
              } as Rule.ReportDescriptor)

              return
            }

            styleKey = val
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
          propName ??
          (styleKey.type === 'Identifier'
            ? styleKey.name
            : // @ts-expect-error FIXME: please
              styleKey.value)

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
          const propCheck: RuleCheck = CSSPropertyReplacements[key]

          const check = propCheck(style.value, variables, style, context)

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
          if (allowRawCSSVars && micromatch.isMatch(key, '--*')) {
            return
          }

          const closestKey = CSSPropertyKeys.find((cssProp) => {
            const distance = getDistance(key, cssProp, 2)

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

        const isReferencingStylexDefineVarsTokens =
          stylexResolvedVarsTokenImports.size > 0 &&
          isStylexDefineVarsToken(style.value, stylexResolvedVarsTokenImports)

        if (!isReferencingStylexDefineVarsTokens) {
          let varsWithFnArgs: Map<string, Expression | 'ARG'> = variables

          if (dynamicStyleVariables.size > 0) {
            varsWithFnArgs = new Map()

            for (const [key, value] of variables) {
              varsWithFnArgs.set(key, value)
            }

            for (const key of dynamicStyleVariables) {
              varsWithFnArgs.set(key, 'ARG')
            }
          }

          const check = validateStyleValue(
            style.value,
            varsWithFnArgs,
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
              const val = style.value.value

              if (typeof val === 'string' || typeof val === 'number') {
                const shorthandProp = shorthandExpansionMap[key]
                const expanded = splitSpecificShorthands(
                  shorthandProp,
                  String(val),
                )
                const canFix =
                  expanded.length > 1 ||
                  (expanded.length === 1 && expanded[0]?.[1] === CANNOT_FIX)
                const isFixable =
                  canFix &&
                  !(expanded.length === 1 && expanded[0]?.[1] === CANNOT_FIX)

                if (isFixable) {
                  const newPropertiesText = formatExpandedProperties(
                    style,
                    expanded,
                    context,
                  )
                  const fixFn = (fixer: Rule.RuleFixer) =>
                    fixer.replaceText(style, newPropertiesText)

                  // animation is suggest-only since animationName needs keyframes()
                  if (key !== 'animation') {
                    fix = fixFn
                  }

                  suggest = {
                    desc: `Split '${key}' shorthand into individual longhand properties?`,
                    fix: fixFn,
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

        // const body = node.body;
        // for (let statement of body) {

        // }

        const vars = node.body
          .reduce(
            (
              collection: VariableDeclaration[],
              node: Statement | ModuleDeclaration | Directive,
            ) => {
              if (node.type === 'VariableDeclaration') {
                collection.push(node)
              }

              return collection
            },
            [],
          )
          .flatMap(
            (constDecl: VariableDeclaration): readonly VariableDeclarator[] =>
              constDecl.declarations,
          )

        const [requires, others] = vars.reduce(
          (acc, decl) => {
            if (
              decl.init?.type === 'CallExpression' &&
              decl.init.callee.type === 'Identifier' &&
              decl.init.callee.name === 'require'
            ) {
              acc[0].push(decl)
            } else {
              acc[1].push(decl)
            }

            return acc
          },
          [[] as VariableDeclarator[], [] as VariableDeclarator[]],
        )

        for (const decl of requires) {
          // detect requires of "stylex" and "@stylexjs/stylex"
          if (
            decl.init?.type === 'CallExpression' &&
            decl.init.callee.type === 'Identifier' &&
            decl.init.callee.name === 'require' &&
            decl.init.arguments.length === 1 &&
            decl.init.arguments[0]!.type === 'Literal' &&
            // @ts-expect-error FIXME: please
            validImports.has(decl.init.arguments[0]!.value)
          ) {
            if (decl.id.type === 'Identifier') {
              styleXDefaultImports.add(decl.id.name)
            }

            if (decl.id.type === 'ObjectPattern') {
              for (const prop of decl.id.properties) {
                if (
                  prop.type === 'Property' &&
                  prop.key.type === 'Identifier' &&
                  prop.key.name === 'apply' &&
                  !prop.computed &&
                  prop.value.type === 'Identifier'
                ) {
                  styleXCreateImports.add(prop.value.name)
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
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          node.source.type !== 'Literal' ||
          typeof node.source.value !== 'string'
        ) {
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
        const isStylexResolvedVarsImport =
          isValidStylexResolvedVarsFileExtension(
            sourceValue,
            themeFileExtension,
          )

        if (
          !(isVicinageImport || isStylexImport || isStylexResolvedVarsImport)
        ) {
          return
        }

        if (isVicinageImport) {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === 'ImportSpecifier' &&
              // @ts-expect-error FIXME: please
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
                specifier.type === 'ImportSpecifier' &&
                // @ts-expect-error FIXME: please
                specifier.imported.name === 'keyframes'
              ) {
                styleXKeyframesImports.add(specifier.local.name)
              }

              if (
                specifier.type === 'ImportSpecifier' &&
                // @ts-expect-error FIXME: please
                specifier.imported.name === 'positionTry'
              ) {
                styleXPositionTryImports.add(specifier.local.name)
              }

              if (
                specifier.type === 'ImportSpecifier' &&
                // @ts-expect-error FIXME: please
                specifier.imported.name === 'when'
              ) {
                styleXWhenImports.add(specifier.local.name)
              }
            }
          }

          if (typeof foundStylexImportSource === 'object') {
            for (const specifier of node.specifiers) {
              if (
                specifier.type === 'ImportSpecifier' &&
                // @ts-expect-error FIXME: please
                specifier.imported.name === foundStylexImportSource.as
              ) {
                styleXDefaultImports.add(specifier.local.name)
              }
            }
          }
        }

        if (isStylexResolvedVarsImport) {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              stylexResolvedVarsTokenImports.add(specifier.local.name)
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
              stylexResolvedVarsTokenImports.add(decl.id.name)
            }
          }
        }
      },
      CallExpression(node: CallExpression & Rule.NodeParentExtension) {
        if (!isStyleDeclaration(node)) {
          return
        }

        for (const arg of node.arguments) {
          // const loc: ?AST['SourceLocation'] = namespaces.loc;
          if (arg.type !== 'ObjectExpression') {
            continue
          }

          for (const prop of arg.properties) {
            checkStyleProperty(prop, 0, null, false)
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
import type { Directive } from 'estree'
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
import { isStylexDefineVarsToken } from './rules/is-stylex-resolved-vars-token'
import { isWhiteSpaceOrEmpty } from './utils/is-white-space-or-empty'
import type { Literal } from 'estree'
import { makeLiteralRule } from './rules/make-literal-rule'
import { makeUnionRule } from './rules/make-union-rule'
import micromatch from 'micromatch'
import type { ModuleDeclaration } from 'estree'
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
import type { Statement } from 'estree'
import type { VariableDeclaration } from 'estree'
import type { VariableDeclarator } from 'estree'
import type { Variables } from '#/rules/types'
//
