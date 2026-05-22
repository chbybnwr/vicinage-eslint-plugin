export type { RuleCheck }
export type { RuleResponse }
export type { Variables }

// eslint-disable-next-line max-params
type RuleCheck = (
  node: Readonly<Expression | Pattern>,
  variables?: Variables,
  prop?: Readonly<Property>,
  context?: Rule.RuleContext,
) => RuleResponse

type RuleResponse =
  | undefined
  | {
      message: string
      distance?: number
      fix?: Rule.ReportFixer | undefined
      suggest?:
        | {
            fix: Rule.ReportFixer
            desc: string
          }
        | undefined
    }

type Variables = ReadonlyMap<string, Expression | 'ARG'>

import type { Expression } from 'estree'
import type { Pattern } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
//
