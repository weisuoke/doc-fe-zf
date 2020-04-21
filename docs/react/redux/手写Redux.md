# 手写Redux

## 1. Redux应用场景 

- 随着 JavaScript 单页应用开发日趋复杂,管理不断变化的 state 非常困难
- Redux的出现就是为了解决state里的数据问题
- 在React中，数据在组件中是单向流动的
- 数据从一个方向父组件流向子组件(通过props)，由于这个特征，两个非父子关系的组件（或者称作兄弟组件）之间的通信就比较麻烦

![redux-wrong](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-04-21-085051.png)

## 2.  Redux设计思想

- Redux是将整个应用状态存储到到一个地方，称为store
- 里面保存一棵状态树state tree
- 组件可以派发dispatch行为action给store,而不是直接通知其它组件
- 其它组件可以通过订阅store中的状态(state)来刷新自己的视图

![redux-flow](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/ipic/2020-04-21-085105.png)

## 3. Redux三大原则

- 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中
- State 是只读的，惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象 使用纯函数来执行修改，为了描述action如何改变state tree ，你需要编写 reducers
- 单一数据源的设计让React的组件之间的通信更加方便，同时也便于状态的统一管理

## 4. 原生计数器

### 4.1 index.html

```html
 <div id="counter">
    <p id="counter-value">0</p>
    <button id="increment-btn">+</button>
    <button id="decrement-btn">-</button>
  </div>
```

### 4.2 index.js

```js
import {createStore} from 'redux';
let counterValue = document.getElementById('counter-value');
let incrementBtn = document.getElementById('increment-btn');
let decrementBtn = document.getElementById('decrement-btn');

const INCREMENT='INCREMENT';
const DECREMENT = 'DECREMENT';
let initState = 0;
function reducer(state=initState,action){
    switch(action.type){
        case INCREMENT:
            return state + 1;
        case DECREMENT:
            return state - 1;
        default:
            return state;
    }
}
let store=createStore(reducer);
function render() {
    counterValue.innerHTML=store.getState();
}
store.subscribe(render);
render();
incrementBtn.addEventListener('click',function () {
    store.dispatch({type:INCREMENT});
});
decrementBtn.addEventListener('click',function () {
    store.dispatch({type:DECREMENT});
});
```

### 4.3 redux

#### 4.3.1 index.js

```js
// src\redux\index.js
import createStore from './createStore'
export {
    createStore
}
```

#### 4.3.2 createStore.js

```js
// src\redux\createStore.js
export default function createStore(reducer, preloadedState) {
  let currentState = preloadedState;
  let currentListeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    currentListeners.push(listener);
    return function unsubscribe() {
      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    if (Object.getPrototypeOf(action) !== Object.prototype) {
      throw new Error(`动作必须是一个纯对象，如果想进行异步操作请使用中间件`);
    }
    if (typeof action.type === "undefined") {
      throw new Error(`动作不能一个值为undefined的type属性`);
    }

    currentState = reducer(currentState, action);
    for (let i = 0; i < currentListeners.length; i++) {
      const listener = currentListeners[i];
      listener();
    }

    return action;
  }
  dispatch({ type:'@@redux/INIT' });
  return {
    dispatch,
    subscribe,
    getState
  };
}
```

