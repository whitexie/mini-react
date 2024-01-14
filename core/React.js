// @ts-nocheck

function createDom(el) {
  if (el.type === 'TEXT_ELEMENT') {
    return document.createTextNode(el.props.nodeValue)
  }

  const dom = document.createElement(el.type)
  const props = el.props
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
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

function performUnitOfWork(fiber) {
  if (!fiber) {
    return
  }
  if (!fiber?.dom) {
    fiber.dom = createDom(fiber)
  }


  fiber.parent && fiber.parent.dom.append(fiber.dom)
  const children = fiber.props.children
  let preChild = null
  children.forEach((child, index) => {
    const newFieber = {
      dom: null,
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: fiber,
    }

    if (index === 0) {
      fiber.child = newFieber
    }
    else if (index === 1 && preChild) {
      preChild.sibling = newFieber
    }

    preChild = newFieber
  })

  // 返回下一个执行的fieber
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

let nextWorkOfUnit = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}


function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }

  requestIdleCallback(workLoop)

}

export default {
  createElement,
  render
}
