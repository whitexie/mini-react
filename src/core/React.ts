
type VDomType = keyof HTMLElementTagNameMap | 'TEXT_ELEMENT'

export interface VDom {
  type: VDomType
  props: Record<string, any>
}

interface LinkNode extends VDom {
  dom: null | HTMLElement | Text
  child: LinkNode | null
  sibling: LinkNode | null
  parent: LinkNode | null
}

let nextWorkOfUnit: LinkNode | null = null;
let rootNode: LinkNode | null = null;

function createDom(el: VDom): HTMLElement | Text {
  if (el.type === 'TEXT_ELEMENT') {
    return document.createTextNode(el.props.nodeValue)
  }

  const dom = document.createElement(el.type)
  const props = el.props
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom.setAttribute(key, props[key])
      // dom[key] = props[key]
    }
  })

  return dom
}

function createElement(type: VDomType, props: Record<string, any>, ...children: VDom[]) {
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


function createTextNode(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

function performUnitOfWork(fiber: LinkNode | null) {
  if (!fiber) {
    return null
  }

  const children = fiber.props.children
  let preChild: LinkNode | null = null
  children.forEach((child: VDom, index: number) => {
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

  if (fiber.parent) {
    fiber.parent?.sibling
  }

  return null
}


function commitRoot(fiber: LinkNode) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
    if (fiber?.parent?.dom) {
      (fiber.parent.dom as HTMLElement).append(fiber.dom)
    }
  }
  if (fiber.child) {
    commitRoot(fiber.child)
  }
  else if (fiber.sibling) {
    commitRoot(fiber.sibling)
  }
  // const children = fiber.children
}

const workLoop: IdleRequestCallback = (deadline) => {
  let shouldYield = false;

  while (!shouldYield) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && rootNode) {
    commitRoot(rootNode)
  }
  requestIdleCallback(workLoop)
}

function render(el: VDom, container: HTMLElement) {
  nextWorkOfUnit = {
    type: 'TEXT_ELEMENT',
    parent: null,
    sibling: null,
    child: null,
    dom: container,
    props: {
      children: [el]
    }
  }

  rootNode = nextWorkOfUnit

  requestIdleCallback(workLoop)

}

export default {
  createElement,
  render
}
