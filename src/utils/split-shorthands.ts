export { CANNOT_FIX }
export { createBlockInlineTransformer }
export { createDirectionalTransformer }
export { createSpecificTransformer }
export { splitDirectionalShorthands }
export { splitSpecificShorthands }

/* eslint-disable @typescript-eslint/no-non-null-assertion */

const CANNOT_FIX = 'CANNOT_FIX'

const createSpecificTransformer =
  (
    property: string,
  ): ((
    rawValue: number | string,
    allowImportant?: boolean,
    preferInline?: boolean,
  ) => readonly Readonly<[string, number | string]>[]) =>
  (rawValue: number | string, allowImportant = false, preferInline = false) =>
    splitSpecificShorthands(
      property,
      rawValue.toString(),
      allowImportant,
      typeof rawValue === 'number',
      preferInline,
    )

const createDirectionalTransformer =
  (
    baseProperty: string,
    blockSuffix: string,
    inlineSuffix: string,
  ): ((
    rawValue: number | string,
    allowImportant?: boolean,
    preferInline?: boolean,
  ) => [string, string | number | null | undefined][]) =>
  (rawValue: number | string, allowImportant = false, preferInline = false) => {
    const splitValues = splitDirectionalShorthands(rawValue, allowImportant)

    const [top, right = top, bottom = top, left = right] = splitValues

    if (splitValues.length === 1) {
      return [[baseProperty, top]]
    }

    if (splitValues.length === 2) {
      return [
        [`${baseProperty}${blockSuffix}`, top],
        [`${baseProperty}${inlineSuffix}`, right],
      ]
    }

    return preferInline
      ? [
          [`${baseProperty}Top`, top],
          [`${baseProperty}${inlineSuffix}End`, right],
          [`${baseProperty}Bottom`, bottom],
          [`${baseProperty}${inlineSuffix}Start`, left],
        ]
      : [
          [`${baseProperty}Top`, top],
          [`${baseProperty}Right`, right],
          [`${baseProperty}Bottom`, bottom],
          [`${baseProperty}Left`, left],
        ]
  }

const createBlockInlineTransformer =
  (
    baseProperty: string,
    suffix: string,
  ): ((
    rawValue: number | string,
    allowImportant?: boolean,
  ) => [string, string | number | null | undefined][]) =>
  (rawValue: number | string, allowImportant = false) => {
    const splitValues = splitDirectionalShorthands(rawValue, allowImportant)
    const [start, end = start] = splitValues

    if (splitValues.length === 1) {
      return [[`${baseProperty}${suffix}`, start]]
    }

    return [
      [`${baseProperty}${suffix}Start`, start],
      [`${baseProperty}${suffix}End`, end],
    ]
  }

function printNode(node: PostCSSValueASTNode): string {
  switch (node.type) {
    case 'word':

    // fallthrough
    case 'string': {
      return node.value
    }

    case 'function': {
      return `${node.value}(${node.nodes.map((indexNode) => printNode(indexNode)).join('')})`
    }

    default: {
      return node.value
    }
  }
}

const toCamelCase = (text: string) =>
  text.replaceAll(/-(?<text>[a-z])/gu, (_match, letter) =>
    (letter as string).toUpperCase(),
  )

const BORDER_STYLE_KEYWORDS = new Set([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
])
const BORDER_WIDTH_KEYWORDS = new Set(['thin', 'medium', 'thick'])
const BACKGROUND_REPEAT_KEYWORDS = new Set([
  'repeat',
  'repeat-x',
  'repeat-y',
  'no-repeat',
  'space',
  'round',
])
const BACKGROUND_ATTACHMENT_KEYWORDS = new Set(['scroll', 'fixed', 'local'])
const BACKGROUND_POSITION_KEYWORDS = new Set([
  'left',
  'right',
  'top',
  'bottom',
  'center',
])
const FONT_STYLE_KEYWORDS = new Set(['normal', 'italic', 'oblique'])
const FONT_VARIANT_KEYWORDS = new Set(['normal', 'small-caps'])
const FONT_WEIGHT_KEYWORDS = new Set(['normal', 'bold', 'bolder', 'lighter'])
const FONT_SIZE_KEYWORDS = new Set([
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
  'xx-large',
  'xxx-large',
  'smaller',
  'larger',
])
const COLOR_KEYWORDS = new Set(['transparent', 'currentcolor'])
const COLOR_FUNCTION_REGEX =
  /^(?:rgb|rgba|hsl|hsla|hwb|hsb|lab|lch|oklab|oklch|color)\(/iu
const IMAGE_FUNCTION_REGEX =
  /^(?:url|image-set|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient|cross-fade|element)\(/iu
const LENGTH_FUNCTION_REGEX = /^(?:calc|min|max|clamp)\(/iu
const LENGTH_REGEX = /^-?(?:\d+|\d*\.\d+)(?:[%a-z]+)?$/iu

interface ValuePart {
  text: string
  tokens: CSSToken[]
}

interface SplitValuesResult {
  parts: ValuePart[]
  hasTopLevelComma: boolean
  hasTopLevelSlash: boolean
}

function extractImportant(value: string): {
  value: string
  important: boolean
} {
  const match = /^(?<value>.*?)\s*!important\s*$/iu.exec(value)

  if (!match) {
    return { value: value.trim(), important: false }
  }

  return { value: match[1]!.trim(), important: true }
}

function applyImportant(value: string, suffix: string): string {
  return suffix ? `${value}${suffix}` : value
}

function stringifyTokens(tokens: CSSToken[]): string {
  return tokens.map((token) => token[1]).join('')
}

function splitTopLevelValueTokens(
  value: string,
  options: { splitOnSlash?: boolean } = {},
): SplitValuesResult {
  const splitOnSlash = options.splitOnSlash !== false
  const tokens = tokenize({ css: value })
  const parts: ValuePart[] = []
  let currentTokens: CSSToken[] = []
  let current = ''
  let depth = 0
  let hasTopLevelComma = false
  let hasTopLevelSlash = false

  const flushCurrent = () => {
    const trimmed = current.trim()

    if (trimmed !== '') {
      parts.push({ text: trimmed, tokens: currentTokens })
    }

    current = ''
    currentTokens = []
  }

  for (const token of tokens) {
    const [type, text] = token

    if (type === TokenType.EOF) {
      continue
    }

    if (
      type === TokenType.Function ||
      type === TokenType.OpenParen ||
      type === TokenType.OpenSquare ||
      type === TokenType.OpenCurly
    ) {
      depth += 1
      current += text
      currentTokens.push(token)
      continue
    }

    if (
      type === TokenType.CloseParen ||
      type === TokenType.CloseSquare ||
      type === TokenType.CloseCurly
    ) {
      depth = Math.max(0, depth - 1)
      current += text
      currentTokens.push(token)
      continue
    }

    if (type === TokenType.Whitespace && depth === 0) {
      flushCurrent()
      continue
    }

    if (type === TokenType.Delim && text === '/' && depth === 0) {
      hasTopLevelSlash = true

      if (splitOnSlash) {
        flushCurrent()
        parts.push({ text: '/', tokens: [token] })
        continue
      }
    }

    if (type === TokenType.Comma && depth === 0) {
      hasTopLevelComma = true
    }

    current += text
    currentTokens.push(token)
  }

  flushCurrent()

  return { parts, hasTopLevelComma, hasTopLevelSlash }
}

function areAllValuesSame(values: string[]): boolean {
  return values.length > 1 && values.every((value) => value === values[0])
}

function expandQuadValues(values: string[]): [string, string, string, string] {
  const [top, right = top, bottom = top, left = right] = values

  return [top!, right!, bottom!, left!]
}

const GRID_NON_CUSTOM_IDENT_KEYWORDS = new Set([
  'auto',
  'none',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
])

function isCustomIdent(value: string): boolean {
  if (/\s/u.test(value)) return false
  const lower = value.toLowerCase()
  if (GRID_NON_CUSTOM_IDENT_KEYWORDS.has(lower)) return false
  if (/^span\b/iu.test(lower)) return false
  if (/^-?\d+$/u.test(value)) return false

  return true
}

function splitOnSlashGroups(parts: ValuePart[]): string[] {
  const groups: string[][] = [[]]

  for (const part of parts) {
    if (part.text === '/') {
      groups.push([])
    } else {
      groups.at(-1)!.push(part.text)
    }
  }

  return groups.map((g) => g.join(' ')).filter((g) => g !== '')
}

function expandGridAreaShorthand(
  groups: string[],
  importantSuffix: string,
): readonly Readonly<[string, string]>[] {
  const [first, second, third, fourth] = groups

  if (first != null && second != null && third == null && fourth == null) {
    const entries: [string, string][] = [
      ['gridColumnStart', applyImportant(second, importantSuffix)],
      ['gridRowStart', applyImportant(first, importantSuffix)],
    ]

    if (isCustomIdent(first)) {
      entries.push(['gridRowEnd', applyImportant(first, importantSuffix)])
    }

    if (isCustomIdent(second)) {
      entries.push(['gridColumnEnd', applyImportant(second, importantSuffix)])
    }

    return entries.toSorted(([a], [b]) => a.localeCompare(b))
  }

  if (first != null && second != null && third != null && fourth == null) {
    const entries: [string, string][] = [
      ['gridColumnStart', applyImportant(second, importantSuffix)],
      ['gridRowEnd', applyImportant(third, importantSuffix)],
      ['gridRowStart', applyImportant(first, importantSuffix)],
    ]

    if (isCustomIdent(second)) {
      entries.push(['gridColumnEnd', applyImportant(second, importantSuffix)])
    }

    return entries.toSorted(([a], [b]) => a.localeCompare(b))
  }

  if (first != null && second != null && third != null && fourth != null) {
    return [
      ['gridColumnEnd', applyImportant(fourth, importantSuffix)],
      ['gridColumnStart', applyImportant(second, importantSuffix)],
      ['gridRowEnd', applyImportant(third, importantSuffix)],
      ['gridRowStart', applyImportant(first, importantSuffix)],
    ]
  }

  return []
}

function isColorValue(value: string): boolean {
  const lowerValue = value.toLowerCase()

  return (
    lowerValue.startsWith('#') ||
    COLOR_FUNCTION_REGEX.test(lowerValue) ||
    COLOR_KEYWORDS.has(lowerValue)
  )
}

function isImageValue(value: string): boolean {
  const lowerValue = value.toLowerCase()

  return lowerValue === 'none' || IMAGE_FUNCTION_REGEX.test(lowerValue)
}

function isBackgroundPositionValue(value: string): boolean {
  const lowerValue = value.toLowerCase()

  return (
    BACKGROUND_POSITION_KEYWORDS.has(lowerValue) ||
    LENGTH_REGEX.test(lowerValue) ||
    LENGTH_FUNCTION_REGEX.test(lowerValue) ||
    lowerValue.startsWith('var(')
  )
}

function isBorderWidthValue(value: string): boolean {
  const lowerValue = value.toLowerCase()

  return (
    BORDER_WIDTH_KEYWORDS.has(lowerValue) ||
    LENGTH_REGEX.test(lowerValue) ||
    LENGTH_FUNCTION_REGEX.test(lowerValue)
  )
}

function classifyBorderPart(value: string): 'width' | 'style' | 'color' {
  const lowerValue = value.toLowerCase()

  if (BORDER_STYLE_KEYWORDS.has(lowerValue)) {
    return 'style'
  }

  if (isBorderWidthValue(value)) {
    return 'width'
  }

  return 'color'
}

function isFontSizePart(part: ValuePart): boolean {
  const lowerValue = part.text.toLowerCase()

  if (FONT_SIZE_KEYWORDS.has(lowerValue)) {
    return true
  }

  return part.tokens.some(
    (token) =>
      token[0] === TokenType.Dimension || token[0] === TokenType.Percentage,
  )
}

function splitFontSizeAndLineHeight(
  part: ValuePart,
): { fontSize: string; lineHeight?: string } | null {
  let depth = 0
  let sawSlash = false
  const beforeTokens: CSSToken[] = []
  const afterTokens: CSSToken[] = []

  for (const token of part.tokens) {
    const [type, text] = token

    if (
      type === TokenType.Function ||
      type === TokenType.OpenParen ||
      type === TokenType.OpenSquare ||
      type === TokenType.OpenCurly
    ) {
      depth += 1
    } else if (
      type === TokenType.CloseParen ||
      type === TokenType.CloseSquare ||
      type === TokenType.CloseCurly
    ) {
      depth = Math.max(0, depth - 1)
    }

    if (type === TokenType.Delim && text === '/' && depth === 0) {
      sawSlash = true
      continue
    }

    if (!sawSlash) {
      beforeTokens.push(token)
      continue
    }

    afterTokens.push(token)
  }

  const fontSize = stringifyTokens(beforeTokens).trim()

  if (!fontSize) {
    return null
  }

  if (!sawSlash) {
    return { fontSize }
  }

  const lineHeight = stringifyTokens(afterTokens).trim()

  if (!lineHeight) {
    return null
  }

  return { fontSize, lineHeight }
}

const BORDER_RADIUS_MAP: Record<string, string> = {
  'border-top-left-radius': 'borderStartStartRadius',
  'border-top-right-radius': 'borderStartEndRadius',
  'border-bottom-left-radius': 'borderEndStartRadius',
  'border-bottom-right-radius': 'borderEndEndRadius',
}
const CORNER_SHAPE_MAP: Record<string, string> = {
  'corner-top-left-shape': 'cornerStartStartShape',
  'corner-top-right-shape': 'cornerStartEndShape',
  'corner-bottom-left-shape': 'cornerEndStartShape',
  'corner-bottom-right-shape': 'cornerEndEndShape',
}

function mapCornerKey(
  property: string,
  key: string,
  preferInline: boolean,
): string | null {
  if (!preferInline) {
    return key
  }

  if (property === 'border-radius') {
    return BORDER_RADIUS_MAP[key] ?? null
  }

  if (property === 'corner-shape') {
    return CORNER_SHAPE_MAP[key] ?? null
  }

  return key
}

function parseBorderParts(values: string[]): {
  width: string
  style: string
  color: string
} | null {
  let width = null
  let style = null
  let color = null

  for (const value of values) {
    const kind = classifyBorderPart(value)

    if (kind === 'width') {
      if (width != null) {
        return null
      }

      width = value
      continue
    }

    if (kind === 'style') {
      if (style != null) {
        return null
      }

      style = value
      continue
    }

    if (color != null) {
      return null
    }

    color = value
  }

  if (!width || !style || !color) {
    return null
  }

  return { width, style, color }
}

const FLEX_BASIS_KEYWORDS = new Set([
  'auto',
  'content',
  'min-content',
  'max-content',
  'fit-content',
])
const FLEX_BASIS_FUNCTION_REGEX = /^(?:calc|min|max|clamp|fit-content)\(/iu
const FLEX_NUMBER_REGEX = /^-?(?:\d+|\d*\.\d+)$/u
const FLEX_UNITLESS_ZERO_REGEX = /^-?(?:0|0\.0+)$/u

function isFlexNumberValue(value: string): boolean {
  return FLEX_NUMBER_REGEX.test(value)
}

function isFlexBasisValue(
  value: string,
  options: { allowUnitlessZero?: boolean } = {},
): boolean {
  const lower = value.toLowerCase()

  if (options.allowUnitlessZero && FLEX_UNITLESS_ZERO_REGEX.test(lower)) {
    return true
  }

  return (
    FLEX_BASIS_KEYWORDS.has(lower) ||
    FLEX_BASIS_FUNCTION_REGEX.test(lower) ||
    lower.startsWith('var(') ||
    /^-?(?:\d+|\d*\.\d+)[%a-z]+$/iu.test(lower)
  )
}

function expandFlexShorthand(
  values: string[],
  importantSuffix: string,
): readonly Readonly<[string, string]>[] | null {
  const [first, second, third] = values

  if (first != null && second == null && third == null) {
    const lower = first.toLowerCase()

    if (lower === 'auto') {
      return [
        ['flexGrow', applyImportant('1', importantSuffix)],
        ['flexShrink', applyImportant('1', importantSuffix)],
        ['flexBasis', applyImportant('auto', importantSuffix)],
      ]
    }

    if (lower === 'none') {
      return [
        ['flexGrow', applyImportant('0', importantSuffix)],
        ['flexShrink', applyImportant('0', importantSuffix)],
        ['flexBasis', applyImportant('auto', importantSuffix)],
      ]
    }

    if (lower === 'initial') {
      return [
        ['flexGrow', applyImportant('0', importantSuffix)],
        ['flexShrink', applyImportant('1', importantSuffix)],
        ['flexBasis', applyImportant('auto', importantSuffix)],
      ]
    }

    if (isFlexNumberValue(first)) {
      // Single unitless number = flex-grow
      return [
        ['flexGrow', applyImportant(first, importantSuffix)],
        ['flexShrink', applyImportant('1', importantSuffix)],
        ['flexBasis', applyImportant('0%', importantSuffix)],
      ]
    }

    if (isFlexBasisValue(first)) {
      return [
        ['flexGrow', applyImportant('1', importantSuffix)],
        ['flexShrink', applyImportant('1', importantSuffix)],
        ['flexBasis', applyImportant(first, importantSuffix)],
      ]
    }

    return null
  }

  if (first != null && second != null && third == null) {
    if (!isFlexNumberValue(first)) {
      return null
    }

    if (isFlexNumberValue(second)) {
      // <number> <number>
      return [
        ['flexGrow', applyImportant(first, importantSuffix)],
        ['flexShrink', applyImportant(second, importantSuffix)],
        ['flexBasis', applyImportant('0%', importantSuffix)],
      ]
    }

    if (isFlexBasisValue(second)) {
      // <number> <basis>
      return [
        ['flexGrow', applyImportant(first, importantSuffix)],
        ['flexShrink', applyImportant('1', importantSuffix)],
        ['flexBasis', applyImportant(second, importantSuffix)],
      ]
    }

    return null
  }

  if (first != null && second != null && third != null) {
    if (
      !isFlexNumberValue(first) ||
      !isFlexNumberValue(second) ||
      !isFlexBasisValue(third, { allowUnitlessZero: true })
    ) {
      return null
    }

    return [
      ['flexGrow', applyImportant(first, importantSuffix)],
      ['flexShrink', applyImportant(second, importantSuffix)],
      ['flexBasis', applyImportant(third, importantSuffix)],
    ]
  }

  return null
}

const ANIMATION_DIRECTION_KEYWORDS = new Set([
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
])
const ANIMATION_FILL_MODE_KEYWORDS = new Set([
  'none',
  'forwards',
  'backwards',
  'both',
])
const ANIMATION_PLAY_STATE_KEYWORDS = new Set(['running', 'paused'])
const ANIMATION_TIMING_KEYWORDS = new Set([
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'step-start',
  'step-end',
])
const ANIMATION_TIMING_FUNCTION_REGEX = /^(?:cubic-bezier|steps|linear)\(/iu
const TIME_REGEX = /^-?(?:\d+|\d*\.\d+)(?:s|ms)$/iu

function isTimeValue(value: string): boolean {
  return TIME_REGEX.test(value)
}

function isAnimationTimingFunction(value: string): boolean {
  const lower = value.toLowerCase()

  return (
    ANIMATION_TIMING_KEYWORDS.has(lower) ||
    ANIMATION_TIMING_FUNCTION_REGEX.test(lower)
  )
}

function isAnimationIterationCount(value: string): boolean {
  const lower = value.toLowerCase()

  return lower === 'infinite' || /^(?:\d+|\d*\.\d+)$/u.test(lower)
}

function expandAnimationShorthand(
  parts: ValuePart[],
  hasTopLevelComma: boolean,
  importantSuffix: string,
): readonly Readonly<[string, string]>[] | null {
  if (hasTopLevelComma) {
    return null
  }

  const values = parts.map((part) => part.text)

  let duration = null
  let delay = null
  let timingFunction = null
  let iterationCount = null
  let direction = null
  let fillMode = null
  let playState = null
  let name = null

  for (const value of values) {
    const lower = value.toLowerCase()

    if (isTimeValue(value)) {
      if (duration == null) {
        duration = value
        continue
      }

      if (delay == null) {
        delay = value
        continue
      }

      return null
    }

    if (timingFunction == null && isAnimationTimingFunction(value)) {
      timingFunction = value
      continue
    }

    if (direction == null && ANIMATION_DIRECTION_KEYWORDS.has(lower)) {
      direction = value
      continue
    }

    if (fillMode == null && ANIMATION_FILL_MODE_KEYWORDS.has(lower)) {
      fillMode = value
      continue
    }

    if (playState == null && ANIMATION_PLAY_STATE_KEYWORDS.has(lower)) {
      playState = value
      continue
    }

    if (iterationCount == null && isAnimationIterationCount(value)) {
      iterationCount = value
      continue
    }

    if (name == null) {
      name = value
      continue
    }

    return null
  }

  const entries: [string, string][] = []

  if (duration != null) {
    entries.push([
      'animationDuration',
      applyImportant(duration, importantSuffix),
    ])
  }

  if (timingFunction != null) {
    entries.push([
      'animationTimingFunction',
      applyImportant(timingFunction, importantSuffix),
    ])
  }

  if (delay != null) {
    entries.push(['animationDelay', applyImportant(delay, importantSuffix)])
  }

  if (iterationCount != null) {
    entries.push([
      'animationIterationCount',
      applyImportant(iterationCount, importantSuffix),
    ])
  }

  if (direction != null) {
    entries.push([
      'animationDirection',
      applyImportant(direction, importantSuffix),
    ])
  }

  if (name == null && fillMode?.toLowerCase() === 'none') {
    // "none" is ambiguous between fill-mode and name, but since
    // "none" is the default fill-mode, treat it as animation-name only.
    entries.push(['animationName', applyImportant(fillMode, importantSuffix)])
    fillMode = null
  }

  if (fillMode != null) {
    entries.push([
      'animationFillMode',
      applyImportant(fillMode, importantSuffix),
    ])
  }

  if (playState != null) {
    entries.push([
      'animationPlayState',
      applyImportant(playState, importantSuffix),
    ])
  }

  if (name != null) {
    entries.push(['animationName', applyImportant(name, importantSuffix)])
  }

  if (entries.length === 0) {
    return null
  }

  return entries
}

function expandBorderSideShorthand(
  property: string,
  values: string[],
  importantSuffix: string,
): readonly Readonly<[string, string]>[] | null {
  const parsed = parseBorderParts(values)

  if (!parsed) {
    return null
  }

  const baseKey = toCamelCase(property)

  return [
    [`${baseKey}Width`, applyImportant(parsed.width, importantSuffix)],
    [`${baseKey}Style`, applyImportant(parsed.style, importantSuffix)],
    [`${baseKey}Color`, applyImportant(parsed.color, importantSuffix)],
  ]
}

function expandBackgroundShorthand(
  parts: ValuePart[],
  hasTopLevelComma: boolean,
  importantSuffix: string,
): readonly Readonly<[string, string]>[] | null {
  if (hasTopLevelComma) {
    return null
  }

  let sawSlash = false
  const beforeSlash: string[] = []
  const afterSlash: string[] = []

  for (const part of parts) {
    if (part.text === '/') {
      if (sawSlash) {
        return null
      }

      sawSlash = true
      continue
    }

    if (sawSlash) {
      afterSlash.push(part.text)
    } else {
      beforeSlash.push(part.text)
    }
  }

  if (sawSlash && afterSlash.length === 0) {
    return null
  }

  let color = null
  let image = null
  let repeat = null
  let attachment = null
  const positionParts: string[] = []

  for (const part of beforeSlash) {
    const lowerPart = part.toLowerCase()

    if (!image && isImageValue(part)) {
      image = part
      continue
    }

    if (!repeat && BACKGROUND_REPEAT_KEYWORDS.has(lowerPart)) {
      repeat = part
      continue
    }

    if (!attachment && BACKGROUND_ATTACHMENT_KEYWORDS.has(lowerPart)) {
      attachment = part
      continue
    }

    if (!color && isColorValue(part)) {
      color = part
      continue
    }

    if (isBackgroundPositionValue(part)) {
      positionParts.push(part)
      continue
    }

    if (!color) {
      color = part
      continue
    }

    positionParts.push(part)
  }

  const backgroundPosition =
    positionParts.length > 0 ? positionParts.join(' ') : null
  const backgroundSize = afterSlash.length > 0 ? afterSlash.join(' ') : null

  const entries: [string, string][] = []

  if (color) {
    entries.push(['backgroundColor', applyImportant(color, importantSuffix)])
  }

  if (image) {
    entries.push(['backgroundImage', applyImportant(image, importantSuffix)])
  }

  if (repeat) {
    entries.push(['backgroundRepeat', applyImportant(repeat, importantSuffix)])
  }

  if (attachment) {
    entries.push([
      'backgroundAttachment',
      applyImportant(attachment, importantSuffix),
    ])
  }

  if (backgroundPosition) {
    entries.push([
      'backgroundPosition',
      applyImportant(backgroundPosition, importantSuffix),
    ])
  }

  if (backgroundSize) {
    entries.push([
      'backgroundSize',
      applyImportant(backgroundSize, importantSuffix),
    ])
  }

  if (entries.length === 0) {
    return null
  }

  return entries
}

function expandFontShorthand(
  parts: ValuePart[],
  importantSuffix: string,
): readonly Readonly<[string, string]>[] | null {
  if (parts.length === 0) {
    return null
  }

  const sizeIndex = parts.findIndex((part) => isFontSizePart(part))

  if (sizeIndex === -1) {
    return null
  }

  const sizePart = parts[sizeIndex]

  const sizeValues = splitFontSizeAndLineHeight(sizePart!)

  if (!sizeValues) {
    return null
  }

  const { fontSize, lineHeight } = sizeValues
  const familyParts = parts.slice(sizeIndex + 1)

  if (familyParts.length === 0) {
    return null
  }

  const fontFamily = familyParts.map((part) => part.text).join(' ')

  let fontStyle = null
  let fontVariant = null
  let fontWeight = null

  for (const part of parts.slice(0, sizeIndex)) {
    const lowerPart = part.text.toLowerCase()

    if (FONT_STYLE_KEYWORDS.has(lowerPart)) {
      if (fontStyle != null) {
        return null
      }

      fontStyle = part.text

      continue
    }

    if (FONT_VARIANT_KEYWORDS.has(lowerPart)) {
      if (fontVariant != null) {
        return null
      }

      fontVariant = part.text

      continue
    }

    if (
      FONT_WEIGHT_KEYWORDS.has(lowerPart) ||
      /^[1-9]00$/u.test(lowerPart) ||
      /^\d+(?:\.\d+)?$/u.test(lowerPart)
    ) {
      if (fontWeight != null) {
        return null
      }

      fontWeight = part.text
      continue
    }

    return null
  }

  const entries: [string, string][] = [
    ['fontFamily', applyImportant(fontFamily, importantSuffix)],
  ]

  if (fontStyle) {
    entries.push(['fontStyle', applyImportant(fontStyle, importantSuffix)])
  }

  if (fontVariant) {
    entries.push(['fontVariant', applyImportant(fontVariant, importantSuffix)])
  }

  if (fontWeight) {
    entries.push(['fontWeight', applyImportant(fontWeight, importantSuffix)])
  }

  entries.push(['fontSize', applyImportant(fontSize, importantSuffix)])

  if (lineHeight) {
    entries.push(['lineHeight', applyImportant(lineHeight, importantSuffix)])
  }

  return entries
}

function splitSpecificShorthands(
  property: string,
  value: string,
  allowImportant = false,
  isNumber = false,
  preferInline = false,
): readonly Readonly<[string, number | string]>[] {
  // const rawValue = value.toString()
  // TODO: check the line above if the line below is broken
  const rawValue = value
  const { value: baseValue, important } = extractImportant(rawValue)
  const importantSuffix = allowImportant && important ? ' !important' : ''

  if (property === 'font') {
    const fontSplit = splitTopLevelValueTokens(baseValue, {
      splitOnSlash: false,
    })

    if (fontSplit.parts.length <= 1 && !fontSplit.hasTopLevelSlash) {
      return [[toCamelCase(property), isNumber ? Number(rawValue) : rawValue]]
    }

    const expandedFont = expandFontShorthand(fontSplit.parts, importantSuffix)

    return expandedFont ?? [[toCamelCase(property), CANNOT_FIX]]
  }

  if (property === 'grid-area') {
    const gridSplit = splitTopLevelValueTokens(baseValue)
    const groups = splitOnSlashGroups(gridSplit.parts)

    const [first] = groups

    if (groups.length === 1 && first != null) {
      if (isCustomIdent(first)) {
        return [
          ['gridColumnEnd', applyImportant(first, importantSuffix)],
          ['gridColumnStart', applyImportant(first, importantSuffix)],
          ['gridRowEnd', applyImportant(first, importantSuffix)],
          ['gridRowStart', applyImportant(first, importantSuffix)],
        ]
      }

      return [['gridArea', isNumber ? Number(rawValue) : rawValue]]
    }

    const expanded = expandGridAreaShorthand(groups, importantSuffix)

    return expanded.length > 0 ? expanded : [['gridArea', CANNOT_FIX]]
  }

  if (property === 'flex') {
    const flexSplit = splitTopLevelValueTokens(baseValue)

    if (flexSplit.hasTopLevelComma || flexSplit.hasTopLevelSlash) {
      return [['flex', CANNOT_FIX]]
    }

    const flexValues = flexSplit.parts.map((part) => part.text)
    const expandedFlex = expandFlexShorthand(flexValues, importantSuffix)

    return expandedFlex ?? [['flex', CANNOT_FIX]]
  }

  if (property === 'gap') {
    const gapSplit = splitTopLevelValueTokens(baseValue)

    if (gapSplit.hasTopLevelComma || gapSplit.hasTopLevelSlash) {
      return [['gap', CANNOT_FIX]]
    }

    const gapValues = gapSplit.parts.map((part) => part.text)
    const [first, second] = gapValues

    if (gapValues.length <= 1) {
      const value = isNumber
        ? Number(rawValue)
        : applyImportant(first ?? rawValue, importantSuffix)

      return [
        ['rowGap', value],
        ['columnGap', value],
      ]
    }

    if (gapValues.length === 2 && first != null && second != null) {
      return [
        ['rowGap', applyImportant(first, importantSuffix)],
        ['columnGap', applyImportant(second, importantSuffix)],
      ]
    }

    return [['gap', CANNOT_FIX]]
  }

  const splitValues = splitTopLevelValueTokens(baseValue)

  if (splitValues.parts.length <= 1 && !splitValues.hasTopLevelSlash) {
    return [[toCamelCase(property), isNumber ? Number(rawValue) : rawValue]]
  }

  if (
    property === 'grid-row' ||
    property === 'grid-column' ||
    property === 'grid-template'
  ) {
    if (!splitValues.hasTopLevelSlash) {
      return [[toCamelCase(property), isNumber ? Number(rawValue) : rawValue]]
    }

    const [first, second] = splitOnSlashGroups(splitValues.parts)

    if (first != null && second != null) {
      switch (property) {
        case 'grid-row': {
          return [
            ['gridRowEnd', applyImportant(second, importantSuffix)],
            ['gridRowStart', applyImportant(first, importantSuffix)],
          ]
        }

        case 'grid-column': {
          return [
            ['gridColumnEnd', applyImportant(second, importantSuffix)],
            ['gridColumnStart', applyImportant(first, importantSuffix)],
          ]
        }

        case 'grid-template': {
          return [
            ['gridTemplateColumns', applyImportant(second, importantSuffix)],
            ['gridTemplateRows', applyImportant(first, importantSuffix)],
          ]
        }

        default: {
          return exhaustiveCheck(property)
        }
      }
    }

    return [[toCamelCase(property), CANNOT_FIX]]
  }

  if (property === 'background') {
    const expandedBackground = expandBackgroundShorthand(
      splitValues.parts,
      splitValues.hasTopLevelComma,
      importantSuffix,
    )

    return expandedBackground ?? [[toCamelCase(property), CANNOT_FIX]]
  }

  if (property === 'animation') {
    const expandedAnimation = expandAnimationShorthand(
      splitValues.parts,
      splitValues.hasTopLevelComma,
      importantSuffix,
    )

    return expandedAnimation ?? [[toCamelCase(property), CANNOT_FIX]]
  }

  const values = splitValues.parts
    .map((part) => part.text)
    .filter((part) => part !== '/')

  if (values.length === 0) {
    return [[toCamelCase(property), CANNOT_FIX]]
  }

  const allSameValues = areAllValuesSame(values)

  if (
    property === 'border-width' ||
    property === 'border-style' ||
    property === 'border-color'
  ) {
    if (splitValues.hasTopLevelComma || splitValues.hasTopLevelSlash) {
      return [[toCamelCase(property), CANNOT_FIX]]
    }

    if (values.length > 4) {
      return [[toCamelCase(property), CANNOT_FIX]]
    }

    const suffix = property.replace('border-', '')

    if (allSameValues) {
      return [[toCamelCase(property), isNumber ? Number(rawValue) : rawValue]]
    }

    const expanded = expandQuadValues(values)
    const isBlockInline =
      expanded[0] === expanded[2] && expanded[1] === expanded[3]

    if (isBlockInline) {
      return [
        [
          toCamelCase(`border-block-${suffix}`),
          applyImportant(expanded[0], importantSuffix),
        ],
        [
          toCamelCase(`border-inline-${suffix}`),
          applyImportant(expanded[1], importantSuffix),
        ],
      ]
    }

    const keys = preferInline
      ? [
          `border-top-${suffix}`,
          `border-inline-end-${suffix}`,
          `border-bottom-${suffix}`,
          `border-inline-start-${suffix}`,
        ]
      : [
          `border-top-${suffix}`,
          `border-right-${suffix}`,
          `border-bottom-${suffix}`,
          `border-left-${suffix}`,
        ]

    const entries: [string, string][] = []

    for (const [index, key] of keys.entries()) {
      entries.push([
        toCamelCase(key),

        applyImportant(expanded[index]!, importantSuffix),
      ])
    }

    return entries
  }

  if (property === 'border-radius' || property === 'corner-shape') {
    if (splitValues.hasTopLevelComma || splitValues.hasTopLevelSlash) {
      return [[toCamelCase(property), CANNOT_FIX]]
    }

    if (values.length > 4) {
      return [[toCamelCase(property), CANNOT_FIX]]
    }

    if (values.length === 1 || allSameValues) {
      return [[toCamelCase(property), isNumber ? Number(rawValue) : rawValue]]
    }

    const expanded = expandQuadValues(values)
    const keys =
      property === 'border-radius'
        ? [
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius',
          ]
        : [
            'corner-start-start-shape',
            'corner-start-end-shape',
            'corner-end-start-shape',
            'corner-end-end-shape',
          ]

    const entries: [string, string][] = []

    for (const [index, key] of keys.entries()) {
      const mappedKey = mapCornerKey(property, key, preferInline)

      if (!mappedKey) {
        return [[toCamelCase(property), CANNOT_FIX]]
      }

      entries.push([
        toCamelCase(mappedKey),

        applyImportant(expanded[index]!, importantSuffix),
      ])
    }

    return entries
  }

  if (property === 'border') {
    if (splitValues.hasTopLevelComma || splitValues.hasTopLevelSlash) {
      return [['border', CANNOT_FIX]]
    }

    const expandedBorder = expandBorderSideShorthand(
      property,
      values,
      importantSuffix,
    )

    return expandedBorder ?? [['border', CANNOT_FIX]]
  }

  if (
    property === 'border-top' ||
    property === 'border-right' ||
    property === 'border-bottom' ||
    property === 'border-left'
  ) {
    if (splitValues.hasTopLevelComma || splitValues.hasTopLevelSlash) {
      return [[toCamelCase(property), CANNOT_FIX]]
    }

    const expandedBorder = expandBorderSideShorthand(
      property,
      values,
      importantSuffix,
    )

    return expandedBorder ?? [[toCamelCase(property), CANNOT_FIX]]
  }

  if (property === 'outline') {
    if (splitValues.hasTopLevelComma || splitValues.hasTopLevelSlash) {
      return [[toCamelCase(property), CANNOT_FIX]]
    }

    const expandedOutline = expandBorderSideShorthand(
      property,
      values,
      importantSuffix,
    )

    return expandedOutline ?? [[toCamelCase(property), CANNOT_FIX]]
  }

  return [[toCamelCase(property), CANNOT_FIX]]
}

function splitDirectionalShorthands(
  value: number | string | null,
  allowImportant = false,
): readonly (number | string | null | undefined)[] {
  let processedString = value

  if (
    value == null ||
    (typeof value !== 'string' && typeof value !== 'number')
  ) {
    return [value]
  }

  if (typeof value === 'number') {
    processedString = String(value)
  }

  if (Array.isArray(processedString)) {
    return processedString
  }

  if (typeof processedString !== 'string') {
    return [processedString]
  }

  const parsed = parser(processedString.trim())

  const nodes = parsed.nodes
    .filter((node) => node.type !== 'space' && node.type !== 'div')
    .map((node) => printNode(node as PostCSSValueASTNode))

  if (typeof value === 'number') {
    // if originally a number, let's preserve that here
    const processedNodes = nodes.map((node) => Number.parseFloat(node))

    return processedNodes
  }

  if (
    nodes.length > 1 &&
    nodes.at(-1)?.toLowerCase() === '!important' &&
    allowImportant
  ) {
    return nodes.slice(0, -1).map((node) => `${node} !important`)
  }

  if (nodes.length > 1 && new Set(nodes).size === 1) {
    // If all values are the same, no need to expand
    return [nodes[0]]
  }

  return nodes
}

function exhaustiveCheck(value: never) {
  return value
}

import type { CSSToken } from '@csstools/css-tokenizer'
import parser from 'postcss-value-parser'
import type { PostCSSValueASTNode } from '#/types/postcss-value-ast-node'
import { tokenize } from '@csstools/css-tokenizer'
import { TokenType } from '@csstools/css-tokenizer'
//
