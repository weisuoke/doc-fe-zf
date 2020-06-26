#  面试 - JS基础

## 执行上下文

![image-20200626010406082](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-25-170407.png)



```js
function task() {
  var a = 1;
  var b = {
    name: 'zhufeng'
  }
  var c = [1, 2, 3];
}

task();

// task的执行上下文
let taskExecutionContext = {
  this: window,
  scopeChain: [],
  // Variable Object变量对象 里面存的是当前函数执行要使用到的变量
  VO: {
    arguments: {},
    a: 1,
    b: `xo1`,
    c: `xa1`
  }
}
```

![image-20200626010839723](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-25-170841.png)

(**Local指的是VO**)

```js
var a = 1
var b = a;

b = 2;
console.log(a); // 👉 1
```

基本数据类型赋值，和引用数据类型赋值不一样

```js
let executionContext = {
  VO: {}
}
executionContext.VO.a = 1;
executionContext.VO.b = 1;
executionContext.VO.b = 2;
console.log(executionContext.VO.a)
```



```js
var m = {a: 1, b: 2};	// xo1
// 如果是引用数据类型，赋值的时候赋值的是引用地址
var n = m; // n = xo1
n.a = 10;	// {a: 10, b: 2}
console.log(m.a); // 👉 10
```

```js
let executionContext = {
  VO: { m: {a: 1, b: 2}}
}
executionContext.VO.n = executionContext.VO.m
executionContext.VO.n = 10;
console.log(executionContext.VO.m.a); // 👉 10
```

## 执行上下文栈

![image-20200626012140519](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-25-172143.png)

```js
var globalExecutionContext = {
  VO: {
    setTimeout,
    Math,
    String
  }
}

var window = globalExecutionContext.VO;
window.setInterval;

function one() {
  var a = 10;
}

one();

let oneExecutionContext = {
  // oneExecutionContext.VO 对象我们是无法访问和获取的
  // 为什么不让访问，是为了保护里面的变量不能
  VO: {
    a: 10
  }
}
```

### 疑问

>1. let 申明的变量为什么在 Window 上访问不到？let 和 var 区别？

```js
function one() {
  var a = 1;
  var two = () => {
    var b = 2;
    var three = () => {
      var c = 3;
      console.log(a, b, c);
    }
    three();
  }
  two();
}
one();
```

使用VO、AO、GO来描述

```js
var executeContextStack = [];

// 全局上下文
var globalExecuteContext = {
  VO: { one: '() => {}' }
}
executeContextStack = [globalExecuteContext]

var oneExecuteContext = {
  VO: {a: 1, two: '() => {}'}
}
executeContextStack = [oneExecuteContext, globalExecuteContext]

var twoExecuteContext = {
  VO: {b: 2, three: '() => {}'}
}

executeContextStack = [twoExecuteContext, oneExecuteContext, globalExecuteContext]

var threeExecuteContext = {
  VO: {c: 3}
}

// 执行上下文栈
executeContextStack = [threeExecuteContext, twoExecuteContext, oneExecuteContext, globalExecuteContext]

// console.log(a, b, c)
// 变量的值是如何查找的

// 作用域链的查找过程
function getVariableValue(name) {
  for (let i = 0; i < executeContextStack.length; i++) {
    if (varName in executeContextStack[i].VO) {
      return executeContextStack[i].VO[varName]
    }
  }
}

console.log(getVariableValue('a'), getVariableValue('b'), getVariableValue('c'))
```

> 什么叫作用域？
>
> 作用域就是一个一个上下文

## 作用域链 (important)

```js
/**
 * 作用域链在函数创建的时候就已经确定了，根在哪里执行没有关系
 */
function one() {
  var a = 1;
  function two() {
    console.log(a);
  }
  // 函数创建的时候就已经定下来了
  // two['[[Scopes]]'] = [oneExecutionContextVo, globalExecutionContextVo]
  return two;
}

var a = 2;
var outer_two = one();
outer_two(); // 打印1
```

```js
// 现在开始代码执行
// 执行上下文有两个阶段，第一个是编译阶段，第二个是执行阶段
// 编译阶段会寻找里面的 var 变量声明和函数声明，进行变量提升
var globalExecutionContextVo = {
  one: `() => {}` // 函数声明的话会声明并赋值
  a: undefined,	// var 变量会声明，但不赋值
  outer_two: undefined
}
var globalExecutionContext = {
  VO: globalExecutionContextVo
  scopeChain: [globalExecutionContextVo]
}
// 开始执行
globalExecutionContext.VO.a = 2;

// 进入 one 函数的执行的时候的执行上下文的编译阶段 function var
// two 这个函数的作用域链其实是在创建 oneExecutionContext 的时候确定的
var oneExecutionContextVo = {
  two: `() => {}`
  a: undefined
}

var oneExecutionContext = {
  VO: oneExecutionContextVo,
  scopeChain: [oneExecutionContextVo, globalExecutionContextVo]
} 
// 开始执行 oneExecutionContext 的执行阶段
oneExecutionContext.VO.a = 1
globalExecutionContext.VO.outer_two = "two"

// two
var twoneExecutionContextVo = {
}
// two 这个函数的作用域其实并不是在这个时候，也就是不是在two执行的时候创建或确定的！
var twoExecutionContext = {
  VO: twoneExecutionContextVo,
 	scopeChain: [twoExecutionContextVo, ...two['[[Scopes]]']]
  // scopeChain: [twoExecutionContextVo, oneExecutionContextVo, globalExecutionContextVo]
} 
```

> **一个好的问题：**
>
> 作用域链不是在上下文中么，但是上下文不是函数执行才创建么是不是和作用域链在函数创建的时候就确定了有冲突

## AO (激活对象)

```js
/**
 * VO
 * Local
 * this
 */
function one(m) {
  function two() {
    console.log('two')
  }
  two();
}
one(1);
```

```js
let globalVO = {one: 'one'};
let globalEC = { VO: globalVO, this: window, scopeChain: [globalVO] }
let ECStack = []
ECStack.push(globalEC)
// ===============================
let oneVo = { two: 'fn two' }
let oneEC = { VO: oneVo, this: window, scopeChain: [oneVo, globalVO] }
ECStack.push(oneEC)
// 当 one 开始执行的时候，因为 oneEC 处于执行栈的顶端，这个时候，oneVO 就会成为 AO
// Activation Object oneVo.this = window
let twoVo = { }
let twoEC = { VO: twoVo, this: window, scopeChain: [twoVo, oneVo, globalVO] }
ECStack.push(twoEC)
ECStack.pop()
ECStack.pop()
```

## 闭包

- 闭包有两部分组成，一个是当前的执行上下文A，一个是在该执行上下文中创建的函数B
- 当B执行的时候引用了当前执行上下文A中的变量就会产出闭包
- 当一个值失去引用的时候就会会标记，被垃圾收集回收机回收并释放空间
- 闭包的本质就是在函数外部保持内部变量的引用，从而阻止垃圾回收
- 调用栈的并不会影响作用域链,函数调用栈是在执行时才确定，而作用域规则是在代码编译阶段就已经确定了
- MDN定义:闭包是指这样的作用域`foo`,它包含了一个函数`fn`，这个函数`fn1`可以调用被这个作用域所封闭的变量`a`、函数等内容



> ？？？？
>
> 作用域链是在创建函数的时候确定的
>
> 调用栈是在调用的时候确定的