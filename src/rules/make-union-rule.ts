/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-undefined */

import type { Expression } from 'estree'
import makeLiteralRule from './make-literal-rule'
import type { Pattern } from 'estree'
import type { Property } from 'estree'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'

export default function makeUnionRule(
  ...rules: readonly (number | string | RuleCheck)[]
): RuleCheck {
  // eslint-disable-next-line max-params
  return function (
    node: Expression | Pattern,
    variables?: Variables,
    prop?: Property,
    context?: Rule.RuleContext,
  ): RuleResponse {
    const failedRules = []

    // eslint-disable-next-line no-underscore-dangle
    for (const _rule of rules) {
      const rule =
        typeof _rule === 'string'
          ? makeLiteralRule(_rule)
          : typeof _rule === 'number'
            ? makeLiteralRule(_rule)
            : _rule

      const check = rule(node, variables, prop, context)

      if (check === undefined) {
        // passes, that means we pass.
        return undefined
      }

      failedRules.push(check)
    }

    const fixable = failedRules.filter(
      (a) => a.suggest != null || a.fix != null,
    )
    fixable.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))

    // @ts-expect-error FIXME: please
    return {
      message: failedRules.map((a) => a.message).join('\n'),
      fix: fixable[0] == null ? undefined : fixable[0].fix,
      suggest: fixable[0] == null ? undefined : fixable[0].suggest,
    }
  }
}
