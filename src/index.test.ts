// @ts-ignore
const styledComponents = require('./index')
const { expect } = require('chai')

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
    expect(div('hello world')).to.eql('<div class="c100" >hello world</div>')
    expect(h1('hello world')).to.eql('<h1 class="c101" >hello world</h1>')
    expect(p('hello world')).to.eql('<p class="c102" >hello world</p>')
    expect(b('hello world')).to.eql('<b class="c103" >hello world</b>')
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
    expect(generateCssClasses()).to.eql(
      `
.c100 {
border:1px solid blue;
}
.c101 {
border:1px solid red;
}
.c102 {
border:1px solid green;
}
.c103 {
border:1px solid yellow;
}
        `.trim()
    )
  })

  it('should only define a class once, class should be reused', () => {
    const { styled, generateCssClasses } = styledComponents.newInstance()
    const div = styled.div`
      border: 1px solid blue;
    `
    expect(div('hello')).to.eql('<div class="c100" >hello</div>')
    expect(div('world')).to.eql('<div class="c100" >world</div>')
    expect(generateCssClasses()).to.eql(
      `
.c100 {
border:1px solid blue;
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
    expect(redtext('hello world')).to.eql('<div class="c101 c100" >hello world</div>')
    expect(greenbkgd('hello world')).to.eql('<div class="c102 c101 c100" >hello world</div>')
    expect(generateCssClasses()).to.eql(
      `
.c100 {
border:1px solid blue;
}
.c101 {
color:red;
}
.c102 {
background:green;
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
    expect(blueborder('hello world')).to.eql('<div class="c100" >hello world</div>')
    expect(generateCssClasses()).to.eql(
      `
.c100 {
border:1px solid blue;
}
.c100.red-text {
color:red;
}
.c100 > p {
background:green;
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
    expect(blueborder()).to.eql('<div class="c100" ></div>')
  })
})

describe('usage - one parameter', () => {
  // one parameter

  it('should support accepting html string', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    expect(blueborder('hello <b>world</b>')).to.eql('<div class="c100" >hello <b>world</b></div>')
  })

  it('should support accepting another styled component', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    expect(blueborder(redheader('hello'))).to.eql('<div class="c100" ><h1 class="c101" >hello</h1></div>')
  })

  it('should support accepting array of html strings', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    expect(blueborder(['<i>hello</i>', '<b>world</b>'])).to.eql('<div class="c100" ><i>hello</i><b>world</b></div>')
  })

  it('should support accepting array of styled components', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    const redheader = styled.h1`
      border: 1px solid red;
    `
    expect(blueborder([redheader('hello'), redheader('world')])).to.eql(
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
    expect(blueborder('m-0 text-left', 'hello <b>world</b>')).to.eql(
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
    expect(blueborder('m-0 text-left', redheader('hello'))).to.eql(
      '<div class="c100 m-0 text-left" ><h1 class="c101" >hello</h1></div>'
    )
  })

  it('should support accepting array of html strings', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    expect(blueborder('m-0 text-left', ['<i>hello</i>', '<b>world</b>'])).to.eql(
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
    expect(blueborder('m-0 text-left', [redheader('hello'), redheader('world')])).to.eql(
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
    expect(blueborder({ className: 'm-0 text-left', title: 'header' }, 'hello <b>world</b>')).to.eql(
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
    expect(blueborder({ className: 'm-0 text-left', title: 'header' }, redheader('hello'))).to.eql(
      '<div class="c100 m-0 text-left" title="header"><h1 class="c101" >hello</h1></div>'
    )
  })

  it('should support accepting array of html strings', () => {
    const { styled } = styledComponents.newInstance()
    const blueborder = styled.div`
      border: 1px solid blue;
    `
    expect(blueborder({ className: 'm-0 text-left', title: 'header' }, ['<i>hello</i>', '<b>world</b>'])).to.eql(
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
    expect(
      blueborder({ className: 'm-0 text-left', title: 'header' }, [redheader('hello'), redheader('world')])
    ).to.eql(
      '<div class="c100 m-0 text-left" title="header"><h1 class="c101" >hello</h1><h1 class="c101" >world</h1></div>'
    )
  })
})
