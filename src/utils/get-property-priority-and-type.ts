export { getPropertyPriorityAndType }

/* eslint-disable no-magic-numbers */

interface PriorityAndType {
  priority: number
  type:
    | 'string'
    | 'pseudoClass'
    | 'pseudoElement'
    | 'atRule'
    | 'knownCssProperty'
}

const ORDER_PRIORITIES = {
  // eslint-disable-next-line no-undefined
  default: undefined,
  clean: CLEAN_ORDER_PRIORITIES,
  recess: RECESS_ORDER_PRIORITIES,
}

function getPropertyPriorityAndType(
  key: string,
  order: 'default' | 'clean' | 'recess',
): PriorityAndType {
  const orderPriority = ORDER_PRIORITIES[order]
    ? ORDER_PRIORITIES[order].length - 1
    : 0

  const atRulePriority = getAtRulePriority(key)

  if (atRulePriority) {
    return {
      priority: orderPriority + atRulePriority,
      type: 'atRule',
    }
  }

  const pseudoElementPriority = getPseudoElementPriority(key)

  if (pseudoElementPriority) {
    return {
      priority: orderPriority + pseudoElementPriority,
      type: 'pseudoElement',
    }
  }

  if (key.startsWith(':when:ancestor')) {
    const ancestorPriority = getPseudoClassPriority(
      key.replace(':when:ancestor', ''),
    )

    if (ancestorPriority) {
      return {
        priority: orderPriority + ancestorPriority / 100 + 10,
        type: 'pseudoClass',
      }
    }
  } else if (key.startsWith(':when:descendant')) {
    const descendantPriority = getPseudoClassPriority(
      key.replace(':when:descendant', ''),
    )

    if (descendantPriority) {
      return {
        priority: orderPriority + descendantPriority / 100 + 15,
        type: 'pseudoClass',
      }
    }
  } else if (key.startsWith(':when:anySibling')) {
    const anySiblingPriority = getPseudoClassPriority(
      key.replace(':when:anySibling', ''),
    )

    if (anySiblingPriority) {
      return {
        priority: orderPriority + anySiblingPriority / 100 + 20,
        type: 'pseudoClass',
      }
    }
  } else if (key.startsWith(':when:siblingBefore')) {
    const siblingBeforePriority = getPseudoClassPriority(
      key.replace(':when:siblingBefore', ''),
    )

    if (siblingBeforePriority) {
      return {
        priority: orderPriority + siblingBeforePriority / 100 + 30,
        type: 'pseudoClass',
      }
    }
  } else if (key.startsWith(':when:siblingAfter')) {
    const siblingAfterPriority = getPseudoClassPriority(
      key.replace(':when:siblingAfter', ''),
    )

    if (siblingAfterPriority) {
      return {
        priority: orderPriority + siblingAfterPriority / 100 + 40,
        type: 'pseudoClass',
      }
    }
  }

  const pseudoClassPriority = getPseudoClassPriority(key)

  if (pseudoClassPriority) {
    return {
      priority: orderPriority + pseudoClassPriority,
      type: 'pseudoClass',
    }
  }

  if (order === 'default') {
    const defaultPriority = getDefaultPriority(
      key.replaceAll(/[A-Z]/gu, '-$&').toLowerCase(),
    )

    if (defaultPriority) {
      return { priority: defaultPriority, type: 'knownCssProperty' }
    }
  } else if (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ORDER_PRIORITIES[order]
  ) {
    const index = ORDER_PRIORITIES[order].indexOf(key)

    if (index !== -1) {
      return { priority: index, type: 'knownCssProperty' }
    }
  }

  return { priority: 1, type: 'string' }
}

import { CLEAN_ORDER_PRIORITIES } from '../reference/clean-order-priorities'
import { getAtRulePriority } from '@stylexjs/shared'
import { getDefaultPriority } from '@stylexjs/shared'
import { getPseudoClassPriority } from '@stylexjs/shared'
import { getPseudoElementPriority } from '@stylexjs/shared'
import { RECESS_ORDER_PRIORITIES } from '../reference/recess-order-priorities'
//
