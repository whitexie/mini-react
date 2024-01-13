# 01-实现最简mini-creact

### 完成目标

#### 01
主要实现下面的API调用
```javascript
import ReactDom from './core/ReactDom.js'
import App from './App.js'

ReactDom.createRoot(document.getElementById("root")).render(App)
```
createRoot函数，接收一个dom节点，后续调用render函数创建的子节点都在节点下。


#### 02 使用JSX
  Vite对Jsx的支持很好，无须额外的配置。

```jsx
// App.jsx
import React from "./core/React.js";

const App = <div>hi,mini-react</div>;

export default App;

```
Vite 在转换JSX时，会在当前文件上下文中找到React对象，并调用React.createElement方法


### 拆解

#### 1.构建虚拟节点树
`createElement`: 创建节点入口函数  
`createTextNode`: 用于创建文本节点

#### 2.根据虚拟节点渲染真实节点
