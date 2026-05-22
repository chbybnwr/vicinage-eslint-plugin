export { makeUnionRule }

function makeUnionRule(
  ...rules: readonly (number | string | RuleCheck)[]
): RuleCheck {
  return function (
    node: Expression | Pattern,
    variables?: Variables,
    property?: Property,
    context?: Rule.RuleContext,
  ): RuleResponse {
    const failedRules = []

    for (const baseRule of rules) {
      const rule =
        typeof baseRule === 'string'
          ? makeLiteralRule(baseRule)
          : typeof baseRule === 'number'
            ? makeLiteralRule(baseRule)
            : baseRule

      const check = rule(node, variables, property, context)

      if (check === undefined) {
        // passes, that means we pass.
        return undefined
      }

      failedRules.push(check)
    }

    const fixable = failedRules.filter(
      (a) => a.suggest != null || a.fix != null,
    )
    fixable.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))

    return {
      message: failedRules.map((a) => a.message).join('\n'),
      fix: fixable[0]?.fix,
      suggest: fixable[0]?.suggest,
    }
  }
}

import type { Expression } from 'estree'
import { makeLiteralRule } from './make-literal-rule'
import type { Pattern } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
