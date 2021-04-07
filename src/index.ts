interface StyledElement {
  class: String
}

const newInstance = () => {
  /**
   * Generates unique ids (increments a number).
   * @returns
   */
  const uuidGen = () => {
    let i = 100
    return () => `c${i++}`
  }
  const uuid = uuidGen()

  /**
   * Stores an array of all the css class strings returned so far.
   */
  const classes: string[] = []

  /**
   *
   * @param {*} element
   * @param {*} cssString
   * @returns
   */
  const createElement = (element: string | symbol = 'div', cssString = '', parentClassName = '') => {
    const id = uuid()
    cssString = cssString.trim()
    if (cssString.startsWith('&')) cssString = cssString.replace(/&/g, `.${id}`)
    else cssString = `.${id} {\n${cssString}\n}`
    classes.push(cssString)

    const elementWrapper: StyledElement = function () {
      let attrs: any = {}
      if (arguments.length === 1) {
        // if first arg is a children string or array...
        if (typeof arguments[0] === 'string' || Array.isArray(arguments[0])) attrs = { children: arguments[0] }
        // otherwise first arg is attrs object (includes children).
        else attrs = { ...arguments[0] }
      } else if (arguments.length === 2) {
        // if first arg is a classname string...
        if (typeof arguments[0] === 'string') attrs = { children: arguments[1], className: arguments[0] }
        // otherwise first arg is attrs object, second is the children.
        else attrs = { children: arguments[1], ...arguments[0] }
      }
      let { className = '', children = '', ...props } = attrs
      const attrsString = Object.entries(props)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')
      return `<${String(element)} class="${[id, parentClassName, className]
        .filter((s) => s)
        .join(' ')}" ${attrsString}>${Array.isArray(children) ? children.join('') : children}</${String(element)}>`
    }
    elementWrapper.class = `${id} ${parentClassName}`.trim()
    return elementWrapper
  }

  /**
   * The underlying function - i.e. styled()
   * @param {*} existingComponent
   * @returns
   */
  const styledUnderlyingFunction = function (existingComponent: StyledElement) {
    return (tmplString = ['']) => {
      let parentClass = undefined
      if (existingComponent) {
        parentClass = '' + existingComponent.class
      }
      return createElement('div', tmplString[0], parentClass)
    }
  }

  /**
   * A proxy, which catches property references - i.e. styled.div
   */
  const styled: any = new Proxy(styledUnderlyingFunction, {
    get: function (_target: any, prop: string | symbol) {
      // , receiver
      return (tmplString = ['']) => {
        return createElement(prop, tmplString[0])
      }
    }
  })

  const generateCssClasses: Function = () => classes.join('\n')

  return { generateCssClasses, styled }
}

// const builder = { newInstance }

module.exports = { newInstance }
