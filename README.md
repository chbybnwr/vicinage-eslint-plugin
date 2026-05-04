# @vicinage/eslint-plugin

## Installation

```sh
npm install --save-dev @vicinage/eslint-plugin
```

## Enabling the plugin and rules

Once you've installed the npm package you can enable the plugin and rules by
opening your ESLint configuration file and adding the plugin and rules.

```js
import { defineConfig } from 'eslint/config'
import vicinage from '@vicinage/eslint-plugin'

export default defineConfig([
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { vicinage },
    rules: {
      'vicinage/no-conflicting-props': 'error',
      'vicinage/valid-shorthands': 'error',
      'vicinage/sort-keys': 'warn',
    },
  },
])
```

## All the rules

### @vicinage/sort-keys

This rule helps to sort the style property keys according to property priorities.

### @vicinage/valid-shorthands

This ESLint rule enforces the use of individual longhand CSS properties in place
of multi-value shorthands when using `apply` for reasons of consistency
and performance. The rule provides an autofix to replace the shorthand with the
equivalent longhand properties.

#### Disallowed: `margin`, `padding` with multiple values

Using multi-value shorthands that cannot be safely split into equivalent
longhands:

- `margin: '8px 16px'`
- `padding: '8px 16px 8px 16px'`

**Fix:** Replace with equivalent longhands. Note: this is autofixable.

##### Disallowed: `font`

**Why:** `font` is a shorthand that overrides multiple font settings at once.

**Fix:** Replace with individual font properties. Note: this is autofixable.

- `fontSize`
- `fontFamily`
- `fontStyle`
- `fontWeight`

##### Disallowed: `border`, `borderTop`, `borderRight`, `borderBottom`, `borderLeft`

**Fix:** Replace with individual sub-properties. Note: this is autofixable.

- `borderWidth`
- `borderStyle`
- `borderColor`

#### Config options

This rule has a few custom config options that can be set.

```js
{
  allowImportant: false, // Whether `!important` is allowed
  preferInline: false, // Whether the expansion uses logical direction properties over physical
}
```

### `@vicinage/no-conflicting-props`

This rule disallows using `className` or `style` props or `class` attribute on elements that spread
`apply()` to avoid conflicts and unexpected behavior.

#### Invalid examples

```jsx
function Component() {
  return (
    <>
      <div {...apply({ color: 'green' })} className="extra" />
      <div {...apply({ color: 'green' })} style={{ color: 'red' }} />
    </>
  )
}
```
