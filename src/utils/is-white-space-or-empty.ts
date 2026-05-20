export { isWhiteSpaceOrEmpty as default }

function isWhiteSpaceOrEmpty(str: string): boolean {
  return !str.trim()
}
