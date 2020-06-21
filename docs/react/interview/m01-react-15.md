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

## step-03 PureComponent

现在的React `Component` 是这样的

```js
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

如果你去看源码，你会发现源码不是这样写的, [点我查看](https://github.com/facebook/react/blob/v16.6.0/packages/react/src/ReactBaseClasses.js)

是这样的

```js
/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}
// 不在类上，在类的原型上。
Component.prototype.isReactComponent = {};
```

这里我们写了一个Component的构造函数，Component的原型上有一个 isReactComponent 的属性。不在类上，在类的原型上。

```js
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;
```

这个文件中有个这个东西

声明了一个空的 ComponentDummy 构造函数。这个构造函数的原型指向了 Component 的构造函数

<img src="https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-05-17-154249.png" alt="image-20200517234240858" style="zoom:50%;" />

定义了一个纯组件`PureComponent`

> shouldComponentDidMount 的时候会进行一个浅检查（浅比较）

![image-20200523000921121](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-05-22-160922.png)

`Object.assign(pureComponentPrototype, Component.prototype);`

把 `Component.prototype`上的方法复制到了 pureComponentPrototype 上了

`pureComponentPrototype.isPureReactComponent = true;`

创建了一个新的类叫PureComponent，继承了 Component



```js
// ES6写法

let emptyObject = {}

class Component {

  constructor(props, context) {
    this.props = props
    this.context = context
    this.refs = emptyObject
  }
}

// 在 React 内部是凭这个变量来判断是不是一个 React 组件的
// 因为在组件定义的时候有两种方式, 一种是类组件，一种是函数组件，都被 babel 编译成函数
// 编译后后通过 isReactComponent 来判断的
Component.prototype.isReactComponent = {}

class PureComponent extends Component {

}

PureComponent.prototype.isPureReactComponent = true

export { Component }
```

## step-04 map 方法

演示一个例子，`React.children.map`

```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Child extends Component {
  render() {
    console.log(this.props.children)
    const mappedChildren = React.Children.map(this.props.children, (item, index) => (
      [<div>{item}</div>, <div>{item}</div>]
    ))
    console.log(mappedChildren)
    return (
      <div>
        {mappedChildren}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Child>
        <div>child1</div>
        <div key="key2">child2</div>
        <div key="key3">child3</div>
        {
          [
            <div key="key4">child4</div>,
            <div key="key5">child5</div>,
            <div key="key6">child6</div>
          ]
        }
      </Child>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))

```

这里分别打印 `this.props.children` 和 `mappedChildren`

![image-20200524224318852](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-05-24-145323.jpg)

打印出`mappedChildren`如下

![image-20200524225438864](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-05-24-145441.png)

这里看到的 key 非常奇怪。

再增加难度。把 key 再搞复杂点

```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Child extends Component {
  render() {
    console.log(this.props.children)
    const mappedChildren = React.Children.map(this.props.children, (item, index) => (
      [<div key={`div${index}A`}>{item}</div>, <div key={`div${index}B`}>{item}</div>]
    ))
    console.log(mappedChildren)
    return (
      <div>
        {mappedChildren}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Child>
        <div>child1</div>
        <div key="key2">child2</div>
        <div key="key3">child3</div>
        {
          [
            <div key="key4">child4</div>,
            <div key="key5">child5</div>,
            <div key="key6">child6</div>
          ]
        }
      </Child>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))
```

看下打印， 我这里要看两个东西：

1. 它是怎么工作的
2. 它是怎么去映射的
3. key是怎么生成的

![image-20200524230338795](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-05-24-150341.png)

![image-20200524230059196](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-05-24-150101.png)

把一个变成了两个。

key是怎么来的，key有什么特点？

`.0/.$div0A` 首先以`.`开头。第一个是`.0`  child1 的索引为0，`.$div0A` 是`<Child>`组件中给的 key

> 第一级元素，如果没有 key 值，使用索引。 否则使用索引
>
> 分隔符用 `/`
>
> 第二级元素就是`.$key`

`React.children.map`有展平的功能，不管有多少级。都展平成一级

**[源码](https://github.com/facebook/react/blob/v16.6.0/packages/react/src/ReactChildren.js)**

```js
// 源码
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  const result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
```

<img src="https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-05-28-001745.png" alt="img" style="zoom:50%;" />

map的流程图

> 作业：简单实现`React.Children.map`

## step04-1 一对一映射

简单实现的目标功能：

```jsx
import React, { Component } from './react'
import ReactDOM from 'react-dom'

class Child extends Component {
  render() {
    console.log(this.props.children) // 就一个 React 元素
    const mappedChildren = React.Children.map(
      this.props.children,
      function(item, index){
        return <li key={index}>{this.name}:{item}</li>
      },
      {name: '我是上下文对象'}
    )
    console.log(mappedChildren)
    return (
      <div>
        {mappedChildren}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Child>
        <span>A</span>
      </Child>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))

```

<img src="https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-05-28-002237.png" alt="image-20200528082227563" style="zoom:50%;" />

实现一个一对一的映射

```js
// ./src/react/ReactChildren.js
// # 一对一的映射
import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols'

/**
 *
 * @param children 要映射的元素，可能是一个数组，也可能是一个可渲染的节点
 * @param mapFunction
 * @param context
 * result 我们会把我们所有映射出来的节点放在 result 里面
 */
function mapChildren(children, mapFunction, context) {
  const result = []
  mapIntoWithKeyPrefixInternal(children, result, mapFunction, context)
  return result
}

// 映射函数的核心有两个数组的处理
function mapIntoWithKeyPrefixInternal(children, result, mapFunction, context) {
  // traverseContext 遍历的上下文
  const traverseContext = { result, mapFunction, context }
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext)
}

function traverseAllChildren(children, mapSingleChildIntoContext, traverseContext) {
  let type = typeof children
  // 如果 type 是字符串或数字，或者 type 是一个对象，但是 children.$$typeof 是一个 React 元素，说明 children 是一个可渲染节点
  if (type === 'string' || type === 'number' || (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)) {
    mapSingleChildIntoContext(traverseContext, children)
  }
}

// 如果执行到这个地方，child肯定是一个节点
function mapSingleChildIntoContext(traverseContext, child) {
  let { result, mapFunction, context } = traverseContext
  let mappedChild = mapFunction.call(context, child)
  result.push(mappedChild)
}

export {
  mapChildren as map
}
```

## step04-2 数组映射

```jsx
// src/index.js
import React, { Component } from './react'
import ReactDOM from 'react-dom'

// 把原来的 children 打平成一级，然后把映射后的结果打平成一级
class Child extends Component {
  render() {
    console.log(this.props.children) // 就一个 React 元素
    const mappedChildren = React.Children.map(
      this.props.children,
      function(item, index){
        // return <li key={index}>{this.name}:{item}</li>
        return [item, [item, [item, [item]]]]
      },
      {name: '我是上下文对象'}
    )
    console.log(mappedChildren)
    return (
      <div>
        {mappedChildren}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Child>
        <span>A</span>
        <span>B</span>
      </Child>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))
```

```js
// src/react/ReactChildren.js
import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols'

/**
 *
 * @param children 要映射的元素，可能是一个数组，也可能是一个可渲染的节点
 * @param mapFunction
 * @param context
 * result 我们会把我们所有映射出来的节点放在 result 里面
 */
function mapChildren(children, mapFunction, context) {
  const result = []
  mapIntoWithKeyPrefixInternal(children, result, mapFunction, context)
  return result
}

// 映射函数的核心有两个数组的处理
function mapIntoWithKeyPrefixInternal(children, result, mapFunction, context) {
  // traverseContext 遍历的上下文
  const traverseContext = { result, mapFunction, context }
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext)
}

function traverseAllChildren(children, mapSingleChildIntoContext, traverseContext) {
  let type = typeof children
  // 如果 type 是字符串或数字，或者 type 是一个对象，但是 children.$$typeof 是一个 React 元素，说明 children 是一个可渲染节点
  if (type === 'string' || type === 'number' || (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)) {
    mapSingleChildIntoContext(traverseContext, children)
  } else  if (Array.isArray(children)){
    // 如果 children 是数组的话， traverse
    for (let i = 0; i < children.length; i++) {
      traverseAllChildren(children[i], mapSingleChildIntoContext, traverseContext)
    }
  }
}

// 如果执行到这个地方，child肯定是一个节点
function mapSingleChildIntoContext(traverseContext, child) {
  let { result, mapFunction, context } = traverseContext
  let mappedChild = mapFunction.call(context, child)
  // 往 result 里面放的永远只能是一个对象。不能是数组
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, c => c, context)
  } else {
    result.push(mappedChild)
  }
}

export {
  mapChildren as map
}
```

## step05 实现 key

现在将功能改成如下显示

```jsx
// src/index.js

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// 把原来的 children 打平成一级，然后把映射后的结果打平成一级
class Child extends Component {
  render() {
    console.log(this.props.children) // 就一个 React 元素
    const mappedChildren = React.Children.map(
      this.props.children,
      function(item, index){
        // return <li key={index}>{this.name}:{item}</li>
        return [item, [item, [item, [item]]]]
      },
      {name: '我是上下文对象'}
    )
    console.log(mappedChildren)
    return (
      <div>
        {mappedChildren}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Child>
        {[<span>A</span>,<span>B</span>]}
        {[<span>C</span>,<span>D</span>]}
      </Child>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))

```

使用原生React, 打印的结果如下：

![image-20200602125929615](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-02-045932.png)

使用现在自己写的 React，打印结果如下：

![image-20200602130051260](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-02-050054.png)

观察`key`的变化

### key值说明

#### .0:0/.0

斜杠是分隔符，斜杠前是映射前的索引。斜杠后是映射后的索引

![image-20200602131420079](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-02-051422.png)

映射前第一个元素是一个数组，包含A、B两个值。 A对应的是 `.0:0` , B对应的是 `.0:1`

映射前第二个元素是一个数组，包含C、D两个值。C对应的是 `.1:0` , D对应的是 `.1:1`

**子函数的映射函数是**

```js
function(item, index){
  // return <li key={index}>{this.name}:{item}</li>
  return [item, [item, [item, [item]]]]
},
```

`[item, [item, [item, [item]]]]` 

- 第一个 item 输出为`.0`
- 第二个 item 输出为`.1:0`
- 第三个 item 输出为`.1:1:0`
- 444第四个 item 输出为`.1:1:1:0`

#### ReactChilldren.js 文件变化

```js
import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols'

const SEPARATOR = '.'; // 分隔符 开头的分隔符
const SUB_SEPARATOR = ':';  // 子分隔符 中间的分隔符

/**
 *
 * @param children 要映射的元素，可能是一个数组，也可能是一个可渲染的节点
 * @param mapFunction
 * @param context
 * result 我们会把我们所有映射出来的节点放在 result 里面
 */
function mapChildren(children, mapFunction, context) {
  const result = []
  mapIntoWithKeyPrefixInternal(children, result, null, mapFunction, context)
  return result
}

// 映射函数的核心有两个数组的处理
// prefix 指的是渲染前的节点 key, 最终 key 的 / 前面的那部分
function mapIntoWithKeyPrefixInternal(children, result, prefix, mapFunction, context) {
  // traverseContext 遍历的上下文
  if (prefix != null) {
    prefix = prefix + '/' // .0:0 => .0:0/
  }
  const traverseContext = { result, prefix, mapFunction, context }
  traverseAllChildren(children, '', mapSingleChildIntoContext, traverseContext)
}

function traverseAllChildren(children, nameSoFar, mapSingleChildIntoContext, traverseContext) {
  let type = typeof children
  // 如果 type 是字符串或数字，或者 type 是一个对象，但是 children.$$typeof 是一个 React 元素，说明 children 是一个可渲染节点
  if (type === 'string' || type === 'number' || (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)) {
    mapSingleChildIntoContext(traverseContext, children,
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    )
  } else  if (Array.isArray(children)){
    // 如果传过来的 nameSoFar 是空的。前缀就是`.`，否则就是`:`
    // 第二次进来的时候 nameSoFar = .0
    let nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUB_SEPARATOR
    // 如果 children 是数组的话， traverse
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      let nextName = nextNamePrefix + getComponentKey(child, i);
      traverseAllChildren(children[i], nextName, mapSingleChildIntoContext, traverseContext)
    }
  }
}

function getComponentKey(component, index) {
  return component.key || index.toString(36); // 如果说此节点有自己的 key，就用自己的 key，如果没有就用他的索引
}

// 如果执行到这个地方，child肯定是一个节点
function mapSingleChildIntoContext(traverseContext, child, childKey) {
  let { result, prefix, mapFunction, context } = traverseContext
  let mappedChild = mapFunction.call(context, child)
  // 往 result 里面放的永远只能是一个对象。不能是数组
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c, context)
  } else {
    // 把对象展开，重写 key. prefix 转换前索引组成的 key/childKey 转换后的索引组成的 key
    result.push({...mappedChild, key: prefix + childKey})
  }
}

export {
  mapChildren as map
}
```

