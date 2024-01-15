type HTMLTagName = keyof HTMLElementTagNameMap

type VDomType = HTMLTagName | 'TEXT_ELEMENT' | FunctionComponent | VDom

type Props = Record<PropertyKey, any> & { children: VDom[] };

export interface VDom {
  type: VDomType
  props: Props
}

type FunctionComponent = () => VDom

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

  const dom = document.createElement(el.type as HTMLTagName)
  const props = el.props
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })

  return dom
}

function createElement(type: VDomType, props: Partial<Props>, ...children: (VDom | string)[]) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = ['number', 'string'].includes(typeof child)
        return isTextNode ? createTextNode(child as string) : child
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

function createLinkNode(vdom: VDom, parent: LinkNode): LinkNode {
  const node: LinkNode = { dom: null, sibling: null, child: null, ...vdom, parent }

  return node
}

export function initChidren(fiber: LinkNode, children: VDom[]) {

  let preChild: LinkNode | null = null;
  children.forEach((child, index) => {
    const newFiber = createLinkNode(child, fiber)

    if (index === 0) {
      fiber.child = newFiber
    }
    else if (preChild) {
      preChild.sibling = newFiber
    }

    preChild = newFiber
  })

}

function performUnitOfWork(fiber: LinkNode | null) {
  if (!fiber) {
    return null
  }

  const isFunctionComponent = typeof fiber.type === 'function'
  if (!isFunctionComponent && !fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  let children = fiber.props.children

  if (isFunctionComponent) {
    children = [(fiber.type as Function).call(fiber, fiber.props)]
  }

  initChidren(fiber, children)

  // 返回下一个执行的fieber
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }


  if (fiber.parent) {
    let parent = fiber.parent
    while (!parent?.sibling && parent.parent) {
      parent = parent.parent
    }
    return parent.sibling
  }

  return null
}


function commitNode(fiber: LinkNode) {
  if(!fiber) return

  if (fiber.dom && fiber.parent) {
    let parent = fiber.parent
    while (!parent.dom && parent.parent) {
      parent = parent.parent
    }
    (parent.dom as HTMLElement).append(fiber.dom)
  }

  if (fiber.child) {
    commitNode(fiber.child)
  }

  let parent = fiber
  while (!parent.sibling && parent.parent) {
    parent = parent.parent
  }
  commitNode(parent.sibling as LinkNode)
}

const workLoop: IdleRequestCallback = (deadline) => {
  let shouldYield = false;

  while (!shouldYield) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && rootNode) {
    commitNode(rootNode)
  }
  requestIdleCallback(workLoop)
}

function render(el: VDom, container: HTMLElement) {
  nextWorkOfUnit = {
    type: 'div',
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
