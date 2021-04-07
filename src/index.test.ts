// @ts-ignore
const styledComponents = require('./index')
const { expect } = require('chai')

const normalise = (str: string) =>
  str
    .split('\n')
    .map((s) => s.trim())
    .join('\n')
    .trim()

const compare = (actual: string, expected: string) => {
  expect(normalise(actual)).to.eql(normalise(expected))
}

describe('configuration', () => {
  it('should support using any html element', () => {
    const { styled } = styledComponents.newInstance()
    const div = styled.div`
      border: 1px solid blue;
    `
    const h1 = styled.h1`
      border: 1px solid blue;
    `
    const p = styled.p`
      border: 1px solid blue;
    `
    const b = styled.b`
      border: 1px solid blue;
    `
    compare(div('hello world'), '<div class="c100" >hello world</div>')
    compare(h1('hello world'), '<h1 class="c101" >hello world</h1>')
    compare(p('hello world'), '<p class="c102" >hello world</p>')
    compare(b('hello world'), '<b class="c103" >hello world</b>')
  })

  it('should have unique css class names', () => {
    const { styled, generateCssClasses } = styledComponents.newInstance()
    styled.div`
      border: 1px solid blue;
    `
    styled.h1`
      border: 1px solid red;
    `
    styled.p`
      border: 1px solid green;
    `
    styled.b`
      border: 1px solid yellow;
    `
    // classes should line up...
    compare(
      generateCssClasses(),
      `
.c100 {
border: 1px solid blue;
}
.c101 {
border: 1px solid red;
}
.c102 {
border: 1px solid green;
}
.c103 {
border: 1px solid yellow;
}
        `.trim()
    )
  })

  it('should only define a class once, class should be reused', () => {
    const { styled, generateCssClasses } = styledComponents.newInstance()
    const div = styled.div`
      border: 1px solid blue;
    `
    compare(div('hello'), '<div class="c100" >hello</div>')
    compare(div('world'), '<div class="c100" >world</div>')
    compare(
      generateCssClasses(),
      `
.c100 {
border: 1px solid blue;
}
        `.trim()
    )
  })

  it('should support inheriting from other styled components', () => {
    const { styled, generateCssClasses } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redtext = styled(blueborder)`
      color: red;
    `
    const greenbkgd = styled(redtext)`
      background: green;
    `
    // element inherit css...
    compare(redtext('hello world'), '<div class="c101 c100" >hello world</div>')
    compare(greenbkgd('hello world'), '<div class="c102 c101 c100" >hello world</div>')
    compare(
      generateCssClasses(),
      `
.c100 {
border: 1px solid blue;
}
.c101 {
color: red;
}
.c102 {
background: green;
}
        `.trim()
    )
  })

  it('should support multiple css class definitions', () => {
    const { styled, generateCssClasses } = styledComponents.newInstance()
    const blueborder = styled.div`
      & {
        border: 1px solid blue;
      }
      &.red-text {
        color: red;
      }
      & > p {
        background: green;
      }
    `
    // element inherit css...
    compare(blueborder('hello world'), '<div class="c100" >hello world</div>')
    compare(
      generateCssClasses(),
      `
.c100 {
border: 1px solid blue;
}
.c100.red-text {
color: red;
}
.c100 > p {
background: green;
}
        `.trim()
    )
  })
})

describe('usage - no parameters', () => {
  // no parameter

  it('should support no parameters', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(blueborder(), '<div class="c100" ></div>')
  })
})

describe('usage - one parameter', () => {
  // one parameter

  it('should support accepting html string', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(blueborder('hello <b>world</b>'), '<div class="c100" >hello <b>world</b></div>')
  })

  it('should support accepting another styled component', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    compare(blueborder(redheader('hello')), '<div class="c100" ><h1 class="c101" >hello</h1></div>')
  })

  it('should support accepting array of html strings', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(blueborder(['<i>hello</i>', '<b>world</b>']), '<div class="c100" ><i>hello</i><b>world</b></div>')
  })

  it('should support accepting array of styled components', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    compare(
      blueborder([redheader('hello'), redheader('world')]),
      '<div class="c100" ><h1 class="c101" >hello</h1><h1 class="c101" >world</h1></div>'
    )
  })
})

describe('usage - two parameters, first is css class (string)', () => {
  it('should support accepting html string', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(
      blueborder('m-0 text-left', 'hello <b>world</b>'),
      '<div class="c100 m-0 text-left" >hello <b>world</b></div>'
    )
  })

  it('should support accepting another styled component', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    compare(
      blueborder('m-0 text-left', redheader('hello')),
      '<div class="c100 m-0 text-left" ><h1 class="c101" >hello</h1></div>'
    )
  })

  it('should support accepting array of html strings', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(
      blueborder('m-0 text-left', ['<i>hello</i>', '<b>world</b>']),
      '<div class="c100 m-0 text-left" ><i>hello</i><b>world</b></div>'
    )
  })

  it('should support accepting array of styled components', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    compare(
      blueborder('m-0 text-left', [redheader('hello'), redheader('world')]),
      '<div class="c100 m-0 text-left" ><h1 class="c101" >hello</h1><h1 class="c101" >world</h1></div>'
    )
  })
})

describe('usage - two parameters, first is attributes object', () => {
  it('should support accepting html string', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(
      blueborder({ className: 'm-0 text-left', title: 'header' }, 'hello <b>world</b>'),
      '<div class="c100 m-0 text-left" title="header">hello <b>world</b></div>'
    )
  })

  it('should support accepting another styled component', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    compare(
      blueborder({ className: 'm-0 text-left', title: 'header' }, redheader('hello')),
      '<div class="c100 m-0 text-left" title="header"><h1 class="c101" >hello</h1></div>'
    )
  })

  it('should support accepting array of html strings', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    compare(
      blueborder({ className: 'm-0 text-left', title: 'header' }, ['<i>hello</i>', '<b>world</b>']),
      '<div class="c100 m-0 text-left" title="header"><i>hello</i><b>world</b></div>'
    )
  })

  it('should support accepting array of styled components', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    compare(
      blueborder({ className: 'm-0 text-left', title: 'header' }, [redheader('hello'), redheader('world')]),
      '<div class="c100 m-0 text-left" title="header"><h1 class="c101" >hello</h1><h1 class="c101" >world</h1></div>'
    )
  })

  it('simplest example usage', () => {
    const { styled, generateCssClasses } = styledComponents.newInstance()
    const CustomH1 = styled.h1`
      border: 1px solid blue;
    `
    const html = `<html><head><style>${generateCssClasses()}</style></head><body>${CustomH1(
      'Hello world!'
    )}</body></html>`
    // output html
    compare(
      html,
      `<html><head><style>.c100 {
      border: 1px solid blue;
      }</style></head><body><h1 class="c100" >Hello world!</h1></body></html>`
    )
  })
})
