import React from './React.ts'
import type { VDom } from './React.ts'

const ReactDom = {
  createRoot(container: HTMLElement) {
    return {
      render(el: VDom) {
        React.render(el, container)
      }
    }
  }
}

export default ReactDom
