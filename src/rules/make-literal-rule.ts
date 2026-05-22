export { makeLiteralRule }

/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

// Helper functions to check for stylex values.
// All these helper functions receive a list of locally defined variables
// as well. This lets them recursively resolve values that are defined locally.
const MAX_DISTANCE = 4

function makeLiteralRule(value: number | string | null): RuleCheck {
  function literalChecker(node: Node, _variables?: Variables): RuleResponse {
    const defaultFailure = {
      message: `${value ?? 'null'}`,
    }

    if (node.type === 'Literal') {
      if (node.value === value) {
        return undefined
      }

      const distance =
        typeof node.value === 'string' && typeof value === 'string'
          ? getDistance(value, node.value, MAX_DISTANCE)
          : Infinity
      const suggest =
        distance < MAX_DISTANCE
          ? {
              desc: `Did you mean "${value ?? 'null'}"? Replace "${String(
                node.value,
              )}" with "${value ?? 'null'}"`,
              fix: (fixer: Rule.RuleFixer): Rule.Fix | null => {
                const { raw } = node

                if (raw != null) {
                  const quoteType = raw.slice(0, 1)

                  return fixer.replaceText(
                    node,
                    `${quoteType}${value ?? 'null'}${quoteType}`,
                  )
                }

                return null
              },
            }
          : undefined

      return {
        ...defaultFailure,
        distance,
        suggest,
      } as const
    }

    // FIXME: incompatible-type
    return defaultFailure
  }

  return makeVariableCheckingRule(literalChecker)
}

import { getDistance } from '../utils/get-distance'
import { makeVariableCheckingRule } from '../utils/make-variable-checking-rule'
import type { Node } from 'estree'
import type { Rule } from 'eslint'
import type { RuleCheck } from '#/rules/types'
import type { RuleResponse } from '#/rules/types'
import type { Variables } from '#/rules/types'
//
