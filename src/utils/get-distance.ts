export { getDistance }

/* eslint-disable no-useless-assignment */
/* eslint-disable no-magic-numbers */

// eslint-disable-next-line max-params
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
// eslint-disable-next-line complexity
function getDistance(_a: string, _b: string, max: number): number {
  let a = _a
  let b = _b

  // returns Infinity if max is exceeded
  if (a === b) {
    return 0
  }

  if (a.length > b.length) {
    const tmp = a
    a = b
    b = tmp
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

  let x = 0
  let y = 0
  let d0 = 0
  let d1 = 0
  let d2 = 0
  let d3 = 0
  let dd = Infinity
  let dy = 0
  let ay = 0
  let bx0 = 0
  let bx1 = 0
  let bx2 = 0
  let bx3 = 0

  const vector = []

  for (y = 0; y < la; y += 1) {
    vector.push(
      y + 1,
      a.codePointAt(offset + y),
      //
    )
  }

  const len = vector.length - 1

  for (; x < lb - 3; ) {
    bx0 = b.codePointAt(offset + (d0 = x)) ?? Number.NaN
    bx1 = b.codePointAt(offset + (d1 = x + 1)) ?? Number.NaN
    bx2 = b.codePointAt(offset + (d2 = x + 2)) ?? Number.NaN
    bx3 = b.codePointAt(offset + (d3 = x + 3)) ?? Number.NaN
    x += 4
    dd = x

    if (dd > max) {
      return Infinity
    }

    for (y = 0; y < len; y += 2) {
      dy = vector[y] ?? 0
      ay = vector[y + 1] ?? 0
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
    bx0 = b.codePointAt(offset + (d0 = x)) ?? Number.NaN
    x += 1
    dd = x

    if (dd > max) {
      return Infinity
    }

    for (y = 0; y < len; y += 2) {
      dy = vector[y] ?? 0
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
