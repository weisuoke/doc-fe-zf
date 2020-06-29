# 01. Webpack bundle

## 1. webpack 介绍

- `Webpack`是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

![webpack_intro](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-29-011321.gif)

## 2. 预备知识

### 2.1 toStringTag

- `Symbol.toStringTag` 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签
- 通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

```js
console.log(Object.prototype.toString.call("foo")); // "[object String]"
console.log(Object.prototype.toString.call([1, 2])); // "[object Array]"
console.log(Object.prototype.toString.call(3)); // "[object Number]"
console.log(Object.prototype.toString.call(true)); // "[object Boolean]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
let myExports = {};
Object.defineProperty(myExports, Symbol.toStringTag, { value: "Module" });
console.log(Object.prototype.toString.call(myExports)); //[object Module]
[object String]
[object Array]
[object Number]
[object Boolean]
[object Undefined]
[object Null]
[object Module]
```

### 2.2 Object.create(null)

- 使用`create`创建的对象，没有任何属性,把它当作一个非常纯净的 map 来使用，我们可以自己定义`hasOwnProperty`、`toString`方法,完全不必担心会将原型链上的同名方法覆盖掉
- 在我们使用`for..in`循环的时候会遍历对象原型链上的属性，使用`create(null)`就不必再对属性进行检查了

```js
var ns = Object.create(null);
if (typeof Object.create !== "function") {
  Object.create = function (proto) {
    function F() {}
    F.prototype = proto;
    return new F();
  };
}
console.log(ns); //[Object: null prototype] {}
console.log(Object.getPrototypeOf(ns)); //null
```

### 2.3 getter

- defineProperty

   

  方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

  - obj 要在其上定义属性的对象。
  - prop 要定义或修改的属性的名称。
  - descriptor 将被定义或修改的属性描述符。

```js
let obj = {};
var ageValue = 10;

Object.defineProperty(obj, "age", {
  //writable: true, //是否可修改
  //value: 10, //writeable 和 set不能混用
  get() {
    return ageValue;
  },
  set(newValue) {
    ageValue = newValue;
  },

  enumerable: true, //是否可枚举
  configurable: true, //是否可配置可删除
});

console.log(obj.age);
obj.age = 20;
console.log(obj.age);
```

### 2.4 按位与(&)

- 比特就是 bit 二进制数系统中,每个 0 或 1 就是一个位(bit),位是数据存储的最小单位
- 其中 8 个 bit 就称为一个字节(Byte)
- 按位与(&) 两个输入数的同一位都为 1 才为 1
- js 中 0 为 false

<img src="https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-29-011336.png" alt="bitbyte" style="zoom:50%;" />

![bitand2](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-29-011331.png)

## 3. 同步加载

```js
cnpm i webpack webpack-cli html-webpack-plugin clean-webpack-plugin -D
```

### 3.1 webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "none",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  devServer: {},
};
```

### 2.2 index.js

src\index.js

```js
let title = require("./title.js");
console.log(title);
```

### 2.3 title.js

src\title.js

```js
module.exports = "title";
```

### 2.4 index.html

src\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack</title>
  </head>
  <body></body>
</html>
```

### 2.5 package.json

package.json

```json
  "scripts": {
    "build": "webpack"
  }
```

### 2.6 打包文件分析

#### 2.6.1 bundle.js

```js
(function (modules) {
  // webpack的启动函数
  //模块的缓存
  var installedModules = {};

  //定义在浏览器中使用的require方法
  function __webpack_require__(moduleId) {
    //检查模块是否在缓存中
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    //创建一个新的模块并且放到模块的缓存中
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    //执行模块函数
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    //把模块设置为已经加载
    module.l = true;

    //返回模块的导出对象
    return module.exports;
  }

  //暴露出模块对象
  __webpack_require__.m = modules;

  //暴露出模块缓存
  __webpack_require__.c = installedModules;

  //为harmony导出定义getter函数
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  //在导出对象上定义__esModule属性
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  /**
   * 创建一个模拟的命名空间对象
   * mode & 1 value是模块ID直接用__webpack_require__加载
   * mode & 2 把所有的属性合并到命名空间ns上
   * mode & 4 当已经是命名空间的时候(__esModule=true)可以直接返回值
   * mode & 8|1 行为类似于require
   */
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null); //定义一个空对象
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport函数为了兼容那些非non-harmony模块
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  //判断对象身上是否拥有此属性
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  //公共路径
  __webpack_require__.p = "";

  //加载入口模块并且返回导出对象
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function (module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title);
  },
  "./src/title.js": function (module, exports) {
    module.exports = "title";
  },
});
```

#### 2.6.2 d

```js
function __webpack_require__() {}
__webpack_require__.o = function (object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
};
__webpack_require__.d = function (exports, name, getter) {
  if (!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, { enumerable: true, get: getter });
  }
};
let obj = {};
__webpack_require__.d(obj, "name", function () {
  return "zhufeng";
});
console.log(obj, obj.name);
```

#### 2.6.3 r

```js
function __webpack_require__() {}
__webpack_require__.r = function (exports) {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
    enumerable: true,
  });
};

let obj = {};
__webpack_require__.r(obj);
console.log(Object.prototype.toString.call(obj));
console.log(obj);
```

#### 2.6.4 n

```js
function __webpack_require__() {}
__webpack_require__.o = function (object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
};
__webpack_require__.d = function (exports, name, getter) {
  if (!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, { enumerable: true, get: getter });
  }
};
__webpack_require__.n = function (module) {
  var getter =
    module && module.__esModule
      ? function getDefault() {
          return module["default"];
        }
      : function getModuleExports() {
          return module;
        };
  __webpack_require__.d(getter, "a", getter);
  return getter;
};

let obj1 = { name: "zhufeng" };
let getter1 = __webpack_require__.n(obj1);
console.log(getter1.a);
let obj2 = { __esModule: true, default: { name: "zhufeng" } };
let getter2 = __webpack_require__.n(obj2);
console.log(getter2.a);
(function (module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__); //__esModule=true
  /* 兼容common.js导出 */ var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    "./src/title.js"
  );
  /* 兼容common.js导出 */ var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
    _title__WEBPACK_IMPORTED_MODULE_0__
  );
  console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.name);
  console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.age);
});
```

#### 2.6.5 t

```js
let modules = {
  moduleA: function (module, exports) {
    exports.value = "moduleA";
  },
  moduleB: function (module, exports) {
    exports.__esModule = { value: "moduleB" };
  },
};
function __webpack_require__(moduleId) {
  var module = {
    i: moduleId,
    l: false,
    exports: {},
  };

  modules[moduleId].call(
    module.exports,
    module,
    module.exports,
    __webpack_require__
  );
  return module.exports;
}
console.log((1).toString(2).padStart(4, "0"));
console.log((2).toString(2).padStart(4, "0"));
console.log((4).toString(2).padStart(4, "0"));
console.log((8).toString(2).padStart(4, "0"));

function ensure(value, mode) {
  //mode & 0b0001
  if (mode & 0b0001) value = __webpack_require__(value);
  //mode & 0b1000
  if (mode & 0b1000) return value;
  //mode & 0b0100
  if (mode & 0b0100 && typeof value === "object" && value.__esModule)
    return value;
  var ns = {};
  Object.defineProperty(exports, "__esModule", { value: true });
  Object.defineProperty(ns, "default", { value, enumerable: true });
  if (mode & 0b0010 && typeof value != "string")
    for (var key in value)
      Object.defineProperty(ns, key, { value: value[key], enumerable: true });
  return ns;
}

let result1 = ensure("moduleA", 0b0001);
console.log("result1", result1); // { value: 'moduleA' } undefined
let result2 = ensure("moduleA", 0b1001);
console.log("result2", result2); //{ value: 'moduleA' }
let result3 = ensure("moduleB", 0b0101);
console.log("result3", result3); //{ __esModule: { value: 'moduleB' } }
let result4 = ensure("moduleA", 0b0111);
console.log("result4", result4);
```

### 2.7 实现

```js
(function (modules) {
  var installedModules = {};
  function require(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId];
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    modules[moduleId].call(modules.exports, module, module.exports, require);
    module.l = true;
    return module.exports;
  }
  return require((require.s = "./src/index.js"));
})({
  "./src/index.js": function (module, exports, require) {
    var title = require("./src/title.js");
    console.log(title);
  },
  "./src/title.js": function (module, exports) {
    module.exports = "title";
  },
});
```

## 3. harmony

### 3.1 common.js 加载 common.js

#### 3.1.1 index.js

```js
let title = require("./title");
console.log(title.name);
console.log(title.age);
```

#### 3.1.2 title.js

```js
exports.name = "title_name";
exports.age = "title_age";
```

#### 3.1.3 bundle.js

```js
{
"./src/index.js":
  (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  }),
"./src/title.js":
  (function(module, exports) {
    exports.name = 'title_name';
    exports.age = 'title_age';
  })
}
```

### 3.2 common.js 加载 ES6 modules

#### 3.2.1 index.js

```js
let title = require("./title");
console.log(title.name);
console.log(title.age);
```

#### 3.2.2 title.js

```js
exports.name = "title_name";
exports.age = "title_age";
```

#### 3.2.3 bundle.js

```js
{
 "./src/index.js":
 (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title["default"]);
    console.log(title.age);
 }),
 "./src/title.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    __webpack_exports__["default"] = 'title_name';
    var age = 'title_age';
 })
}
```

### 3.3 ES6 modules 加载 ES6 modules

#### 3.3.1 index.js

```js
import name, { age } from "./title";
console.log(name);
console.log(age);
```

#### 3.3.2 title.js

```js
export default name = "title_name";
export const age = "title_age";
```

#### 3.3.3 bundle.js

```js
{
 "./src/index.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"]);
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"]);
 }),
 "./src/title.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    __webpack_exports__["default"] = 'title_name';
    var age = 'title_age';
 })
}
```

### 3.4 ES6 modules 加载 common.js

#### 3.4.1 index.js

```js
import name, { age } from "./title";
console.log(name);
console.log(age);
```

#### 3.4.2 title.js

```js
module.exports = {
  name: "title_name",
  age: "title_age",
};
```

#### 3.4.3 bundle.js

```js
{
  "./src/index.js": function (
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    __webpack_require__.r(__webpack_exports__);
    var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      "./src/title.js"
    );
    var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);

    console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a);//因为要取default,所以要用n包装一下
    //console.log(
    //  _title__WEBPACK_IMPORTED_MODULE_0__.__esModule
    //    ? _title__WEBPACK_IMPORTED_MODULE_0__.default
    //    : _title__WEBPACK_IMPORTED_MODULE_0__
    //);
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"]);//age是正常取属性就可以
  },

  "./src/title.js": function (module, exports) {
    module.exports = {
      name: "title_name",
      age: "title_age",
    };
  },
}
```

## 4.异步加载

### 4.1 webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "none",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main1"],
    }),
  ],
  devServer: {},
};
```

### 4.3 src\main.js

```js
import(/* webpackChunkName: "c" */ "./c").then((c) => {
  console.log(c);
});
```

### 4.4 src\c.js

```js
export default {
  name: "zhufeng",
};
```

### 4.5 dist\main.js

```js
(function (modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var moduleId,
      chunkId,
      i = 0,
      resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (
        Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);
    while (resolves.length) {
      resolves.shift()();
    }
  }
  var installedModules = {};
  var installedChunks = {
    main: 0,
  };
  function jsonpScriptSrc(chunkId) {
    return (
      __webpack_require__.p + "" + ({ c: "c" }[chunkId] || chunkId) + ".js"
    );
  }
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    module.l = true;
    return module.exports;
  }
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    if (installedChunkData !== 0) {
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push((installedChunkData[2] = promise));
        var script = document.createElement("script");
        var onScriptComplete;
        script.charset = "utf-8";
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        script.src = jsonpScriptSrc(chunkId);
        var error = new Error();
        onScriptComplete = function (event) {
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          if (chunk !== 0) {
            if (chunk) {
              var errorType =
                event && (event.type === "load" ? "missing" : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message =
                "Loading chunk " +
                chunkId +
                " failed.\n(" +
                errorType +
                ": " +
                realSrc +
                ")";
              error.name = "ChunkLoadError";
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function () {
          onScriptComplete({ type: "timeout", target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  __webpack_require__.p = "";
  __webpack_require__.oe = function (err) {
    console.error(err);
    throw err;
  };
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++)
    webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  return __webpack_require__((__webpack_require__.s = "./src/main.js"));
})({
  "./src/main.js": function (module, exports, __webpack_require__) {
    __webpack_require__
      .e("c")
      .then(__webpack_require__.bind(null, "./src/c.js"))
      .then((c) => {
        console.log(c);
      });
  },
});
```

### 4.6 dist\c.js

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["c"],
  {
    "./src/c.js": function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_exports__["default"] = {
        name: "zhufeng",
      };
    },
  },
]);
```

### 4.7 实现

```js
(function (modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var moduleId,
      chunkId,
      i = 0,
      resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId];
    }
    while (resolves.length) {
      resolves.shift()();
    }
  }
  var installedModules = {};
  var installedChunks = { main: 0 };
  __webpack_require__.p = "";
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "" + chunkId + ".bundle.js";
  }
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    module.l = true;
    return module.exports;
  }
  __webpack_require__.t = function (value, mode) {
    value = __webpack_require__(value);
    var ns = Object.create(null);
    Object.defineProperty(ns, "__esModule", { value: true });
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    return ns;
  };

  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    var promise = new Promise(function (resolve, reject) {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    promises.push((installedChunkData[2] = promise));
    var script = document.createElement("script");
    script.src = jsonpScriptSrc(chunkId);
    document.head.appendChild(script);
    return Promise.all(promises);
  };
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  jsonpArray.push = webpackJsonpCallback;
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/main.js": function (module, exports, __webpack_require__) {
    __webpack_require__
      .e("c")
      .then(__webpack_require__.bind(null, "./src/c.js"))
      .then((c) => {
        console.log(c);
      });
  },
});
```