export { isWhiteSpaceOrEmpty }

function isWhiteSpaceOrEmpty(text: string): boolean {
  return !text.trim()
}
