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

ruleTester.run('stylex-no-conflicting-props', rule, {
  valid: [
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} />
        }
      `,
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        function Component() {
          return <div className="foo" />
        }
      `,
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        function Component() {
          return <div style={{ color: 'red' }} />
        }
      `,
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} data-testid="test" />
        }
      `,
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...otherProps} className="foo" />
        }
      `,
    },
    {
      code: /* js */ `
        import { props, create } from '@stylexjs/stylex'

        const styles = create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...props(styles.main)} />
        }
      `,
    },
    {
      options: [{ validImports: ['custom-stylex'] }],
      code: /* js */ `
        import * as stylex from 'custom-stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} />
        }
      `,
    },
    {
      options: [{ validImports: [{ from: 'a', as: 'css' }] }],
      code: /* js */ `
        import { css } from 'a'

        const styles = css.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...css.props(styles.main)} />
        }
      `,
    },
  ],
  invalid: [
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} style={{ margin: 10 }} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div className="foo" {...stylex.props(styles.main)} />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div style={{ margin: 10 }} {...stylex.props(styles.main)} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { props, create } from '@stylexjs/stylex'

        const styles = create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...props(styles.main)} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import { props as p, create } from '@stylexjs/stylex'

        const styles = create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...p(styles.main)} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      options: [{ validImports: ['custom-stylex'] }],
      code: /* js */ `
        import * as stylex from 'custom-stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      options: [{ validImports: [{ from: 'a', as: 'css' }] }],
      code: /* js */ `
        import { css } from 'a'

        const styles = css.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...css.props(styles.main)} className="foo" />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} className="foo" style={{ margin: 10 }} />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
        {
          message:
            'The `style` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} {...{ className: 'foo' }} />
        }
      `,
      errors: [
        {
          message:
            'The `className` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
    {
      code: /* js */ `
        import * as stylex from '@stylexjs/stylex'

        const styles = stylex.create({
          main: { color: 'red' },
        })

        function Component() {
          return <div {...stylex.props(styles.main)} {...{ style: { margin: 10 } }} />
        }
      `,
      errors: [
        {
          message:
            'The `style` prop should not be used when spreading `stylex.props()` to avoid conflicts.',
        },
      ],
    },
  ],
})

import rule from './no-conflicting-props'
import { RuleTester } from 'eslint'
//
