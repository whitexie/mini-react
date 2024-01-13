function renderElement(el) {
  if (el.type === 'TEXT_ELEMENT') {
    return document.createTextNode(el.props.nodeValue)
  }

  /**
   * @type {HTMLElement}
   */
  const dom = document.createElement(el.type)
  const props = el.props
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })

  // 创建子节点
  props.children.forEach(child => {
    render(child, dom)
  })
  return dom
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      }),
    }
  }
}


function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}


function render(el, container) {
  const dom = renderElement(el)
  container.append(dom)
}

export default {
  createElement,
  render
}
