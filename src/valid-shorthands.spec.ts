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

ruleTester.run('valid-shorthands', validShorthands, {
  valid: [
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
          marginInlineEnd: '14px',
          marginInlineStart: '14px',
        })
      `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderRadius: 5,
      })
    `,
    },
    // border: single value passes through
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: 'none',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: 'solid',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: 0,
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          cornerShape: 'squircle',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          margin: 10,
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          marginInline: 0,
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          paddingInline: 0,
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          marginBlock: 10,
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          paddingBlock: 10,
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          padding: 'calc(0.5 * 100px)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          marginTop: '10em',
          marginInlineEnd: '5em',
          marginBottom: '15em',
          marginInlineStart: '25em',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'black',
          borderRadius: '4px'
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'rgb(0, 0, 0)',
          borderWidth: 'var(--border-width, 10)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'oklch(0.928 0.006 264.531)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'oklab(0.9 -0.003 -0.003)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'lch(50% 20 240)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'lab(50% -20 -20)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'color(display-p3 1 0.5 0)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'hwb(240 100% 50%)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'rgb(255 0 0 / 0.5)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'hsl(220 3% 15% / 10%)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'hsb(220 3% 15% / 10%)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'oklch(0.7 0.15 180 / 0.8)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'oklab(0.7 0.15 -0.1 / 0.8)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'lch(70% 15 180 / 0.8)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'lab(70% -10 20 / 0.8)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'color(display-p3 0.7 0.2 0.1 / 0.8)',
      })
    `,
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderColor: 'hwb(220 3% 15% / 10%)',
      })
    `,
    },
    // {
    //   options: [{ validImports: ['custom-vicinage'] }],
    //   code: /* js */ `
    //     import * as vicinage from 'custom-vicinage'
    //
    //     apply({
    //         marginInlineEnd: '14px',
    //         marginInlineStart: '14px',
    //     })
    //   `,
    // },
    // {
    //   options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //   code: /* js */ `
    //     import { css } from 'a'
    //
    //     css.create({
    //         borderRadius: 5,
    //     })
    //   `,
    // },
    // grid-row: numeric single value
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridRow: 1,
      })
    `,
    },
    // grid-row: compound single value, no slash
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridRow: 'span 2',
      })
    `,
    },
    // grid-column: string single value
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridColumn: '1',
      })
    `,
    },
    // grid-column: CSS keyword
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridColumn: 'auto',
      })
    `,
    },
    // grid-column: span value
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridColumn: 'span 3',
      })
    `,
    },
    // grid-template: single value, no slash
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridTemplate: 'none',
      })
    `,
    },
    // grid-area: CSS keyword
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridArea: 'auto',
      })
    `,
    },
    // grid-area: span, not custom-ident
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridArea: 'span 2',
      })
    `,
    },
    // grid-area: integer, not custom-ident
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridArea: '1',
      })
    `,
    },
    // Already-longhand grid properties
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridRowStart: 1,
          gridRowEnd: 3,
          gridColumnStart: 2,
          gridColumnEnd: 4,
      })
    `,
    },
    // grid-column: calc() with internal slash doesn't split
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          gridColumn: 'calc(100%/3)',
      })
    `,
    },
    // gap: single value is not a shorthand, no expansion needed
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
          gap: '10px',
        })
      `,
    },
    // gap: single numeric value is not a shorthand
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
          gap: 10,
        })
      `,
    },
    // gap: numeric zero is not a shorthand
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
          gap: 0,
        })
      `,
    },
    // gap: var() single value is not a shorthand
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
          gap: 'var(--spacing)',
        })
      `,
    },
    // gap: calc() single value is not a shorthand
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
          gap: 'calc(10px + 1rem)',
        })
      `,
    },
  ],
  invalid: [
    {
      code: /* js */ `
        function Component() {
          return <div
            {...apply({
              margin: '10px 12px 13px 14px',
            })}
          />
        }

        import { apply } from 'vicinage'
      `,
      output: /* js */ `
        function Component() {
          return <div
            {...apply({
              marginTop: '10px',
              marginRight: '12px',
              marginBottom: '13px',
              marginLeft: '14px',
            })}
          />
        }

        import { apply } from 'vicinage'
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10px 12px 13px 14px" are not supported here. Separate into individual properties.',
        },
      ],
    },

    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div
            {...apply({
              margin: '10px 12px 13px 14px',
            })}
          />
        }
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div
            {...apply({
              marginTop: '10px',
              marginRight: '12px',
              marginBottom: '13px',
              marginLeft: '14px',
            })}
          />
        }
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10px 12px 13px 14px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div
            {...apply({
              borderRight: '4px solid var(--fds-gray-10)'
            })}
          />
        }
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        function Component() {
          return <div
            {...apply({
              borderRightWidth: '4px',
              borderRightStyle: 'solid',
              borderRightColor: 'var(--fds-gray-10)'
            })}
          />
        }
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderRight: 4px solid var(--fds-gray-10)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      options: [{ preferInline: true }],
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderRadius: '10px 15px 20px 25px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderStartStartRadius: '10px',
            borderStartEndRadius: '15px',
            borderEndEndRadius: '20px',
            borderEndStartRadius: '25px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderRadius: 10px 15px 20px 25px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderRadius: '10px 15px 20px 25px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '15px',
            borderBottomRightRadius: '20px',
            borderBottomLeftRadius: '25px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderRadius: 10px 15px 20px 25px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            cornerShape: 'scoop notch',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            cornerStartStartShape: 'scoop',
            cornerStartEndShape: 'notch',
            cornerEndStartShape: 'scoop',
            cornerEndEndShape: 'notch',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "cornerShape: scoop notch" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            marginHorizontal: '10px',
            marginVertical: '5px',
            paddingHorizontal: '10px',
            paddingVertical: '5px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            marginInline: '10px',
            marginBlock: '5px',
            paddingInline: '10px',
            paddingBlock: '5px',
        })
      `,
      errors: [
        {
          message:
            'Use "marginInline" instead of legacy formats like "marginHorizontal" to adhere to logical property naming.',
        },
        {
          message:
            'Use "marginBlock" instead of legacy formats like "marginVertical" to adhere to logical property naming.',
        },
        {
          message:
            'Use "paddingInline" instead of legacy formats like "paddingHorizontal" to adhere to logical property naming.',
        },
        {
          message:
            'Use "paddingBlock" instead of legacy formats like "paddingVertical" to adhere to logical property naming.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            margin: '10px 10px 10px',
            marginInline: '15px 15px',
            padding: '20px 20px 20px 20px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            margin: '10px',
            marginInline: '15px',
            padding: '20px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10px 10px 10px" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "marginInline: 15px 15px" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "padding: 20px 20px 20px 20px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              borderWidth: 'var(--vertical-border-width, 10) var(--horizontal-border-width, 15)',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              borderBlockWidth: 'var(--vertical-border-width, 10)',
              borderInlineWidth: 'var(--horizontal-border-width, 15)',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderWidth: var(--vertical-border-width, 10) var(--horizontal-border-width, 15)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderWidth: 'calc(100% - 20px) calc(90% - 20px)',
            borderColor: 'var(--test-color, #ccc) linear-gradient(to right, #ff7e5f, #feb47b)',
            background: 'no-repeat center/cover, linear-gradient(to right, #ff7e5f, #feb47b)'
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderBlockWidth: 'calc(100% - 20px)',
            borderInlineWidth: 'calc(90% - 20px)',
            borderBlockColor: 'var(--test-color, #ccc)',
            borderInlineColor: 'linear-gradient(to right, #ff7e5f, #feb47b)',
            background: 'no-repeat center/cover, linear-gradient(to right, #ff7e5f, #feb47b)'
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderWidth: calc(100% - 20px) calc(90% - 20px)" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderColor: var(--test-color, #ccc) linear-gradient(to right, #ff7e5f, #feb47b)" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "background: no-repeat center/cover, linear-gradient(to right, #ff7e5f, #feb47b)" are not supported here. Separate into individual properties.',
        },
      ],
    },

    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              borderWidth: '1px 2px 3px 4px',
              borderStyle: 'solid dashed dotted double',
              borderColor: 'red green blue yellow',
              borderTop: '2px solid red',
              borderRight: '3px dashed green',
              borderBottom: '4px dotted blue',
              borderLeft: '5px double yellow',
              borderRadius: '10px 20px 30px 40px'
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              borderTopWidth: '1px',
              borderRightWidth: '2px',
              borderBottomWidth: '3px',
              borderLeftWidth: '4px',
              borderTopStyle: 'solid',
              borderRightStyle: 'dashed',
              borderBottomStyle: 'dotted',
              borderLeftStyle: 'double',
              borderTopColor: 'red',
              borderRightColor: 'green',
              borderBottomColor: 'blue',
              borderLeftColor: 'yellow',
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
              borderTopColor: 'red',
              borderRightWidth: '3px',
              borderRightStyle: 'dashed',
              borderRightColor: 'green',
              borderBottomWidth: '4px',
              borderBottomStyle: 'dotted',
              borderBottomColor: 'blue',
              borderLeftWidth: '5px',
              borderLeftStyle: 'double',
              borderLeftColor: 'yellow',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '20px',
              borderBottomRightRadius: '30px',
              borderBottomLeftRadius: '40px'
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderWidth: 1px 2px 3px 4px" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderStyle: solid dashed dotted double" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderColor: red green blue yellow" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderTop: 2px solid red" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderRight: 3px dashed green" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderBottom: 4px dotted blue" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderLeft: 5px double yellow" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderRadius: 10px 20px 30px 40px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            outline: '2px dashed red',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            outlineWidth: '2px',
            outlineStyle: 'dashed',
            outlineColor: 'red',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "outline: 2px dashed red" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              background: '#ff0 url("image.jpg") no-repeat fixed center / cover !important',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              backgroundColor: '#ff0',
              backgroundImage: 'url("image.jpg")',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "background: #ff0 url("image.jpg") no-repeat fixed center / cover !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      options: [{ allowImportant: true }],
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              background: '#ff0 url("image.jpg") no-repeat fixed center / cover !important',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              backgroundColor: '#ff0 !important',
              backgroundImage: 'url("image.jpg") !important',
              backgroundRepeat: 'no-repeat !important',
              backgroundAttachment: 'fixed !important',
              backgroundPosition: 'center !important',
              backgroundSize: 'cover !important',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "background: #ff0 url("image.jpg") no-repeat fixed center / cover !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              margin: '0px',
              font: 'italic small-caps bold 16px/1.5 "Helvetica Neue"',
              color: 'white',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              margin: '0px',
              fontFamily: '"Helvetica Neue"',
              fontStyle: 'italic',
              fontVariant: 'small-caps',
              fontWeight: 'bold',
              fontSize: '16px',
              lineHeight: '1.5',
              color: 'white',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "font: italic small-caps bold 16px/1.5 "Helvetica Neue"" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      options: [{ allowImportant: true }],
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              margin: '10px 12px 13px 14px !important',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginTop: '10px !important',
              marginRight: '12px !important',
              marginBottom: '13px !important',
              marginLeft: '14px !important',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10px 12px 13px 14px !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              margin: '10px 12px 13px 14px !important',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginTop: '10px',
              marginRight: '12px',
              marginBottom: '13px',
              marginLeft: '14px',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10px 12px 13px 14px !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      options: [{ preferInline: true }],
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              margin: '10em 1em 5em 2em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginTop: '10em',
              marginInlineEnd: '1em',
              marginBottom: '5em',
              marginInlineStart: '2em',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10em 1em 5em 2em" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              margin: '10em 1em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginBlock: '10em',
              marginInline: '1em',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "margin: 10em 1em" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginInline: '10em 1em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginInlineStart: '10em',
              marginInlineEnd: '1em',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "marginInline: 10em 1em" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginBlock: '10em 1em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              marginBlockStart: '10em',
              marginBlockEnd: '1em',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "marginBlock: 10em 1em" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              paddingBlock: '10em 1em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              paddingBlockStart: '10em',
              paddingBlockEnd: '1em',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "paddingBlock: 10em 1em" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '4px 5px 6px 7px',
          borderStyle: 'solid dashed dotted double',
          borderColor: 'var(--fds-gray-10) var(--fds-gray-20) var(--fds-gray-30) var(--fds-gray-40)',
      })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderWidth: 4px 5px 6px 7px" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderStyle: solid dashed dotted double" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderColor: var(--fds-gray-10) var(--fds-gray-20) var(--fds-gray-30) var(--fds-gray-40)" are not supported here. Separate into individual properties.',
        },
      ],
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderTopWidth: '4px',
          borderRightWidth: '5px',
          borderBottomWidth: '6px',
          borderLeftWidth: '7px',
          borderTopStyle: 'solid',
          borderRightStyle: 'dashed',
          borderBottomStyle: 'dotted',
          borderLeftStyle: 'double',
          borderTopColor: 'var(--fds-gray-10)',
          borderRightColor: 'var(--fds-gray-20)',
          borderBottomColor: 'var(--fds-gray-30)',
          borderLeftColor: 'var(--fds-gray-40)',
      })
      `,
    },
    {
      options: [{ preferInline: true }],
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '4px 5px 6px 7px',
          borderStyle: 'solid dashed dotted double',
          borderColor: 'var(--fds-gray-10) var(--fds-gray-20) var(--fds-gray-30) var(--fds-gray-40)',
      })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderWidth: 4px 5px 6px 7px" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderStyle: solid dashed dotted double" are not supported here. Separate into individual properties.',
        },
        {
          message:
            'Property shorthands using multiple values like "borderColor: var(--fds-gray-10) var(--fds-gray-20) var(--fds-gray-30) var(--fds-gray-40)" are not supported here. Separate into individual properties.',
        },
      ],
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderTopWidth: '4px',
          borderInlineEndWidth: '5px',
          borderBottomWidth: '6px',
          borderInlineStartWidth: '7px',
          borderTopStyle: 'solid',
          borderInlineEndStyle: 'dashed',
          borderBottomStyle: 'dotted',
          borderInlineStartStyle: 'double',
          borderTopColor: 'var(--fds-gray-10)',
          borderInlineEndColor: 'var(--fds-gray-20)',
          borderBottomColor: 'var(--fds-gray-30)',
          borderInlineStartColor: 'var(--fds-gray-40)',
      })
      `,
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              paddingTop: '10em',
              paddingBottom: '1em',
              marginStart: '20em',
              marginEnd: '20em',
              paddingStart: '10em',
              paddingEnd: '1em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              paddingTop: '10em',
              paddingBottom: '1em',
              marginInlineStart: '20em',
              marginInlineEnd: '20em',
              paddingInlineStart: '10em',
              paddingInlineEnd: '1em',
          })
        `,
      errors: [
        {
          message:
            'Use "marginInlineStart" instead of legacy formats like "marginStart" to adhere to logical property naming.',
        },
        {
          message:
            'Use "marginInlineEnd" instead of legacy formats like "marginEnd" to adhere to logical property naming.',
        },
        {
          message:
            'Use "paddingInlineStart" instead of legacy formats like "paddingStart" to adhere to logical property naming.',
        },
        {
          message:
            'Use "paddingInlineEnd" instead of legacy formats like "paddingEnd" to adhere to logical property naming.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              padding: '10em 1em',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              paddingBlock: '10em',
              paddingInline: '1em',
          })
        `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "padding: 10em 1em" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // {
    //   options: [{ validImports: ['custom-vicinage'] }],
    //   code: `
    //     import * as vicinage from 'custom-vicinage';
    //
    //     vicinage.apply({
    //         margin: '10px 12px',
    //     });
    //   `,
    //   output: `
    //     import * as vicinage from 'custom-vicinage';
    //
    //     vicinage.apply({
    //         marginBlock: '10px',
    //         marginInline: '12px',
    //     });
    //   `,
    //   errors: [
    //     {
    //       message:
    //         'Property shorthands using multiple values like "margin: 10px 12px" are not supported here. Separate into individual properties.',
    //     },
    //   ],
    // },
    // {
    //   options: [{ validImports: [{ from: 'a', as: 'css' }] }],
    //   code: `
    //     import { css } from 'a';
    //
    //     css.create({
    //         padding: '5px 10px',
    //     });
    //   `,
    //   output: `
    //     import { css } from 'a';
    //
    //     css.create({
    //         paddingBlock: '5px',
    //         paddingInline: '10px',
    //     });
    //   `,
    //   errors: [
    //     {
    //       message:
    //         'Property shorthands using multiple values like "padding: 5px 10px" are not supported here. Separate into individual properties.',
    //     },
    //   ],
    // },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderColor: 'hsl(220 3% 15%) hsl(240 3% 20%)',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderBlockColor: 'hsl(220 3% 15%)',
            borderInlineColor: 'hsl(240 3% 20%)',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderColor: hsl(220 3% 15%) hsl(240 3% 20%)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderColor: 'oklch(0.7 0.15 180) rgb(255 0 0)',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            borderBlockColor: 'oklch(0.7 0.15 180)',
            borderInlineColor: 'rgb(255 0 0)',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "borderColor: oklch(0.7 0.15 180) rgb(255 0 0)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: custom-ident expands to 4 longhands
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: 'header',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnEnd: 'header',
            gridColumnStart: 'header',
            gridRowEnd: 'header',
            gridRowStart: 'header',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: header" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: custom-ident with 2 slash-separated parts
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: 'header / sidebar',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnEnd: 'sidebar',
            gridColumnStart: 'sidebar',
            gridRowEnd: 'header',
            gridRowStart: 'header',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: header / sidebar" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: non-custom-ident with 2 slash-separated parts
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: 'span 2 / span 3',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnStart: 'span 3',
            gridRowStart: 'span 2',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: span 2 / span 3" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: 3 slash-separated parts
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: '1 / 2 / 3',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnStart: '2',
            gridRowEnd: '3',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: 1 / 2 / 3" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: 4 slash-separated parts
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: '1 / 2 / 3 / 4',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnEnd: '4',
            gridColumnStart: '2',
            gridRowEnd: '3',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: 1 / 2 / 3 / 4" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: custom-ident row / non-custom-ident column (2 values)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: 'header / 2',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnStart: '2',
            gridRowEnd: 'header',
            gridRowStart: 'header',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: header / 2" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: non-custom-ident row / custom-ident column (2 values)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: '1 / sidebar',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnEnd: 'sidebar',
            gridColumnStart: 'sidebar',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: 1 / sidebar" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-area: 3 values with custom-ident column-start
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridArea: '1 / sidebar / 3',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnEnd: 'sidebar',
            gridColumnStart: 'sidebar',
            gridRowEnd: '3',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridArea: 1 / sidebar / 3" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-row: 2 slash-separated parts
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRow: '1 / 3',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRowEnd: '3',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridRow: 1 / 3" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-row: named lines
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRow: 'header-start / content-end',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRowEnd: 'content-end',
            gridRowStart: 'header-start',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridRow: header-start / content-end" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-row: compound value after slash
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRow: '1 / span 2',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRowEnd: 'span 2',
            gridRowStart: '1',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridRow: 1 / span 2" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-column: 2 slash-separated parts
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumn: '2 / 4',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnEnd: '4',
            gridColumnStart: '2',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridColumn: 2 / 4" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-template: rows / columns
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridTemplate: '1fr 2fr / 100px 1fr',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridTemplateColumns: '100px 1fr',
            gridTemplateRows: '1fr 2fr',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridTemplate: 1fr 2fr / 100px 1fr" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // grid-template: with repeat() function
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridTemplate: 'auto auto / repeat(3, 1fr)',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto auto',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridTemplate: auto auto / repeat(3, 1fr)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: duration + name
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'slidein 3s',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '3s',
            animationName: 'slidein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: slidein 3s" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: duration + timing + name
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'slidein 3s ease-in',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '3s',
            animationTimingFunction: 'ease-in',
            animationName: 'slidein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: slidein 3s ease-in" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: duration + delay (two time values)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'slidein 3s 1s',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '3s',
            animationDelay: '1s',
            animationName: 'slidein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: slidein 3s 1s" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: full shorthand with all properties
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: '3s ease-in 1s 2 reverse both paused slidein',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '3s',
            animationTimingFunction: 'ease-in',
            animationDelay: '1s',
            animationIterationCount: '2',
            animationDirection: 'reverse',
            animationFillMode: 'both',
            animationPlayState: 'paused',
            animationName: 'slidein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: 3s ease-in 1s 2 reverse both paused slidein" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: cubic-bezier timing function
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'slidein 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '300ms',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            animationName: 'slidein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: slidein 300ms cubic-bezier(0.4, 0, 0.2, 1)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: infinite iteration count
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'spin 1s linear infinite',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '1s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationName: 'spin',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: spin 1s linear infinite" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: with !important
    {
      options: [{ allowImportant: true }],
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'slidein 2s ease !important',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '2s !important',
            animationTimingFunction: 'ease !important',
            animationName: 'slidein !important',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: slidein 2s ease !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: comma-separated multi-animation is CANNOT_FIX
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'slidein 3s, fadeout 2s',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: slidein 3s, fadeout 2s" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: iteration count before duration
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: '2 3s slidein',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '3s',
            animationIterationCount: '2',
            animationName: 'slidein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: 2 3s slidein" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: ambiguous "none" treated as animation-name (none is default fill-mode)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: '1s none',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '1s',
            animationName: 'none',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: 1s none" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: named keyframe with explicit none fill-mode
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'fadein 1s none',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '1s',
            animationFillMode: 'none',
            animationName: 'fadein',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: fadein 1s none" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // animation: alternate-reverse direction
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animation: 'bounce 1s alternate-reverse',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            animationDuration: '1s',
            animationDirection: 'alternate-reverse',
            animationName: 'bounce',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "animation: bounce 1s alternate-reverse" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: single number expands to grow/shrink/basis
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: 1,
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1',
            flexShrink: '1',
            flexBasis: '0%',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 1" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: string single number
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '2',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '2',
            flexShrink: '1',
            flexBasis: '0%',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 2" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: auto keyword
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: 'auto',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1',
            flexShrink: '1',
            flexBasis: 'auto',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: auto" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: none keyword
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: 'none',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '0',
            flexShrink: '0',
            flexBasis: 'auto',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: none" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: initial keyword
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: 'initial',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '0',
            flexShrink: '1',
            flexBasis: 'auto',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: initial" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: single basis value (with unit)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '100px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1',
            flexShrink: '1',
            flexBasis: '100px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 100px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: two numbers (grow shrink)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '1 0',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1',
            flexShrink: '0',
            flexBasis: '0%',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 1 0" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: number + basis
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '1 30px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1',
            flexShrink: '1',
            flexBasis: '30px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 1 30px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: three values (grow shrink basis)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '2 2 10%',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '2',
            flexShrink: '2',
            flexBasis: '10%',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 2 2 10%" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: with !important (allowImportant)
    {
      options: [{ allowImportant: true }],
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '1 0 auto !important',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1 !important',
            flexShrink: '0 !important',
            flexBasis: 'auto !important',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 1 0 auto !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // flex: calc() basis
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flex: '1 1 calc(100% - 20px)',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            flexGrow: '1',
            flexShrink: '1',
            flexBasis: 'calc(100% - 20px)',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "flex: 1 1 calc(100% - 20px)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gap: two values splits to rowGap + columnGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: '10px 20px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: '10px',
            columnGap: '20px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: 10px 20px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gridGap: single value expands to rowGap + columnGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridGap: '10px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: '10px',
            columnGap: '10px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridGap: 10px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gridGap: two values splits to rowGap + columnGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridGap: '10px 20px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: '10px',
            columnGap: '20px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridGap: 10px 20px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gridColumnGap: legacy name fix to columnGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridColumnGap: '10px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            columnGap: '10px',
        })
      `,
      errors: [
        {
          message:
            'Use "columnGap" instead of legacy formats like "gridColumnGap" to adhere to logical property naming.',
        },
      ],
    },
    // gridRowGap: legacy name fix to rowGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridRowGap: '10px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: '10px',
        })
      `,
      errors: [
        {
          message:
            'Use "rowGap" instead of legacy formats like "gridRowGap" to adhere to logical property naming.',
        },
      ],
    },
    // gap: two calc() values splits to rowGap + columnGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: 'calc(10px + 1rem) calc(20px + 2rem)',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: 'calc(10px + 1rem)',
            columnGap: 'calc(20px + 2rem)',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: calc(10px + 1rem) calc(20px + 2rem)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gap: two identical values still splits (two values means shorthand)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: '0px 0px',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: '0px',
            columnGap: '0px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: 0px 0px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gap: with !important and allowImportant
    {
      options: [{ allowImportant: true }],
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: '10px 20px !important',
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: '10px !important',
            columnGap: '20px !important',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: 10px 20px !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gridGap: single numeric value expands to rowGap + columnGap
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gridGap: 10,
        })
      `,
      output: /* js */ `
        import { apply } from 'vicinage'

        apply({
            rowGap: 10,
            columnGap: 10,
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gridGap: 10" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gap: with comma returns CANNOT_FIX (no autofix)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: '10px, 20px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: 10px, 20px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gap: with slash returns CANNOT_FIX (no autofix)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: '10px / 20px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: 10px / 20px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    // gap: three values returns CANNOT_FIX (no autofix)
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            gap: '10px 20px 30px',
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "gap: 10px 20px 30px" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: '1px solid red'
      })
    `,
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'red'
      })
    `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "border: 1px solid red" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: '2px dashed blue'
      })
    `,
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: 'blue'
      })
    `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "border: 2px dashed blue" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
          import { apply } from 'vicinage'

          apply({
              borderStart: '1px solid red',
              borderEnd: '2px dashed blue',
          })
        `,
      output: /* js */ `
          import { apply } from 'vicinage'

          apply({
              borderInlineStart: '1px solid red',
              borderInlineEnd: '2px dashed blue',
          })
        `,
      errors: [
        {
          message:
            'Use "borderInlineStart" instead of legacy formats like "borderStart" to adhere to logical property naming.',
        },
        {
          message:
            'Use "borderInlineEnd" instead of legacy formats like "borderEnd" to adhere to logical property naming.',
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
        borderStart: 'none',
      })
    `,
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
        borderInlineStart: 'none',
      })
    `,
      errors: [
        {
          message:
            'Use "borderInlineStart" instead of legacy formats like "borderStart" to adhere to logical property naming.',
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderEnd: 'none',
      })
    `,
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderInlineEnd: 'none',
      })
    `,
      errors: [
        {
          message:
            'Use "borderInlineEnd" instead of legacy formats like "borderEnd" to adhere to logical property naming.',
        },
      ],
    },
    {
      code: /* js */ `
        import { apply } from 'vicinage'

        apply({
            border: '1px solid'
        })
      `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "border: 1px solid" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: '1px solid rgba(0, 0, 0, 0.5)'
      })
    `,
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(0, 0, 0, 0.5)'
      })
    `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "border: 1px solid rgba(0, 0, 0, 0.5)" are not supported here. Separate into individual properties.',
        },
      ],
    },
    {
      options: [{ allowImportant: true }],
      code: /* js */ `
      import { apply } from 'vicinage'

      apply({
          border: '1px solid red !important'
      })
    `,
      output: /* js */ `
      import { apply } from 'vicinage'

      apply({
          borderWidth: '1px !important',
          borderStyle: 'solid !important',
          borderColor: 'red !important'
      })
    `,
      errors: [
        {
          message:
            'Property shorthands using multiple values like "border: 1px solid red !important" are not supported here. Separate into individual properties.',
        },
      ],
    },
  ],
})

import { RuleTester } from 'eslint'
import { validShorthands } from './valid-shorthands'
//
