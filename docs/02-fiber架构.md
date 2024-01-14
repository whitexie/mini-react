# fiber架构实现

## 背景
> 目前我们是通过递归来渲染真实dom的，当面临大量dom节点需要渲染时，会造成卡顿等情况。



## 解决方案
使用链表结构和`requestIdleCallback`，利用浏览器空闲时间来执行render



## 参考
- [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)
