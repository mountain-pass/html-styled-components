# html-styled-components

[![GitHub license](https://img.shields.io/github/license/mountain-pass/html-styled-components)](https://github.com/mountain-pass/html-styled-components/blob/master/LICENSE)
[![NPM](https://img.shields.io/npm/v/@mountainpass/html-styled-components.svg)](https://www.npmjs.com/package/@mountainpass/html-styled-components)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Overview

Provides a javascript library for creating raw html (string), using "styled components" like syntax.

## Install

Install from NPM

```bash
npm i @mountainpass/html-styled-components
```

## Usage

### The bare minimum

```js
const { styled, generateCssClasses } = require('@mountainpass/html-styled-components').newInstance()

const CustomH1 = styled.h1`
  border: 1px solid blue;
`
const html = `<html><head><style>${generateCssClasses()}</style></head><body>${CustomH1('Hello world!')}</body></html>`
```

**Output**

```html
<html>
  <head>
    <style>
      .c100 {
        border: 1px solid blue;
      }
    </style>
  </head>
  <body>
    <h1 class="c100">Hello world!</h1>
  </body>
</html>
```

### Full example

Please see the unit tests for [all usage examples](src/index.test.ts).

## Configuration

Please see the unit tests for [all configuration examples](src/index.test.ts).

## License

Apache 2.0 © [nickgrealy](https://github.com/nickgrealy)
