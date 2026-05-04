import rule from './sort-keys'
import { RuleTester } from 'eslint'

const eslintTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
})

eslintTester.run('sort-keys', rule, {
  valid: [
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         borderColor: {
    //           default: 'green',
    //           ':hover': 'red',
    //           '@media (min-width: 1540px)': 1366,
    //         },
    //         borderRadius: 10,
    //         display: 'flex',
    //       },
    //       dynamic: (color) => (
    //         backgroundColor: color,
    //       )
    //     )
    //   `,
    //   },
    //   {
    //     options: [{ order: 'clean' }],
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         display: 'flex',
    //         borderColor: {
    //           default: 'green',
    //           ':hover': 'red',
    //           '@media (min-width: 1540px)': 1366,
    //         },
    //         borderRadius: 10,
    //       },
    //       dynamic: (color) => (
    //         backgroundColor: color,
    //       )
    //     )
    //   `,
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         width: {
    //           default: '100%',
    //           '@supports (width: 100dvw)': {
    //             default: '100dvw',
    //             '@media (max-width: 1000px)': '100px',
    //           },
    //           ':hover': {
    //             color: 'red',
    //           }
    //         },
    //       },
    //     )
    //     `,
    //   },
    {
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        const obj = { fontSize: '12px' }
        applySheet(
          {
            alignItems: 'center',
            display: 'flex',
            ...obj,
            borderColor: 'black',
            alignSelf: 'center',
          }
        )
      `,
    },
    {
      options: [{ order: 'clean' }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        const obj = { fontSize: '12px' }
        applySheet(
          {
            display: 'flex',
            alignItems: 'center',
            ...obj,
            alignSelf: 'center',
            borderColor: 'black',
          }
        )
      `,
    },
    {
      options: [{ order: 'recess' }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        const obj = { fontSize: '12px' }
        applySheet(
          {
            display: 'flex',
            alignItems: 'center',
            ...obj,
            alignSelf: 'center',
            borderColor: 'black',
          }
        )
      `,
    },
    {
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            marginBlock: 6,
            marginInline: 8,
          }
        )
      `,
    },
    {
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            margin: 16,
            marginInline: 8,
            marginBlockEnd: 6,
            marginLeft: 4,
          }
        )
      `,
    },
    {
      options: [{ allowLineSeparatedGroups: true }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            alignItems: 'center',
            display: 'flex',

            borderColor: 'black',
            alignSelf: 'center',
          }
        )
      `,
    },
    {
      options: [{ order: 'clean', allowLineSeparatedGroups: true }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            display: 'flex',
            alignItems: 'center',

            alignSelf: 'center',
            borderColor: 'black',
          }
        )
      `,
    },
    {
      options: [{ order: 'recess', allowLineSeparatedGroups: true }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            display: 'flex',
            alignItems: 'center',

            alignSelf: 'center',
            borderColor: 'black',
          }
        )
      `,
    },
    {
      options: [{ minKeys: 5 }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            flex: 1,
            display: 'flex',
            borderColor: 'black',
            alignItems: 'center',
          }
        )
      `,
    },
    //   {
    //     options: [{ validImports: ['a'] }],
    //     code: /* js */ `
    //     import { apply as applySheet } from 'a'
    //     applySheet(
    //       {
    //         borderColor: 'black',
    //         display: 'flex',
    //       }
    //     )
    //   `,
    //   },
    //   {
    //     options: [{ validImports: ['a'], order: 'clean' }],
    //     code: /* js */ `
    //     import { apply as applySheet } from 'a'
    //     applySheet(
    //       {
    //         display: 'flex',
    //         borderColor: 'black',
    //       }
    //     )
    //   `,
    //   },
    //   {
    //     options: [{ validImports: ['a'], order: 'recess' }],
    //     code: /* js */ `
    //     import { apply as applySheet } from 'a'
    //     applySheet(
    //       {
    //         display: 'flex',
    //         borderColor: 'black',
    //       }
    //     )
    //   `,
    //   },
    //   {
    //     options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //     code: /* js */ `
    //     import { css } from 'a'
    //     const styles = css.create(
    //       {
    //         borderColor: 'black',
    //         display: 'flex',
    //       }
    //     )
    //     `,
    //   },
    //   {
    //     options: [
    //       {
    //         validImports: [{ from: 'a', as: 'css' }],
    //         order: 'clean',
    //       },
    //     ],
    //     code: /* js */ `
    //     import { css } from 'a'
    //     const styles = css.create(
    //       {
    //         display: 'flex',
    //         borderColor: 'black',
    //       }
    //     )
    //     `,
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         paddingBlock: 0,
    //         maxWidth: {
    //           default: "1080px",
    //           "@media (min-width: 2000px)": "calc((1080 / 24) * 1rem)"
    //         },
    //       },
    //     )
    //     `,
    //   },
  ],
  invalid: [
    //   {
    //     code: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       vicinage.apply(
    //         {
    //           animationDuration: '100ms',
    //           padding: 10,
    //           fontSize: 12,
    //         }
    //       )
    //     `,
    //     output: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       vicinage.apply(
    //         {
    //           padding: 10,
    //           animationDuration: '100ms',
    //           fontSize: 12,
    //         }
    //       )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "padding" should be above "animationDuration"',
    //       },
    //     ],
    //   },
    //   {
    //     options: [{ order: 'clean' }],
    //     code: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       vicinage.apply(
    //         {
    //           padding: 10,
    //           animationDuration: '100ms',
    //           fontSize: 12,
    //         }
    //       )
    //     `,
    //     output: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       vicinage.apply(
    //         {
    //           padding: 10,
    //           fontSize: 12,
    //           animationDuration: '100ms',
    //         }
    //       )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "fontSize" should be above "animationDuration"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       const obj = { fontSize: '12px' }
    //       vicinage.apply(
    //         {
    //           alignItems: 'center',
    //           display: 'flex',
    //           ...obj,
    //           alignSelf: 'center',
    //           borderColor: 'red', // ok
    //         }
    //       )
    //     `,
    //     output: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       const obj = { fontSize: '12px' }
    //       vicinage.apply(
    //         {
    //           alignItems: 'center',
    //           display: 'flex',
    //           ...obj,
    //           borderColor: 'red', // ok
    //           alignSelf: 'center',
    //         }
    //       )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "borderColor" should be above "alignSelf"',
    //       },
    //     ],
    //   },
    //   {
    //     options: [{ order: 'clean' }],
    //     code: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       const obj = { fontSize: '12px' }
    //       vicinage.apply(
    //         {
    //           alignItems: 'center',
    //           display: 'flex',
    //           ...obj,
    //           borderColor: 'red', // ok
    //           alignSelf: 'center',
    //         }
    //       )
    //     `,
    //     output: /* js */ `
    //       import * as vicinage from 'vicinage'
    //       const obj = { fontSize: '12px' }
    //       vicinage.apply(
    //         {
    //           display: 'flex',
    //           alignItems: 'center',
    //           ...obj,
    //           alignSelf: 'center',
    //           borderColor: 'red', // ok
    //         }
    //       )
    //     `,
    //     errors: [
    //       {
    //         message: 'Style property key "display" should be above "alignItems"',
    //       },
    //       {
    //         message:
    //           'Style property key "alignSelf" should be above "borderColor"',
    //       },
    //     ],
    //   },
    {
      code: /* js */ `
          import { apply } from 'vicinage'
          apply(
            {
              alignItems: 'center',
              display: 'flex',
              borderColor: 'red',
            }
          )
        `,
      output: /* js */ `
          import { apply } from 'vicinage'
          apply(
            {
              alignItems: 'center',
              borderColor: 'red',
              display: 'flex',
            }
          )
        `,
      errors: [
        {
          message: 'Style property key "borderColor" should be above "display"',
        },
      ],
    },
    {
      options: [{ order: 'clean' }],
      code: /* js */ `
          import { apply } from 'vicinage'
          apply(
            {
              alignItems: 'center',
              display: 'flex',
              borderColor: 'red',
            }
          )
        `,
      output: /* js */ `
          import { apply } from 'vicinage'
          apply(
            {
              display: 'flex',
              alignItems: 'center',
              borderColor: 'red',
            }
          )
        `,
      errors: [
        {
          message: 'Style property key "display" should be above "alignItems"',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            display: 'flex',
            borderColor: {
              default: 'green',
              '@media (min-width: 1540px)': 1366,
              ':hover': 'red',
            },
            borderRadius: 10,
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            borderColor: {
              default: 'green',
              '@media (min-width: 1540px)': 1366,
              ':hover': 'red',
            },
            display: 'flex',
            borderRadius: 10,
          },
        )
        `,
      errors: [
        {
          message: 'Style property key "borderColor" should be above "display"',
        },
        {
          message:
            'Style property key ":hover" should be above "@media (min-width: 1540px)"',
        },
      ],
    },
    {
      options: [{ order: 'clean' }],
      code: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            borderColor: {
              default: 'green',
              '@media (min-width: 1540px)': 1366,
              ':hover': 'red',
            },
            display: 'flex',
            borderRadius: 10,
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            display: 'flex',
            borderColor: {
              default: 'green',
              '@media (min-width: 1540px)': 1366,
              ':hover': 'red',
            },
            borderRadius: 10,
          },
        )
        `,
      errors: [
        {
          message:
            'Style property key ":hover" should be above "@media (min-width: 1540px)"',
        },
        {
          message: 'Style property key "display" should be above "borderColor"',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            backgroundColor: {
              // a
              ':hover': 'blue', // a
              // b
              default: 'red', // b
            },
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            backgroundColor: {
              // b
              default: 'red', // b
              // a
              ':hover': 'blue', // a
            },
          },
        )
        `,
      errors: [
        {
          message: 'Style property key "default" should be above ":hover"',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            display: 'flex',
            backgroundColor: {
              // foo
              default: 'red',
              // bar
              /* Block comment */
              ':hover': 'brown',
            },
          }
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            backgroundColor: {
              // foo
              default: 'red',
              // bar
              /* Block comment */
              ':hover': 'brown',
            },
            display: 'flex',
          }
        )
        `,
      errors: [
        {
          message:
            'Style property key "backgroundColor" should be above "display"',
        },
      ],
    },
    {
      options: [{ order: 'clean' }],
      code: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            backgroundColor: {
              // foo
              default: 'red',
              // bar
              /* Block comment */
              ':hover': 'brown',
            },
            display: 'flex',
          }
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        apply(
          {
            display: 'flex',
            backgroundColor: {
              // foo
              default: 'red',
              // bar
              /* Block comment */
              ':hover': 'brown',
            },
          }
        )
        `,
      errors: [
        {
          message:
            'Style property key "display" should be above "backgroundColor"',
        },
      ],
    },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         // zee
    //         backgroundColor: 'red', // foo
    //         // bar
    //         alignItems: 'center' // eee
    //       }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         // bar
    //         alignItems: 'center', // eee
    //         // zee
    //         backgroundColor: 'red', // foo
    //       }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       { backgroundColor: 'red', alignItems: 'center', }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       { alignItems: 'center', backgroundColor: 'red', }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       { // foo
    //         // foo
    //         backgroundColor: 'red', // bar
    //         // bar
    //         alignItems: 'center' // baz
    //         // qux
    //       }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       { // foo
    //         // bar
    //         alignItems: 'center', // baz
    //         // foo
    //         backgroundColor: 'red', // bar
    //         // qux
    //       }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         /*
    //         *
    //         * foo
    //         * bar
    //         * baz
    //         *
    //         */
    //         backgroundColor: 'red',
    //         alignItems: 'center'
    //       }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         alignItems: 'center',
    //         /*
    //         *
    //         * foo
    //         * bar
    //         * baz
    //         *
    //         */
    //         backgroundColor: 'red',
    //       }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         backgroundColor: 'red',             //       foo
    //         alignItems: 'center'       // baz
    //       }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         alignItems: 'center',       // baz
    //         backgroundColor: 'red',             //       foo
    //       }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         /*
    //         * foo
    //         */ backgroundColor: 'red',
    //         alignItems: 'center'
    //       }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         alignItems: 'center',
    //         /*
    //         * foo
    //         */ backgroundColor: 'red',
    //       }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    //   {
    //     code: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         // foo
    //
    //         backgroundColor: 'red',
    //         alignItems: 'center'
    //       }
    //     )
    //     `,
    //     output: /* js */ `
    //     import * as vicinage from 'vicinage'
    //     vicinage.apply(
    //       {
    //         // foo
    //
    //         alignItems: 'center',
    //         backgroundColor: 'red',
    //       }
    //     )
    //     `,
    //     errors: [
    //       {
    //         message:
    //           'Style property key "alignItems" should be above "backgroundColor"',
    //       },
    //     ],
    //   },
    {
      options: [{ allowLineSeparatedGroups: true }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            alignItems: 'center',
            display: 'flex',
            // foo

            // bar
            alignSelf: 'center',
            borderColor: 'black',
          }
        )
        `,
      output: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            alignItems: 'center',
            display: 'flex',
            // foo

            borderColor: 'black',
            // bar
            alignSelf: 'center',
          }
        )
        `,
      errors: [
        {
          message:
            'Style property key "borderColor" should be above "alignSelf"',
        },
      ],
    },
    {
      options: [{ order: 'clean', allowLineSeparatedGroups: true }],
      code: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            alignItems: 'center',
            display: 'flex',
            // foo

            // bar
            borderColor: 'black',
            alignSelf: 'center',
          }
        )
        `,
      output: /* js */ `
        import { apply as applySheet } from 'vicinage'
        applySheet(
          {
            display: 'flex',
            alignItems: 'center',
            // foo

            alignSelf: 'center',
            // bar
            borderColor: 'black',
          }
        )
        `,
      errors: [
        {
          message: 'Style property key "display" should be above "alignItems"',
        },
        {
          message:
            'Style property key "alignSelf" should be above "borderColor"',
        },
      ],
    },
    //   // {
    //   //   options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //   //   code: /* js */ `
    //   //     import { css } from 'a'
    //   //     const styles = css.create(
    //   //       {
    //   //         animationDuration: '100ms',
    //   //         padding: 10,
    //   //         fontSize: 12,
    //   //       }
    //   //     )
    //   //   `,
    //   //   output: /* js */ `
    //   //     import { css } from 'a'
    //   //     const styles = css.create(
    //   //       {
    //   //         padding: 10,
    //   //         animationDuration: '100ms',
    //   //         fontSize: 12,
    //   //       }
    //   //     )
    //   //   `,
    //   //   errors: [
    //   //     {
    //   //       message:
    //   //         'Style property key "padding" should be above "animationDuration"',
    //   //     },
    //   //   ],
    //   // },
    //   // {
    //   //   options: [
    //   //     {
    //   //       validImports: [{ from: 'a', as: 'css' }],
    //   //       order: 'clean',
    //   //     },
    //   //   ],
    //   //   code: /* js */ `
    //   //     import { css } from 'a'
    //   //     const styles = css.create(
    //   //       {
    //   //         padding: 10,
    //   //         animationDuration: '100ms',
    //   //         fontSize: 12,
    //   //       }
    //   //     )
    //   //   `,
    //   //   output: /* js */ `
    //   //     import { css } from 'a'
    //   //     const styles = css.create(
    //   //       {
    //   //         padding: 10,
    //   //         fontSize: 12,
    //   //         animationDuration: '100ms',
    //   //       }
    //   //     )
    //   //   `,
    //   //   errors: [
    //   //     {
    //   //       message:
    //   //         'Style property key "fontSize" should be above "animationDuration"',
    //   //     },
    //   //   ],
    //   // },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              ':hover': 10,
              default: 20,
            },
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              default: 20,
              ':hover': 10,
            },
          },
        )
        `,
      errors: [
        {
          message: 'Style property key "default" should be above ":hover"',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              ':focus': 10,
              ':hover': 20,
            },
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              ':hover': 20,
              ':focus': 10,
            },
          },
        )
        `,
      errors: [
        {
          message: 'Style property key ":hover" should be above ":focus"',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            width: {
              [when.siblingAfter(':active')]: 30,
              [when.descendant(':focus')]: 20,
            },
            display: 'flex',
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              [when.siblingAfter(':active')]: 30,
              [when.descendant(':focus')]: 20,
            },
          },
        )
        `,
      errors: [
        {
          message:
            'Style property key ":when:descendant:focus" should be above ":when:siblingAfter:active"',
        },
        {
          message: 'Style property key "display" should be above "width"',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              [when.siblingAfter(':active')]: 30,
              [when.descendant(':focus')]: 20,
            },
          },
        )
        `,
      output: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '@stylexjs/stylex'
        apply(
          {
            display: 'flex',
            width: {
              [when.descendant(':focus')]: 20,
              [when.siblingAfter(':active')]: 30,
            },
          },
        )
        `,
      errors: [
        {
          message:
            'Style property key ":when:descendant:focus" should be above ":when:siblingAfter:active"',
        },
      ],
    },
    {
      code: [
        `import { apply } from 'vicinage'`,
        `import { when } from '@stylexjs/stylex'`,
        `apply(`,
        `  {`,
        `    display: 'flex',`,
        `    width: {`,
        '      [when[api](`:focus`)]: 20,',
        '      [when[api](`:active`)]: 30,',
        `    },`,
        `  },`,
        `)`,
      ].join('\n'),
      output: [
        `import { apply } from 'vicinage'`,
        `import { when } from '@stylexjs/stylex'`,
        `apply(`,
        `  {`,
        `    display: 'flex',`,
        `    width: {`,
        '      [when[api](`:active`)]: 30,',
        '      [when[api](`:focus`)]: 20,',
        `    },`,
        `  },`,
        `)`,
      ].join('\n'),

      errors: [
        {
          message:
            'Style property key ":when:api:active" should be above ":when:api:focus"',
        },
      ],
    },
  ],
})
