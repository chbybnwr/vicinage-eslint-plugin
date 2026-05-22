export { getDistance }

function getDistanceMin(
  d0: number,
  d1: number,
  d2: number,
  bx: number,
  ay: number,
): number {
  return d0 < d1 || d2 < d1
    ? d0 > d2
      ? d2 + 1
      : d0 + 1
    : bx === ay
      ? d1
      : d1 + 1
}

/*
 * This a fork of Gustaf Andersson's levenshtein implementation // cspell:disable-line
 * https://github.com/gustf/js-levenshtein
 *
 * Includes a naive bailout using max distance for stopping early
 * to prevent slowing down the lint rule too much.
 *
 * It will return Infinity if it bails out early
 */

function getDistance(a: string, b: string, max: number): number {
  // returns Infinity if max is exceeded
  if (a === b) {
    return 0
  }

  if (a.length > b.length) {
    ;[a, b] = [b, a]
  }

  let la = a.length
  let lb = b.length

  while (la > 0 && a.codePointAt(la - 1) === b.codePointAt(lb - 1)) {
    la -= 1
    lb -= 1
  }

  let offset = 0

  while (offset < la && a.codePointAt(offset) === b.codePointAt(offset)) {
    offset += 1
  }

  la -= offset
  lb -= offset

  if (la === 0 || lb < 3) {
    return lb
  }

  const vector = []

  for (let y = 0; y < la; y += 1) {
    vector.push(
      y + 1,
      a.codePointAt(offset + y),
      //
    )
  }

  const length = vector.length - 1

  let x = 0
  let dd = Infinity

  for (; x < lb - 3; ) {
    let d0 = x
    let d1 = x + 1
    let d2 = x + 2
    let d3 = x + 3
    const bx0 = b.codePointAt(offset + d0) ?? Number.NaN
    const bx1 = b.codePointAt(offset + d1) ?? Number.NaN
    const bx2 = b.codePointAt(offset + d2) ?? Number.NaN
    const bx3 = b.codePointAt(offset + d3) ?? Number.NaN
    x += 4
    dd = x

    if (dd > max) {
      return Infinity
    }

    for (let y = 0; y < length; y += 2) {
      const dy = vector[y] ?? 0
      const ay = vector[y + 1] ?? 0
      d0 = getDistanceMin(dy, d0, d1, bx0, ay)
      d1 = getDistanceMin(d0, d1, d2, bx1, ay)
      d2 = getDistanceMin(d1, d2, d3, bx2, ay)
      dd = getDistanceMin(d2, d3, dd, bx3, ay)
      vector[y] = dd
      d3 = d2
      d2 = d1
      d1 = d0
      d0 = dy
    }
  }

  for (; x < lb; ) {
    let d0 = x
    const bx0 = b.codePointAt(offset + d0) ?? Number.NaN
    x += 1
    dd = x

    if (dd > max) {
      return Infinity
    }

    for (let y = 0; y < length; y += 2) {
      const dy = vector[y] ?? 0
      dd = getDistanceMin(dy, d0, dd, bx0, vector[y + 1] ?? 0)
      vector[y] = dd

      if (dd > max) {
        return Infinity
      }

      d0 = dy
    }
  }

  return dd
}
