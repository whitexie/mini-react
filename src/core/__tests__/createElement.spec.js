import React from '../React'
import { it, describe, expect } from 'vitest'

describe('createElement', () => {
  it('props 为空时', () => {
    const dom = React.createElement('div', {})

    expect(dom).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [],
        },
        "type": "div",
      }
    `)
  })

  it('props 有值是', () => {
    const dom = React.createElement('div', { id: 'id' })

    expect(dom).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [],
          "id": "id",
        },
        "type": "div",
      }
    `)
  })

  it('子节点是element元素时 ', () => {
    const dom = React.createElement('div', { id: 'id' }, {
      type: 'a', props: {
        'href': 'https://www.baidu.com',
      }
    }, 'hhhhh')

    expect(dom).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "href": "https://www.baidu.com",
              },
              "type": "a",
            },
            {
              "props": {
                "children": [],
                "nodeValue": "hhhhh",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "id",
        },
        "type": "div",
      }
    `)
  })

  it('子节点是文本内容时', () => {
    const dom = React.createElement('div', null, 'hhhhh');

    expect(dom).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hhhhh",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
  })
})
