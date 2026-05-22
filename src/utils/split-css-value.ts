export { borderSplitter }

function splitValue(
  borderValue: number | string,
): readonly (number | string | null)[] {
  if (typeof borderValue === 'number') {
    return [borderValue]
  }

  const values: string[] = []
  let currentSegment = ''
  let withinQuotes = false
  let withinFunction = 0

  for (const char of borderValue) {
    if (char === "'" || char === '"') {
      withinQuotes = !withinQuotes
    } else if (char === '(' && !withinQuotes) {
      withinFunction += 1
    } else if (char === ')' && !withinQuotes) {
      withinFunction -= 1
    }

    if (char === ' ' && !withinQuotes && withinFunction === 0) {
      if (currentSegment.length > 0) {
        values.push(currentSegment)
        currentSegment = ''
      }
    } else {
      currentSegment += char
    }
  }

  if (currentSegment.length > 0) {
    values.push(currentSegment)
  }

  return values
}

const borderWidthKeywords = new Set(['thin', 'medium', 'thick'])
const borderStyleKeywords = new Set([
  'none',
  'hidden',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inside', // Non-standard
  'inset',
  'outset',
])
const globalKeywords = new Set(['initial', 'inherit', 'unset'])

function borderSplitter(
  value: string,
): [string | number | null, string | null, string | null] {
  const borderParts = splitValue(value).filter((part) => part != null)

  const suffix = borderParts.some(
    (part) => typeof part === 'string' && part.endsWith('!important'),
  )
    ? ' !important'
    : ''

  const parts = borderParts.map((part) =>
    typeof part === 'string' && part.endsWith('!important')
      ? part.replace('!important', '').trim()
      : part,
  )

  if (
    parts.length === 1 &&
    typeof parts[0] === 'string' &&
    globalKeywords.has(parts[0]) &&
    typeof parts[0] === 'string'
  ) {
    return [parts[0], parts[0], parts[0]]
  }

  // Find the part that starts with a number
  // This is most likely to be the borderWidth
  let width = parts.find(
    (part) =>
      typeof part === 'number' ||
      (typeof part === 'string' &&
        (/^\.?\d+/u.exec(part) != null ||
          borderWidthKeywords.has(part) ||
          /^calc\(/u.exec(part) != null)),
  )

  if (typeof width === 'number') {
    width = `${String(width)}px`
  }

  if (width != null) {
    parts.splice(parts.indexOf(width), 1)

    if (parts.length === 0) {
      return [width + suffix, null, null]
    }
  }

  const style = parts.find(
    (part) => typeof part === 'string' && borderStyleKeywords.has(part),
  )

  if (style != null) {
    parts.splice(parts.indexOf(style), 1)
  }

  if (parts.length === 2 && width == null) {
    ;[width] = parts
    parts.splice(0, 1)
  }

  const [color] = parts
  const withSuffix = (part: undefined | null | string | number) =>
    part == null ? null : part.toString() + suffix

  return [withSuffix(width), withSuffix(style), withSuffix(color)]
}
