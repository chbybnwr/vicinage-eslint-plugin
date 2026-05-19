import rule from './valid-styles'
import { RuleTester } from 'eslint'

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

const engine = '@stylexjs/stylex'
const token = 'stylex'

function message(strings: TemplateStringsArray): string {
  const [block] = strings

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return block!
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
}

ruleTester.run('valid-styles', rule, {
  valid: [
    // test for local static variables
    /* js */ `
      import { apply } from 'vicinage'
      const start = 'start'
      apply({
          textAlign: start,
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          transitionProperty: 'opacity, transform',
          transitionDuration: '0.3s',
          transitionTimingFunction: 'ease',
      })
    `,
    /* js */ `
      import { apply } from 'vicinage'
      apply({
          marginInlineStart: '10px',
          marginInlineEnd: '5px',
          marginInline: '15px',
          marginBlock: '20px',
          paddingInlineStart: '8px',
          paddingInlineEnd: '12px',
          paddingInline: '10px',
          paddingBlock: '16px',
      })
    `,
    /* js */ `
      const { apply } = require('vicinage')

      apply({
          marginInlineStart: '10px',
          marginInlineEnd: '5px',
          marginInline: '15px',
          marginBlock: '20px',
          paddingInlineStart: '8px',
          paddingInlineEnd: '12px',
          paddingInline: '10px',
          paddingBlock: '16px',
      })
    `,
    /* js */ `
      import { apply } from 'vicinage'
      const start = 'start'
      const grayscale = 'grayscale'
      apply({
          textAlign: start,
          MozOsxFontSmoothing: grayscale,
          WebkitFontSmoothing: 'antialiased',
          transitionProperty: 'opacity, transform',
          transitionDuration: '0.3s',
          transitionTimingFunction: 'ease',
      })
    `,
    /* js */ `
      import { apply } from 'vicinage'
      import { keyframes } from '${engine}'
      const bounce = keyframes({
        '0%': {
          transform: 'translateY(0)',
        },
        '50%': {
          transform: 'translateY(-10px)',
        },
        '100%': {
          transform: 'translateY(0)',
        }
      })
      apply({
          animationName: bounce,
          animationDuration: '1s',
          animationIterationCount: 'infinite',
      })
    `,
    /* js */ `
      import { apply } from 'vicinage'
      import { keyframes } from '${engine}'
      apply({
          animationName: keyframes({
            '0%': {
              transform: 'translateY(0)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
            '100%': {
              transform: 'translateY(0)',
            },
          }),
          animationDuration: '1s',
          animationIterationCount: 'infinite',
      })
    `,
    /* js */ `
      import { apply } from 'vicinage'
      import { keyframes } from '${engine}'
      const bounce = keyframes({
        '0%': {
          transform: 'translateY(0)',
        },
        '50%': {
          transform: 'translateY(-10px)',
        },
        '100%': {
          transform: 'translateY(0)',
        }
      })
      const shimmy = keyframes({
        '0%': {
          backgroundPosition: '-468px 0',
        },
        '100%': {
          backgroundPosition: '468px 0',
        }
      })
      apply({
          animationName: \`\${bounce}, \${shimmy}\`,
          animationDuration: '1s',
          animationIterationCount: 'infinite',
      })
    `,
    // test for nested styles
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        const TRANSPARENT = 0
        const OPAQUE = 1
        apply({
            opacity: {
              default: TRANSPARENT,
              ':hover': OPAQUE,
            },
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { keyframes as kf } from '${engine}'
        const fadeIn = kf({
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          }
        })
        apply({
            animationName: fadeIn,
        })
      `,
    },
    {
      code: /* js */ `
        import * as stlx from '${engine}'
        const fadeIn = stlx.keyframes({
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          }
        })
        apply({
            animationName: fadeIn,
        })
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            width: {
              '@starting-style': {
                default: 10,
                ':hover': 20,
              }
            },
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '${engine}'
        apply({
            width: {
              default: 10,
              [when.descendant(':focus')]: 20,
              [when.siblingAfter(':active')]: 30,
            },
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '${engine}'
        import { colors } from './vars.${token}'

        apply({
            backgroundColor: {
              default: colors.bg,
              [when.descendant(':focus')]: colors.bgFocus,
              [when.siblingAfter(':active')]: colors.bgActive,
            },
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '${engine}'
        apply({
            '::after': {
              backgroundColor: {
                default: 'transparent',
                [when.descendant(':focus')]: 'blue',
                [when.siblingAfter(':active')]: 'red',
              },
            },
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '${engine}'
        import { colors } from './vars.${token}'

        apply({
            '::after': {
              backgroundColor: {
                default: colors.bg,
                [when.descendant(':focus')]: colors.bgFocus,
                [when.siblingAfter(':active')]: colors.bgActive,
              },
            },
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    // test for positive numbers
    /* js */ `
      import { apply } from 'vicinage'
      apply({default: {marginInlineStart: 5}})
    `,
    // test for negative values.
    /* js */ `
      import { apply } from 'vicinage'
      apply({default: {marginInlineStart: -5}})
    `,
    // test for unitless length value 0
    /* js */ `
      import { apply } from 'vicinage'
      apply({default: {margin: 0}})
    `,
    /* js */ `
      import { apply } from 'vicinage'
      apply({default: {padding: '0'}})
    `,
    /* js */ `
      import { apply } from 'vicinage'
      apply({default: {textAlign: 'start'}})
    `,
    // test for presets
    /* js */ `
      import { apply } from 'vicinage'
      apply({
          textAlign: 'start',
      })
    `,
    // test for Math
    /* js */ `import { apply } from 'vicinage'
     apply({
         marginInlineStart: Math.abs(-1),
         marginInlineEnd: \`\${Math.floor(5 / 2)}px\`,
         paddingInlineStart: Math.ceil(5 / 2),
         paddingInlineEnd: Math.round(5 / 2),
     })`,
    // test for locally declared constants
    /* js */ `import { apply } from 'vicinage'
    const FOO = 5
     apply({
         scrollMarginTop: FOO + 5,
         scrollMarginBottom: FOO * 5,
     })`,
    /* js */ `import { apply } from 'vicinage'
     const x = 5
     apply({
         marginInlineStart: Math.abs(x),
         marginInlineEnd: \`\${Math.floor(x)}px\`,
         paddingInlineStart: Math.ceil(-x),
         paddingInlineEnd: Math.round(x / 2),
     })`,
    // test for WebkitAppearance with 'none'
    /* js */ `import { apply } from 'vicinage'
     apply({
         'WebkitAppearance': 'none',
     })`,
    // test for Search
    /* js */ `import { apply } from 'vicinage'
     apply({
         'WebkitAppearance': 'textfield',
         '::-webkit-search-decoration': {
           appearance: 'none',
         },
         '::-webkit-search-cancel-button': {
           appearance: 'none',
         },
         '::-webkit-search-results-button': {
           appearance: 'none',
         },
         '::-webkit-search-results-decoration': {
           appearance: 'none',
         },
     })`,
    // test for input ranges
    /* js */ `import { apply } from 'vicinage'
     apply({
         'WebkitAppearance': 'textfield',
         '::-webkit-slider-thumb': {
           appearance: 'none',
         },
         '::-webkit-slider-runnable-track': {
           appearance: 'none',
         },
         '::-moz-range-thumb': {
           appearance: 'none',
         },
         '::-moz-range-track': {
           appearance: 'none',
         },
         '::-moz-range-progress': {
           appearance: 'none',
         },
     })`,
    // test for color
    /* js */ `import { apply } from 'vicinage'
     apply({
         'color': 'red',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'color': '#fff',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'color': '#fafbfc',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'color': '#fafbfcfc',
     })`,
    // test for relative width
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30rem',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30em',
      })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30ch',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30ex',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30vh',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30vw',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'contain': '300px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'containIntrinsicSize': '300px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'containIntrinsicSize': 'auto 300px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         interpolateSize: 'numeric-only',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         interpolateSize: 'allow-keywords',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'containIntrinsicInlineSize': '300px',
         'containIntrinsicBlockSize': '200px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'containIntrinsicInlineSize': 'auto 300px',
         'containIntrinsicBlockSize': 'auto 200px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'containIntrinsicWidth': '300px',
         'containIntrinsicHeight': '200px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'containIntrinsicWidth': 'auto 300px',
         'containIntrinsicHeight': 'auto 200px',
     })`,

    // test for absolute width
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30px',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30cm',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30mm',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30in',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30pc',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '30pt',
     })`,
    // test for percentage
    /* js */ `import { apply } from 'vicinage'
     apply({
         'width': '50%',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
         fontWeight: 'var(--weight)',
     })`,
    /* js */ `import { apply } from 'vicinage'
     apply({
        fontWeight: 'var(--🔴)',
    })`,
    /* js */ `
    import { apply } from 'vicinage'
    const red = 'var(--🔴)'
    apply({
        fontWeight: red,
    })`,
    // test for field-sizing
    /* js */ `
    import { apply } from 'vicinage'
    const red = 'var(--🔴)'
    apply({
        fieldSizing: 'fixed',
    })`,
    /* js */ `
    import { apply } from 'vicinage'
    const red = 'var(--🔴)'
    apply({
        fieldSizing: 'content',
    })`,
    // test for create vars tokens
    /* js */ `
    import { apply } from 'vicinage'
    import {TextTypeTokens as TextType, ColorTokens} from 'DspSharedTextTokens.${token}'
    apply({
        fontSize: TextType.fontSize,
        borderColor: ColorTokens.borderColor,
        paddingBottom: TextType.paddingBottom,
        fontFamily: \`\${TextType.defaultFontFamily}, \${TextType.fallbackFontFamily}\`,
    })
    `,
    // test using vars as keys
    /* js */ `
    import { apply } from 'vicinage'
    import { componentVars } from './bug.${token}'
    apply({
        [componentVars.color]: 'blue',
    })
    `,
    // test using vars as keys in dynamic styles
    // /* js */ `
    // import { apply } from 'vicinage'
    // import { tokens } from 'tokens.${token}'
    // apply({
    //     [tokens.position]: () => \`\${position}px\`,
    // })
    // `,
    // // test using member expressions on function params in dynamic styles
    // /* js */ `
    // import { apply } from 'vicinage'
    // apply({
    //     backgroundColor: () => props.badgeColor,
    //     color: () => props.color,
    // })
    // `,
    // // test member expressions on function params with pseudo-classes
    // /* js */ `
    // import { apply } from 'vicinage'
    // apply({
    //     color: {
    //       default: () => props.textColor,
    //       ':hover': () => props.hoverColor,
    //     }
    // })
    // `,
    // test importing vars from paths including theme file extension
    /* js */ `
    import { apply } from 'vicinage'
    import { vars } from './vars.${token}'
    import { varsJs } from './vars.${token}.js'
    import { varsTs } from './vars.${token}.ts'
    import { varsTsx } from './vars.${token}.tsx'
    import { varsJsx } from './vars.${token}.jsx'
    import { varsMjs } from './vars.${token}.mjs'
    import { varsCjs } from './vars.${token}.cjs'
    apply({
        [vars.color]: 'blue',
        [varsJs.color]: 'blue',
        [varsTs.color]: 'blue',
        [varsTsx.color]: 'blue',
        [varsJsx.color]: 'blue',
        [varsMjs.color]: 'blue',
        [varsCjs.color]: 'blue',
    })
    `,
    // test importing consts from paths including consts file extension
    /* js */ `
        import { apply } from 'vicinage'
        import { consts } from './vars.${token}.const.js'
        import { constsJs } from './consts.${token}.const.js'
        import { constsTs } from './consts.${token}.const.ts'
        import { constsTsx } from './consts.${token}.const.tsx'
        import { constsJsx } from './consts.${token}.const.jsx'
        import { constsMjs } from './consts.${token}.const.mjs'
        import { constsCjs } from './consts.${token}.const.cjs'
        apply({
            borderRadius: consts.borderRadius,
            margin: constsJs.margin,
            padding: constsTs.padding,
            height: constsTsx.height,
            width: constsJsx.width,
            minHeight: constsMjs.minHeight,
            maxWidth: constsCjs.maxWidth,
        })
        `,
    // test importing vars from paths including custom theme file extension
    {
      code: /* js */ `
    import { apply } from 'vicinage'
    import { vars } from './vars.css.js'
    import { consts } from './consts.css.const.js'
    apply({
        borderRadius: vars.borderRadius,
        margin: consts.margin,
    })
    `,
      options: [{ themeFileExtension: '.css' }],
    },
    // test for positionTryFallbacks with 'none'
    /* js */ `
    import { apply } from 'vicinage'
    apply({
        positionTryFallbacks: 'none',
    })
    `,
    // test for positionTryFallbacks with `positionTry` references
    /* js */ `
    import { apply } from 'vicinage'
    import { positionTry } from '${engine}'

    const fallback = positionTry({
      positionAnchor: '--anchor',
      top: '0',
      left: '0',
      width: '100px',
      height: '100px'
    })
    apply({
        positionTryFallbacks: fallback,
    })
    `,
    // test for positionTryFallbacks with a template literal containing multiple `positionTry` references
    /* js */ `
    import { apply } from 'vicinage'
    import { positionTry } from '${engine}'

    const fallback1 = positionTry({
      positionAnchor: '--anchor',
      top: '0',
      left: '0',
      width: '100px',
      height: '100px'
    })
    const fallback2 = positionTry({
      positionAnchor: '--anchor',
      bottom: '0',
      right: '0',
      width: '100px',
      height: '100px'
    })
    apply({
        positionTryFallbacks: \`\${fallback1}, \${fallback2}\`,
    })
    `,
    // test for ternary and logical expressions
    // {
    //   code: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         color: () => condition ? 'blue' : 'red',
    //         display: () => condition ? 'block' : 'none',
    //         fontSize: () => condition ? '10px' : '20px',
    //         fontWeight: () => condition ? 'bold' : 'normal',
    //         opacity: () => condition ? 0.5 : 1,
    //         zIndex: () => condition ? 10 + 10 : Math.max(10, 20),
    //     })
    //   `,
    // },
    // {
    //   code: /* js */ `
    //     import { apply } from 'vicinage'
    //     const COLOR = 'blue'
    //     const sizeSmall = '10px'
    //     const sizeMedium = '20px'
    //     const sizeLarge = '30px'
    //     apply({
    //         fontSize: () => condition ? sizeSmall : sizeMedium,
    //         backgroundColor: () => conditionA ? COLOR : conditionB ? 'green' : 'yellow',
    //         fontSize: () => conditionA ? sizeSmall : conditionB ? sizeMedium : sizeLarge,
    //     })
    //   `,
    // },
    // {
    //   code: /* js */ `
    //     import { apply } from 'vicinage'
    //     const COLOR = 'blue'
    //     apply({
    //         backgroundColor: () => conditionA ? COLOR : conditionB ? 'green' : 'yellow',
    //         fontSize: () => conditionA ? 14 : conditionB ? 16 : 18,
    //         opacity: () => conditionA ? 0.5 : conditionB ? 1 : 0.2,
    //     })
    //   `,
    // },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        const condition = true
        apply({
            float: condition ? 'inline-start' : 'inline-end',
            clear: condition ? 'inline-start' : 'left',
        })
      `,
    },
    // {
    //   code: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         '::before': {
    //           content: () => condition ? '""' : '"*"',
    //         },
    //     })
    //   `,
    // },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        const zIndexConst = 10
        const widthConst = 0
        const widthConst2 = 3
        const isMobile = false
        apply({
            color: 'blue' || 'green',
            zIndex: zIndexConst ?? 10,
            width: isMobile ? (widthConst || '100%') : (widthConst2 ?? '200%'),
        })
      `,
    },
    // bare numbers for px-related properties
    /* js */ `
      import { apply } from 'vicinage'
      apply({
          backgroundPositionX: 10,
          backgroundPositionY: 20,
          outlineWidth: 2,
          textDecorationThickness: 3,
          textUnderlineOffset: 4,
          overflowClipMargin: 5,
      })
    `,
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            outlineOffset: 2,
        })
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            strokeDasharray: 100,
        })
      `,
    },
    // bare numbers for time-based properties
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            animationDelay: 200,
            animationDuration: 300,
            transitionDelay: 100,
            transitionDuration: 500,
        })
      `,
    },
  ],
  invalid: [
    // {
    //   code: /* js */ `import { apply } from 'vicinage'
    // import { FOO } from 'foo'
    //  apply({
    //      scrollMarginTop: FOO + 5,
    //    },
    //  })`,
    //   errors: [
    //     {
    //       message:
    //         'scrollMarginTop value must be one of:\n' +
    //         'a number literal or math expression\n' +
    //         'a string literal\n' +
    //         'null\n' +
    //         'initial\n' +
    //         'inherit\n' +
    //         'unset\n' +
    //         'revert',
    //     },
    //   ],
    // },
    {
      code: /* js */ `import { apply } from 'vicinage'
    const FOO = 'bad string'
     apply({
         scrollMarginTop: FOO + 5,
     })`,
      errors: [
        {
          message:
            'scrollMarginTop value must be one of:\n' +
            'a number literal or math expression\n' +
            'a string literal\n' +
            'null\n' +
            'initial\n' +
            'inherit\n' +
            'unset\n' +
            'revert',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {textAlin: 'left'}})
      `,
      errors: [
        {
          message: 'This is not a key that is allowed',
          suggestions: [
            {
              desc: 'Did you mean "textAlign"?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {textAlign: 'left'}})
      `,
            },
          ],
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {marginStart: 10}})
      `,
      errors: [
        {
          message: 'This is not a key that is allowed',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {['textAlin']: 'left'}})
      `,
      errors: [
        {
          message: 'This is not a key that is allowed',
          suggestions: [
            {
              desc: 'Did you mean "textAlign"?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {['textAlign']: 'left'}})
      `,
            },
          ],
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {textAlign: 'lfet'}})
      `,
      errors: [
        {
          message: message`
            textAlign value must be one of:
            start
            end
            left
            right
            center
            justify
            match-parent
            null
            initial
            inherit
            unset
            revert
          `,
          suggestions: [
            {
              desc: 'Did you mean "left"? Replace "lfet" with "left"',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {textAlign: 'left'}})
      `,
            },
          ],
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {fontWeight: 10001}})
      `,
      errors: [
        {
          message: message`
            fontWeight value must be one of:
            normal
            bold
            bolder
            lighter
            a number between 1 and 1000
            a CSS Variable
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({default: {content: 100 + 100}})
      `,
      errors: [
        {
          message: message`
            content value must be one of:
            a string literal
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { keyframes } from '${engine}'
        const bounce = keyframes({
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0)',
          }
        })
        apply({
            animationName: bob,
            animationDuration: '1s',
            animationIterationCount: 'infinite',
        })
      `,
      errors: [
        {
          message: message`
            animationName value must be one of:
            none
            a \`keyframes(...)\` function call, a reference to it or a many such valid
            null
            initial
            inherit
            unset
            revert
          `,
          suggestions: [],
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'
      import {TextTypeTokens as TextType, ColorTokens} from 'DspSharedTextTokens'
      apply({
          fontSize: TextType.fontSize,
          borderColor: ColorTokens.borderColor,
          paddingBottom: TextType.paddingBottom,
          fontFamily: \`\${TextType.fontFamily}, \${TextType.fallbackFontFamily}\`,
      })
      `,
      errors: [
        {
          message:
            'borderColor value must be one of:\n' +
            'a string literal\n' +
            'aliceblue\n' +
            'antiquewhite\n' +
            'aqua\n' +
            'aquamarine\n' +
            'azure\n' +
            'beige\n' +
            'bisque\n' +
            'black\n' +
            'blanchedalmond\n' +
            'blue\n' +
            'blueviolet\n' +
            'brown\n' +
            'burlywood\n' +
            'cadetblue\n' +
            'chartreuse\n' +
            'chocolate\n' +
            'coral\n' +
            'cornflowerblue\n' +
            'cornsilk\n' +
            'crimson\n' +
            'cyan\n' +
            'darkblue\n' +
            'darkcyan\n' +
            'darkgoldenrod\n' +
            'darkgray\n' +
            'darkgrey\n' +
            'darkgreen\n' +
            'darkkhaki\n' +
            'darkmagenta\n' +
            'darkolivegreen\n' +
            'darkorange\n' +
            'darkorchid\n' +
            'darkred\n' +
            'darksalmon\n' +
            'darkseagreen\n' +
            'darkslateblue\n' +
            'darkslategray\n' +
            'darkslategrey\n' +
            'darkturquoise\n' +
            'darkviolet\n' +
            'deeppink\n' +
            'deepskyblue\n' +
            'dimgray\n' +
            'dimgrey\n' +
            'dodgerblue\n' +
            'firebrick\n' +
            'floralwhite\n' +
            'forestgreen\n' +
            'fuchsia\n' +
            'gainsboro\n' +
            'ghostwhite\n' +
            'gold\n' +
            'goldenrod\n' +
            'gray\n' +
            'grey\n' +
            'green\n' +
            'greenyellow\n' +
            'honeydew\n' +
            'hotpink\n' +
            'indianred\n' +
            'indigo\n' +
            'ivory\n' +
            'khaki\n' +
            'lavender\n' +
            'lavenderblush\n' +
            'lawngreen\n' +
            'lemonchiffon\n' +
            'lightblue\n' +
            'lightcoral\n' +
            'lightcyan\n' +
            'lightgoldenrodyellow\n' +
            'lightgray\n' +
            'lightgrey\n' +
            'lightgreen\n' +
            'lightpink\n' +
            'lightsalmon\n' +
            'lightseagreen\n' +
            'lightskyblue\n' +
            'lightslategray\n' +
            'lightslategrey\n' +
            'lightsteelblue\n' +
            'lightyellow\n' +
            'lime\n' +
            'limegreen\n' +
            'linen\n' +
            'magenta\n' +
            'maroon\n' +
            'mediumaquamarine\n' +
            'mediumblue\n' +
            'mediumorchid\n' +
            'mediumpurple\n' +
            'mediumseagreen\n' +
            'mediumslateblue\n' +
            'mediumspringgreen\n' +
            'mediumturquoise\n' +
            'mediumvioletred\n' +
            'midnightblue\n' +
            'mintcream\n' +
            'mistyrose\n' +
            'moccasin\n' +
            'navajowhite\n' +
            'navy\n' +
            'oldlace\n' +
            'olive\n' +
            'olivedrab\n' +
            'orange\n' +
            'orangered\n' +
            'orchid\n' +
            'palegoldenrod\n' +
            'palegreen\n' +
            'paleturquoise\n' +
            'palevioletred\n' +
            'papayawhip\n' +
            'peachpuff\n' +
            'peru\n' +
            'pink\n' +
            'plum\n' +
            'powderblue\n' +
            'purple\n' +
            'red\n' +
            'rosybrown\n' +
            'royalblue\n' +
            'saddlebrown\n' +
            'salmon\n' +
            'sandybrown\n' +
            'seagreen\n' +
            'seashell\n' +
            'sienna\n' +
            'silver\n' +
            'skyblue\n' +
            'slateblue\n' +
            'slategray\n' +
            'slategrey\n' +
            'snow\n' +
            'springgreen\n' +
            'steelblue\n' +
            'tan\n' +
            'teal\n' +
            'thistle\n' +
            'tomato\n' +
            'turquoise\n' +
            'violet\n' +
            'wheat\n' +
            'white\n' +
            'whitesmoke\n' +
            'yellow\n' +
            'yellowgreen\n' +
            'rebeccapurple\n' +
            'a valid hex color (#FFAADD or #FFAADDFF)\n' +
            'null\n' +
            'initial\n' +
            'inherit\n' +
            'unset\n' +
            'revert',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            float: 'start',
            clear: 'start',
        })
        apply({
            float: 'end',
            clear: 'end',
        })
      `,
      errors: [
        {
          message:
            'The value "start" is not a standard CSS value for "float". Did you mean "inline-start"?',
          suggestions: [
            {
              desc: 'Replace "start" with "inline-start"?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            float: 'inline-start',
            clear: 'start',
        })
        apply({
            float: 'end',
            clear: 'end',
        })
      `,
            },
          ],
        },
        {
          message:
            'The value "start" is not a standard CSS value for "clear". Did you mean "inline-start"?',
          suggestions: [
            {
              desc: 'Replace "start" with "inline-start"?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            float: 'start',
            clear: 'inline-start',
        })
        apply({
            float: 'end',
            clear: 'end',
        })
      `,
            },
          ],
        },
        {
          message:
            'The value "end" is not a standard CSS value for "float". Did you mean "inline-end"?',
          suggestions: [
            {
              desc: 'Replace "end" with "inline-end"?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            float: 'start',
            clear: 'start',
        })
        apply({
            float: 'inline-end',
            clear: 'end',
        })
      `,
            },
          ],
        },
        {
          message:
            'The value "end" is not a standard CSS value for "clear". Did you mean "inline-end"?',
          suggestions: [
            {
              desc: 'Replace "end" with "inline-end"?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            float: 'start',
            clear: 'start',
        })
        apply({
            float: 'end',
            clear: 'inline-end',
        })
      `,
            },
          ],
        },
      ],
      output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            float: 'inline-start',
            clear: 'inline-start',
        })
        apply({
            float: 'inline-end',
            clear: 'inline-end',
        })
      `,
    },
    // test for ternary and logical expressions
    // {
    //   code: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         color: () => condition ? 'red' : 123,
    //         fontSize: () => condition ? true : '10px',
    //         transition: () => condition ? 'transform 1s' : ' ',
    //         zIndex: () => condition ?? 'red',
    //         display: 'invalid-display' || 'block',
    //     })
    //   `,
    //   errors: [
    //     {
    //       message: /^color value must be one of:\n/u,
    //     },
    //     {
    //       message: /^fontSize value must be one of:\n/u,
    //     },
    //     {
    //       message:
    //         'The empty string is not allowed. Use `null` to reset a style.',
    //       suggestions: [
    //         {
    //           desc: 'Replace empty string with `null`?',
    //           output: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         color: () => condition ? 'red' : 123,
    //         fontSize: () => condition ? true : '10px',
    //         transition: () => condition ? 'transform 1s' : null,
    //         zIndex: () => condition ?? 'red',
    //         display: 'invalid-display' || 'block',
    //     })
    //   `,
    //         },
    //       ],
    //     },
    //     {
    //       message: /^zIndex value must be one of:\n/u,
    //     },
    //     {
    //       message: /^display value must be one of:\n/u,
    //     },
    //   ],
    // },
    // {
    //   code: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         float: () => condition ? 'start' : 'inline-end',
    //     })
    //   `,
    //   errors: [
    //     {
    //       message:
    //         'The value "start" is not a standard CSS value for "float". Did you mean "inline-start"?',
    //       suggestions: [
    //         {
    //           desc: 'Replace "start" with "inline-start"?',
    //           output: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         float: () => condition ? 'inline-start' : 'inline-end',
    //     })`,
    //         },
    //       ],
    //     },
    //   ],
    //   output: /* js */ `
    //     import { apply } from 'vicinage'
    //     apply({
    //         float: () => condition ? 'inline-start' : 'inline-end',
    //     })
    //   `,
    // },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            display: () => conditionA ?  conditionB ? 'grid' : 'invalid-display' : 'block',
        })
      `,
      errors: [
        {
          message: /^display value must be one of:\n/u,
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            fontWeight: () => condition ? sasasa : 'bold',
            marginStart: () => condition ? '10px' : '20px',
        })
      `,
      errors: [
        {
          message: /^fontWeight value must be one of:\n/u,
        },
        {
          message: 'This is not a key that is allowed',
        },
      ],
    },
  ],
})

ruleTester.run('valid-styles [restrictions]', rule, {
  valid: [
    /* js */ `
      import { apply } from 'vicinage'
      apply({
          display: 'grid',
          grid: 'repeat(3, 80px) / auto-flow',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
      })
    `,
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            display: 'grid',
            grid: 'repeat(3, 80px) / auto-flow',
        })
      `,
      options: [
        {
          propLimits: {
            'grid+([a-zA-Z])': {
              limit: null,
              reason: 'disallow `grid-*` props but not `grid` for testing',
            },
          },
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            display: 'grid',
        })
      `,
      options: [
        {
          propLimits: {
            display: {
              limit: ['grid', 'block', 'flex'],
              reason: 'disallow `grid-*` props but not `grid` for testing',
            },
          },
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            textUnderlineOffset: 'auto',
        })
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            textUnderlineOffset: '1px',
        })
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            textUnderlineOffset: '100%',
        })
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundColor: {
              default: 'blue',
              ':focus-within': 'red',
            },
        })`,
    },
    // test for allowed raw CSS variable overrides
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            '--bar': '0',
        })
      `,
      options: [{ allowRawCSSVars: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            '::after': {
              ':hover': {
                content: ''
              }
            }
        })
      `,
      // options: [{ allowOuterPseudoAndMedia: true }],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundBlendMode: 'multiply',
        })
      `,
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundBlendMode: 'multiply, darken, exclusion',
        })
      `,
    },
  ],
  invalid: [
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            display: 'grid',
        })
      `,
      options: [
        {
          propLimits: {
            display: {
              limit: ['block', 'flex'],
              reason: 'disallow `grid-*` props but not `grid` for testing',
            },
          },
        },
      ],
      errors: [
        {
          message: message`
            display value must be one of:
            block
            flex
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            display: 'grid',
            grid: 'repeat(3, 80px) / auto-flow',
        })
      `,
      options: [
        {
          propLimits: {
            grid: {
              limit: null,
              reason: 'grid properties disallowed for testing',
            },
          },
        },
      ],
      errors: [
        {
          message: message`
            grid value must be one of:
            grid properties disallowed for testing
          `,
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
        })
      `,
      options: [
        {
          propLimits: {
            'grid*': {
              limit: null,
              reason: 'grid properties disallowed for testing',
            },
          },
        },
      ],
      errors: [
        {
          message: message`
            gridTemplateColumns value must be one of:
            grid properties disallowed for testing
          `,
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'
      apply({
          background: ''
      })
    `,
      errors: [
        {
          message:
            'The empty string is not allowed. Use `null` to reset a style.',
          suggestions: [
            {
              desc: 'Replace empty string with `null`?',
              output: /* js */ `
      import { apply } from 'vicinage'
      apply({
          background: null
      })
    `,
            },
          ],
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            textUnderlineOffset: '',
        })
      `,
      errors: [
        {
          message: message`
            textUnderlineOffset value must be one of:
            auto
            a number literal or math expression
            a number ending in px, mm, in, pc, pt
            a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax
            A string literal representing a percentage (e.g. 100%)
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    // {
    //   code: /* js */ `
    //     import { css } from 'a'
    //     const styles = css.create({
    //         background: ''
    //     })
    //   `,
    //   options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //   errors: [
    //     {
    //       message:
    //         'The empty string is not allowed. Use `null` to reset a style.',
    //       suggestions: [
    //         {
    //           desc: 'Replace empty string with `null`?',
    //           output: /* js */ `
    //     import { css } from 'a'
    //     const styles = css.create({
    //         background: null
    //     })
    //   `,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            margin: '10',
            height: '10',
        })
      `,
      errors: [
        {
          message:
            'margin value must be one of:\n' +
            'a number literal or math expression\n' +
            'a non-numeric string\n' +
            'null\n' +
            'initial\n' +
            'inherit\n' +
            'unset\n' +
            'revert',
          suggestions: [
            {
              desc: `Replace string '10' with number 10?`,
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            margin: 10,
            height: '10',
        })
      `,
            },
          ],
        },
        {
          message:
            'height value must be one of:\n' +
            'a non-numeric string\n' +
            'a number literal or math expression\n' +
            'available\n' +
            'min-content\n' +
            'max-content\n' +
            'fit-content\n' +
            'auto\n' +
            'a number ending in px, mm, in, pc, pt\n' +
            'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax\n' +
            'A string literal representing a percentage (e.g. 100%)\n' +
            'null\n' +
            'initial\n' +
            'inherit\n' +
            'unset\n' +
            'revert',
          suggestions: [
            {
              desc: `Replace string '10' with number 10?`,
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            margin: '10',
            height: 10,
        })
      `,
            },
          ],
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            margin: '10',
            marginTop: '10.1',
            marginRight: '-10',
            marginBottom: '-1.0',
            marginLeft: '-0.10',
            padding: '0.1234',
            paddingTop: '100000',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
            width: '10',
            height: '10',
            minWidth: '10',
            maxWidth: '10',
            minHeight: '10',
            maxHeight: '10',
            top: '10',
            right: '10',
            bottom: '10',
            left: '10',
            inset: '10',
            borderWidth: '10',
            borderTopWidth: '10',
            borderRightWidth: '10',
            borderBottomWidth: '10',
            borderLeftWidth: '10',
            gap: '10',
            rowGap: '10',
            columnGap: '10',
            lineHeight: '10',
            outlineWidth: '10',
        })
      `,
      errors: (
        [
          [
            'margin',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'marginTop',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'auto',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10.1',
          ],
          [
            'marginRight',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'auto',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '-10',
          ],
          [
            'marginBottom',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'auto',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '-1.0',
            '-1',
          ],
          [
            'marginLeft',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'auto',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '-0.10',
            '-0.1',
          ],
          [
            'padding',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '0.1234',
          ],
          [
            'paddingTop',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '100000',
          ],
          [
            'paddingRight',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'paddingBottom',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'paddingLeft',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'width',
            [
              'a non-numeric string',
              'a number literal or math expression',
              'available',
              'min-content',
              'max-content',
              'fit-content',
              'auto',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'A string literal representing a percentage (e.g. 100%)',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'height',
            [
              'a non-numeric string',
              'a number literal or math expression',
              'available',
              'min-content',
              'max-content',
              'fit-content',
              'auto',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'A string literal representing a percentage (e.g. 100%)',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'minWidth',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'none',
              'max-content',
              'min-content',
              'fit-content',
              'fill-available',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'maxWidth',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'none',
              'max-content',
              'min-content',
              'fit-content',
              'fill-available',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'minHeight',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'none',
              'max-content',
              'min-content',
              'fit-content',
              'fill-available',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'maxHeight',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'none',
              'max-content',
              'min-content',
              'fit-content',
              'fill-available',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'top',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'right',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'bottom',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'left',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'inset',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'borderWidth',
            [
              'a number literal or math expression',
              'thin',
              'medium',
              'thick',
              'a non-numeric string',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'borderTopWidth',
            [
              'a number literal or math expression',
              'thin',
              'medium',
              'thick',
              'a non-numeric string',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'borderRightWidth',
            [
              'a number literal or math expression',
              'thin',
              'medium',
              'thick',
              'a non-numeric string',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'borderBottomWidth',
            [
              'a number literal or math expression',
              'thin',
              'medium',
              'thick',
              'a non-numeric string',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'borderLeftWidth',
            [
              'a number literal or math expression',
              'thin',
              'medium',
              'thick',
              'a non-numeric string',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'gap',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'rowGap',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'columnGap',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'normal',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
          [
            'lineHeight',
            [
              'a number literal or math expression',
              'a non-numeric string',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
              'Be careful when fixing: lineHeight: 10px is not the same as lineHeight: 10',
            ],
            '10',
          ],
          [
            'outlineWidth',
            [
              'a number literal or math expression',
              'a number ending in px, mm, in, pc, pt',
              'a number ending in ch, em, ex, ic, rem, vh, vw, vmin, vmax, svh, dvh, lvh, svw, dvw, ldw, cqw, cqh, cqmin, cqmax',
              'null',
              'initial',
              'inherit',
              'unset',
              'revert',
            ],
            '10',
          ],
        ] as [string, string[], string, string | undefined][]
      ).map(([property, types, original, replacement]) => ({
        message: [`${property} value must be one of:`, ...types].join('\n'),
        suggestions:
          property === 'outlineWidth'
            ? []
            : [
                {
                  desc: `Replace string '${original}' with number ${replacement ?? original}?`,
                  output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            margin: '10',
            marginTop: '10.1',
            marginRight: '-10',
            marginBottom: '-1.0',
            marginLeft: '-0.10',
            padding: '0.1234',
            paddingTop: '100000',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
            width: '10',
            height: '10',
            minWidth: '10',
            maxWidth: '10',
            minHeight: '10',
            maxHeight: '10',
            top: '10',
            right: '10',
            bottom: '10',
            left: '10',
            inset: '10',
            borderWidth: '10',
            borderTopWidth: '10',
            borderRightWidth: '10',
            borderBottomWidth: '10',
            borderLeftWidth: '10',
            gap: '10',
            rowGap: '10',
            columnGap: '10',
            lineHeight: '10',
            outlineWidth: '10',
        })
      `.replace(
                    `${property}: '${original}'`,
                    `${property}: ${replacement ?? original}`,
                  ),
                },
              ],
      })),
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            positionTryFallbacks: 42,
        })
      `,
      errors: [
        {
          message: message`
            positionTryFallbacks value must be one of:
            none
            a CSS Variable
            a \`positionTry(...)\` function call, a reference to it, or a list of references
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    // test for positionTryFallbacks with incorrectly formatted template literal - missing comma
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { positionTry } from '${engine}'
        const fallback1 = positionTry({
          positionAnchor: '--anchor',
          top: '0',
          left: '0',
          width: '100px',
          height: '100px'
        })
        const fallback2 = positionTry({
          positionAnchor: '--anchor',
          bottom: '0',
          right: '0',
          width: '100px',
          height: '100px'
        })
        apply({
            positionTryFallbacks: \`\${fallback1} \${fallback2}\`,
        })
      `,
      errors: [
        {
          message: message`
            positionTryFallbacks value must be one of:
            none
            a CSS Variable
            position try fallbacks must be separated by a comma and a space (", ")
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    // test for positionTryFallbacks with incorrectly formatted template literal - missing space after comma
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { positionTry } from '${engine}'
        const fallback1 = positionTry({
          positionAnchor: '--anchor',
          top: '0',
          left: '0',
          width: '100px',
          height: '100px'
        })
        const fallback2 = positionTry({
          positionAnchor: '--anchor',
          bottom: '0',
          right: '0',
          width: '100px',
          height: '100px'
        })
        apply({
            positionTryFallbacks: \`\${fallback1},\${fallback2}\`,
        })
      `,
      errors: [
        {
          message: message`
            positionTryFallbacks value must be one of:
            none
            a CSS Variable
            position try fallbacks must be separated by a comma and a space (", ")
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    // test for disallowed raw CSS variable overrides
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            '--bar': '0',
        })
      `,
      options: [{ allowRawCSSVars: false }],
      errors: [
        {
          message: 'This is not a key that is allowed',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundBlendMode: 'invalid-blend-mode',
        })
      `,
      errors: [
        {
          message: message`
            backgroundBlendMode value must be one of:
            normal
            multiply
            screen
            overlay
            darken
            lighten
            color-dodge
            color-burn
            hard-light
            soft-light
            difference
            exclusion
            hue
            saturation
            color
            luminosity
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    // test for backgroundBlendMode with invalid blend mode value in comma-separated list
    // 'darke' should be 'darken'
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundBlendMode: 'multiply, darke, exclusion',
        })
      `,
      errors: [
        {
          message: message`
            backgroundBlendMode value must be one of:
            normal
            multiply
            screen
            overlay
            darken
            lighten
            color-dodge
            color-burn
            hard-light
            soft-light
            difference
            exclusion
            hue
            saturation
            color
            luminosity
            null
            initial
            inherit
            unset
            revert
          `,
        },
      ],
    },
    // test for incorrect spacing around comma in backgroundBlendMode
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundBlendMode: 'multiply, darken,exclusion',
        })
      `,
      errors: [
        {
          message: `backgroundBlendMode values must be separated by a comma and a space (', ')`,
          suggestions: [
            {
              desc: 'Replace comma with a comma and a space (", ")',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            backgroundBlendMode: 'multiply, darken, exclusion',
        })
      `,
            },
          ],
        },
      ],
    },
    // test for when function from other library
    {
      code: /* js */ `
             import { apply } from 'vicinage'
             import { when } from 'some-other-library'
             apply({
                 width: {
                   default: 10,
                   [when.descendant(':focus')]: 20,
                 },
             })
           `,
      // options: [{ allowOuterPseudoAndMedia: true }],
      errors: [
        {
          message: 'Computed key cannot be resolved.',
        },
      ],
    },
    // test for invalid CSS values in `when` calls
    {
      code: /* js */ `
             import { apply } from 'vicinage'
             import { when } from '${engine}'
             apply({
                 float: {
                   default: 'left',
                   [when.ancestor(':hover')]: 'dsdfdsdfsdfsdfsdfsdf',
                   [when.descendant(':focus')]: 30,
                   [when.siblingAfter(':active')]: 40,
                 },
             })
           `,
      // options: [{ allowOuterPseudoAndMedia: true }],
      errors: [
        {
          message:
            'float value must be one of:\nleft\nright\nnone\ninline-start\ninline-end\nnull\ninitial\ninherit\nunset\nrevert',
        },
        {
          message:
            'float value must be one of:\nleft\nright\nnone\ninline-start\ninline-end\nnull\ninitial\ninherit\nunset\nrevert',
        },
        {
          message:
            'float value must be one of:\nleft\nright\nnone\ninline-start\ninline-end\nnull\ninitial\ninherit\nunset\nrevert',
        },
      ],
    },
    // test for invalid CSS value in when call
    {
      code: /* js */ `
             import { apply } from 'vicinage'
             import { when } from '${engine}'
             apply({
                 float: {
                   default: 'left',
                   [when.descendant(':focus')]: 'invalid-value',
                 },
             })
           `,
      // options: [{ allowOuterPseudoAndMedia: true }],
      errors: [
        {
          message:
            'float value must be one of:\nleft\nright\nnone\ninline-start\ninline-end\nnull\ninitial\ninherit\nunset\nrevert',
        },
      ],
    },
    // test for trying to use `when` as outer key when `allowOuterPseudoAndMedia` is false
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        import { when } from '${engine}'
        apply({
            width: 10,
            [when.descendant(':focus')]: {
              width: 20,
            },
            [when.siblingAfter(':active')]: {
              width: 30,
            },
        })
      `,
      options: [{ allowOuterPseudoAndMedia: false }],
      errors: [
        {
          message: 'Keys must be strings',
        },
        {
          message: 'Keys must be strings',
        },
      ],
    },
  ],
})

ruleTester.run('valid-styles [autofixers]', rule, {
  valid: [],
  invalid: [
    // animation/font/border autofixes are only enabled in legacy-expand-shorthands mode
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            animation: 'fadeIn 1s ease-in',
        })
      `,
      errors: [
        {
          message:
            /^animation value must be one of:\n`animation` is not recommended/u,
          suggestions: [],
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            font: 'bold 16px/1.5 Arial',
        })
      `,
      errors: [
        {
          message: /^font value must be one of:\n`font` is not recommended/u,
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            border: '1px solid blue',
        })
      `,
      errors: [
        {
          message: `The 'border' property is not supported. Use the 'borderWidth', 'borderStyle' and 'borderColor' properties instead.`,
          suggestions: [
            {
              desc: `Replace 'border' with 'borderWidth', 'borderStyle' and 'borderColor' instead?`,
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'blue',
        })
      `,
            },
          ],
        },
      ],
    },
    // animation with no expansion (single value)
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            animation: 'none',
        })
      `,
      errors: [
        {
          message:
            /^animation value must be one of:\n`animation` is not recommended/u,
        },
      ],
    },
    // empty string suggest-fix
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            color: '',
        })
      `,
      errors: [
        {
          message:
            'The empty string is not allowed. Use `null` to reset a style.',
          suggestions: [
            {
              desc: 'Replace empty string with `null`?',
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            color: null,
        })
      `,
            },
          ],
        },
      ],
    },
    // grid shorthand with propLimits (user-defined, not banPropsForLegacy)
    {
      code: /* js */ `
        import { apply } from 'vicinage'
        apply({
            gridArea: '1 / 2',
        })
      `,
      options: [
        {
          propLimits: {
            gridArea: {
              limit: null,
              reason: 'gridArea shorthand is banned',
            },
          },
        },
      ],
      output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            gridColumnStart: '2',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'gridArea value must be one of:\ngridArea shorthand is banned',
          suggestions: [
            {
              desc: `Split 'gridArea' shorthand into individual longhand properties?`,
              output: /* js */ `
        import { apply } from 'vicinage'
        apply({
            gridColumnStart: '2',
            gridRowStart: '1',
        })
      `,
            },
          ],
        },
      ],
    },
  ],
})
