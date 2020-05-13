# 听课01-手写 React 15

写两个版本

- React 15
- React 16

**React 15学习**

- 虚拟DOM
- 异步setState更新
- 事务
- 合成事件
- DOM Diff
- DOM Diff key的处理 

**React 16**

- 加个 Fiber

## step-01

[step-01](https://github.com/weisuoke/zf-react-15/tree/step-01)

使用`create-react-app`初始化项目

删除项目中多余的文件

```jsx
// src/index.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  render() {
    return (
      <div>
        <p>1</p>
        <button>+</button>
      </div>
    )
  }
}

let element = <App/>

ReactDOM.render(element, document.getElementById('root'))
```

## step-02 虚拟DOM

打印 `element`

![image-20200512233444122](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-05-12-153448.png)

element 是一个对象：

- **$$typeof**: 比较重要，表示这是一个React元素

- `key` : `key`是null, 区分每个儿子是唯一的标识
- `props`: `props`是属性对象，这里是空
- `ref`:
- `type`: 这是一个类，App 指的是类名
- `_owner`: 所有者是谁，拥有者是谁，谁创建了它，因为它没有爹，所以这里为null。拥有者的意思
- `_store`:
- `_self`: 获取指针的
- `_source`: 获取源代码

`_owner`、`_store`、`_self`、`_source`都是内部属性

`_source`只在生成环境中有，production环境是没有的 

> 虚拟 DOM 指的就是 React 元素，一个普通的JS对象，它可以描述 UI 的样子 。描述真实 DOM 的样子。但是它不是真实DOM，是虚拟DOM



去 https://www.babeljs.cn/ 

JSX 经过 Babel 编译后的结果

![image-20200512234846269](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-05-12-154853.png)



```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  render() {
    let returnElement = React.createElement(
      "div",
      null,
      React.createElement("p", null, "1"),
      React.createElement("button", null, "+")
    )
    return returnElement;
  }
}


let element = <App/>
console.log(element)

ReactDOM.render(element, document.getElementById('root'))
```

打印 returnElement

![image-20200512235459521](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-05-12-155504.png)

element的`type`是class App

returnElement的`type`是 div

两者的$$typeof都是Symbol唯一标识，React.element

key都是空的

![image-20200512235726381](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-05-12-155729.png)

> `_owner`有值（FiberNode），FiberNode 后面讲

> 区分类组件和原生DOM组件?
>
> type如果是class的话就是类组件，如果是div的话，是原生DOM组件

### 实现虚拟DOM

新建文件 src/react/index.js

```js
// src/react/index.js
import React, { Component } from './react'
import ReactDOM from 'react-dom'

class App extends Component {
  static defaultProps = {
    name: 'app'
  }

  render() {
    let returnElement = React.createElement(
      'div',
      {id: this.props.name + '_' + this.props.title},
      React.createElement('p', null, '1'),
      React.createElement('button', null, '+')
    )
    console.log(returnElement)
    return returnElement
  }
}

let element = React.createElement(App, { title: 'zhufeng' })

ReactDOM.render(element, document.getElementById('root'))
```

```js
// src/react/index.js
import { Component } from './ReactBaseClasses'
import { createElement } from './ReactElement'

const React = {
  createElement
}

export {
  Component
}

export default React
```

```js
// src/react/ReactElement.js
import ReactCurrentOwner from './ReactCurrentOwner'
import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols'

function hasValidRef(config) {
  return config.ref !== undefined
}

function hasValidKey(config) {
  return config.key !== undefined
}

const RESOLVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
}

export function createElement(type, config, children) {
  let propName; // 定义一个变量叫属性名
  const props = {}; // 定一个一个元素的 props 对象
  let key = null; // 在兄弟节点中唯一标识自己的唯一性，在同一个的不同兄弟之间 key 要求不同
  let ref = null; // ref = React.createRef() | "username" | {input => this.username = input}. ref 的三种方式. 从而得到真实的 DOM 元素
  let self = null; // 用来获取真实的 this 指针
  let source = null; // 用来定位创建此虚拟 DOM 元素在源码中的位置，哪个文件，哪一行，哪一列

  if (config !== null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }

    if (hasValidKey(config)) {
      key = config.key;
    }

    // React 内部自己维护的
    self = config.__self === undefined ? null : config.__self
    source = config.__source === undefined ? null : config.__source

    for(propName in config) {
      if (!RESOLVED_PROPS.hasOwnProperty(propName)) {
        config[propName] = config[propName]
      }
    }
  }

  const childrenLength = arguments.length - 2

  if (childrenLength === 1) {
    props.children = children;  // 如果说是独生子的话 children 是一个对象
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childArray.length; i++) {
      childArray[i] = arguments[i + 2]
    }
    props.children = childArray;  // 如果是有多个儿子，props.children 就是一个数组
  }

  // 处理默认属性
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps
    // 只有当属性对象里面没有此属性对应的值的时候。默认属性才会生效，否则直接忽略
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = config[propName]
      }
    }
  }

  // ReactCurrentOwner 此元素的拥有者， fiber 里面用到的
  return ReactElement(
    type, key, ref, self, source, ReactCurrentOwner.current, props
  )
}

function ReactElement(type, key, ref, _self, _source, _owner, props ) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    _owner,
    _self,
    _source
  }

  return element
}
```

```js
// src/react/ReactCurrentOwner.js
const ReactCurrentOwner = {
  current: null
}

export default ReactCurrentOwner
```

```js
// src/react/ReactBaseClasses.js
class Component {
  constructor(props, context) {
    this.props = props
    this.context = context
  }
}

// 在 React 内部是凭这个变量来判断是不是一个 React 组件的
// 因为在组件定义的时候有两种方式, 一种是类组件，一种是函数组件，都被 babel 编译成函数
// 编译后后通过 isReactComponent 来判断的
Component.prototype.isReactComponent = {};

export { Component }

```

### $$typeof的作用

用来标识元素的类型

	- div
	- Class
	- Function

具体的类型在这里查看，[点我](https://github.com/facebook/react/blob/v16.6.0/packages/shared/ReactSymbols.js)

如果说`$$typeof`是symbol的话可以用来防 XSS 攻击

symbol是不可变值，是唯一值。

请求后台接口放回的是 `{type: 'div', props: {}}`，那么就在渲染页面上。如果返回的数据被注入攻击了。type是一个攻击后的值，是一个恶意的值。渲染的话会出问题，为了防止后台返回的数据有恶意的虚拟DOM类型，可以用Symbol避免这个问题。因为后台没有Symbol值，Symbol值只有前端有。

## step-03

