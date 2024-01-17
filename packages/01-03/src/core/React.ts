type HTMLTagName = keyof HTMLElementTagNameMap

type VDomType = HTMLTagName | 'TEXT_ELEMENT' | FunctionComponent | VDom

type Props = Record<PropertyKey, any> & { children: VDom[] };

export interface VDom {
  type: VDomType
  props: Props
}

type FunctionComponent = () => VDom

type EffectTagType = 'update' | 'placement'

interface LinkNode extends VDom {
  dom: null | HTMLElement | Text
  child: LinkNode | null
  sibling: LinkNode | null
  parent: LinkNode | null
  effectTag: EffectTagType
  alternate?: LinkNode | null
}

let nextWorkOfUnit: LinkNode | null = null;
let currentNode: LinkNode | null = null
let rootNode: LinkNode | null = null;

function createDom(el: VDom): HTMLElement | Text {
  if (el.type === 'TEXT_ELEMENT') {
    return document.createTextNode(el.props.nodeValue)
  }
  const dom = document.createElement(el.type as HTMLTagName)

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

function createLinkNode(vdom: VDom, parent: LinkNode, option: Partial<LinkNode>): LinkNode {
  const node: LinkNode = { dom: null, sibling: null, child: null, ...vdom, parent, effectTag: 'placement' }
  Object.keys(option).forEach(key => {
    node[key] = option[key]
  })

  return node
}

export function initChidren(fiber: LinkNode, children: VDom[]) {
  let oldFiber = fiber.alternate?.child
  let preChild: LinkNode | null = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type

    const option: Partial<LinkNode> = {
      effectTag: isSameType ? 'update' : 'placement',
      dom: isSameType ? oldFiber?.dom : null,
      alternate: isSameType ? oldFiber : undefined
    }

    const newFiber = createLinkNode(child, fiber, option)

    if (index === 0) {
      fiber.child = newFiber
    }
    else if (preChild) {
      preChild.sibling = newFiber
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    preChild = newFiber
    oldFiber
  })

}

function updateProps(dom: HTMLElement | Text, nextProps: Omit<Props, 'children'>, prevProps: Omit<Props, 'children'>) {
  Object.keys(prevProps).forEach((key) => {
    if (!(key in nextProps)) {
      (dom as HTMLElement).removeAttribute(key)
    }
  })
  Object.keys(nextProps).forEach(key => {
    if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();
      const func = nextProps[key]
      dom.removeEventListener(event, prevProps[key])
      dom.addEventListener(event, func)
    }
    else if (key !== 'children') {
      dom[key] = nextProps[key]
    }
  })
}

function performUnitOfWork(fiber: LinkNode | null) {
  if (!fiber) {
    return null
  }

  const isFunctionComponent = typeof fiber.type === 'function'
  if (!isFunctionComponent && !fiber.dom) {
    fiber.dom = createDom(fiber)
    updateProps(fiber.dom, fiber.props, {})
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
  if (!fiber) return

  if (fiber.dom && fiber.parent) {
    let parent = fiber.parent
    while (!parent.dom && parent.parent) {
      parent = parent.parent
    }

    if (fiber.effectTag === 'update') {
      updateProps(fiber.dom, fiber.props, fiber.alternate?.props || {});
    }
    else if (fiber.effectTag === 'placement') {
      (parent.dom as HTMLElement).append(fiber.dom)
    }
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

function commitRoot() {
  if (rootNode) {
    commitNode(rootNode)
    currentNode = rootNode
    rootNode = null
  }
}

const workLoop: IdleRequestCallback = (deadline) => {
  let shouldYield = false;

  while (!shouldYield) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && rootNode) {
    commitRoot()
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
    effectTag: 'placement',
    props: {
      children: [el]
    }
  }

  rootNode = nextWorkOfUnit

  requestIdleCallback(workLoop)

}

function update() {
  if (currentNode) {

    rootNode = {
      type: 'div',
      parent: null,
      sibling: null,
      child: null,
      dom: currentNode.dom,
      props: currentNode.props,
      effectTag: 'update',
      alternate: currentNode,
    }

    nextWorkOfUnit = rootNode
  }

  requestIdleCallback(workLoop)

}

export default {
  update,
  createElement,
  render
}
