const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('no-conflicting-props', noConflictingProps, {
  valid: [
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} />
        }
      `,
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div className="foo" />
        }
      `,
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div style={{ color: 'red' }} />
        }
      `,
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} data-testid="test" />
        }
      `,
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...otherProps} className="foo" />
        }
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div {...apply()} />
        }
      `,
    },
    // {
    //   options: [{ validImports: ['custom-styler'] }],
    //   code: /* js */ `
    //     import * as styler from 'custom-styler'
    //
    //     function Component() {
    //       return <div {...styler.apply()} />
    //     }
    //   `,
    // },
    // {
    //   options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //   code: /* js */ `
    //     import { css } from 'a'
    //     function Component() {
    //       return <div {...css.apply()} />
    //     }
    //   `,
    // },
  ],

  invalid: [
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} style={{ margin: 10 }} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div {...apply()} style={{ margin: 10 }} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div className="foo" {...styler.apply()} />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div style={{ margin: 10 }} {...styler.apply()} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        function Component() {
          return <div {...apply()} style={{ margin: 10 }} />
        }

        import { apply } from 'vicinage'
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div style={{ margin: 10 }} {...apply()} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div {...apply()} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'

        function Component() {
          return <div {...applySheet()} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div {...apply()} class="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `class` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'

        function Component() {
          return <div {...applySheet()} class="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `class` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    // {
    //   options: [{ validImports: ['custom-styler'] }],
    //   code: /* js */ `
    //     import * as styler from 'custom-styler'
    //
    //     function Component() {
    //       return <div {...styler.apply()} className="foo" />
    //     }
    //   `,
    //   errors: [
    //     {
    //       message:
    //         'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
    //     },
    //   ],
    // },
    // {
    //   options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //   code: /* js */ `
    //     import { css } from 'a'
    //
    //     function Component() {
    //       return <div {...css.apply()} className="foo" />
    //     }
    //   `,
    //   errors: [
    //     {
    //       message:
    //         'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
    //     },
    //   ],
    // },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} className="foo" style={{ margin: 10 }} />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} {...{ className: 'foo' }} />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as styler from 'vicinage'

        function Component() {
          return <div {...styler.apply()} {...{ style: { margin: 10 } }} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `apply()` to avoid conflicts.',
        },
      ],
    },
  ],
})

import { noConflictingProps } from './no-conflicting-props'
import { RuleTester } from 'eslint'
//
