export type { RuleCheck }
export type { RuleResponse }
export type { Variables }

type RuleCheck = (
  node: Readonly<Expression | Pattern>,
  variables?: Variables,
  property?: Readonly<Property>,
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
