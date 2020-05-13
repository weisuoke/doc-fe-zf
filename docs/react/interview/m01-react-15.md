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

