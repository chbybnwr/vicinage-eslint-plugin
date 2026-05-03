export type { PostCSSValueASTNode }

type PostCSSValueASTNode =
  | {
      type: 'word' | 'unicode-range'
      value: string
      sourceIndex: number
      sourceEndIndex: number
    }
  | {
      type: 'string' | 'comment'
      value: string
      quote: '"' | "'"
      sourceIndex: number
      sourceEndIndex: number
      unclosed?: boolean
    }
  | {
      type: 'comment'
      value: string
      sourceIndex: number
      sourceEndIndex: number
      unclosed?: boolean
    }
  | {
      type: 'div'
      value: ',' | '/' | ':'
      sourceIndex: number
      sourceEndIndex: number
      before: '' | ' ' | '  ' | '   '
      after: '' | ' ' | '  ' | '   '
    }
  | {
      type: 'space'
      value: ' ' | '  ' | '   '
      sourceIndex: number
      sourceEndIndex: number
    }
  | {
      type: 'function'
      value: string
      before: '' | ' ' | '  ' | '   '
      after: '' | ' ' | '  ' | '   '
      nodes: PostCSSValueASTNode[]
      unclosed?: boolean
      sourceIndex: number
      sourceEndIndex: number
    }
