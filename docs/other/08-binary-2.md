# 08. 二进制

## 1.二进制

![frontbinary](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-07-11-072409.png)

## 2.ArrayBuffer

- [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)对象用来表示通用的、固定长度的原始二进制数据缓冲区
- 它是一个字节数组，通常在其他语言中称为`byte array`
- 你不能直接操作 `ArrayBuffer` 的内容，而是要通过类型数组对象或 `DataView` 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

![bytearray](http://img.zhufengpeixun.cn/bytearray.jpg)

```js
//创建一个长度为8个字节的buffer
const buffer = new ArrayBuffer(8);
console.log(buffer.byteLength);
```

## 3.TypedArray

[TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)对象描述了一个底层的二进制数据缓冲区(binary data buffer)的一个类数组视图(view)

- 但它本身不可以被实例化，甚至无法访问，你可以把它理解为接口,它有很多的实现

| 类型        | 单个元素值的范围 | 大小(bytes) | 描述                  |
| :---------- | :--------------- | :---------- | :-------------------- |
| Int8Array   | -128 to 127      | 1           | 8 位二进制有符号整数  |
| Uint8Array  | 0 to 255         | 1           | 8 位无符号整数        |
| Int16Array  | -32768 to 32767  | 2           | 16 位二进制有符号整数 |
| Uint16Array | 0 to 65535       | 2           | 16 位无符号整数       |

![TypedArray](http://img.zhufengpeixun.cn/TypedArray.jpg)

```js
const buffer = new ArrayBuffer(8);
console.log(buffer.byteLength);//8
const int8Array = new Int8Array(buffer);
console.log(int8Array.length);//8
const int16Array = new Int16Array(buffer);
console.log(int16Array.length);//4
```

## 4.DataView对象

- [DataView](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)视图是一个可以从 二进制ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序问题。
- `setInt8()`从DataView起始位置以byte为计数的指定偏移量(byteOffset)处储存一个8-bit数(一个字节)
- `getInt8()`从DataView起始位置以byte为计数的指定偏移量(byteOffset)处获取一个8-bit数(一个字节)

```js
new DataView(buffer [, byteOffset [, byteLength]])
const buffer = new ArrayBuffer(8);
console.log(buffer.byteLength);//8
const view1 = new DataView(buffer);
view1.setInt8(0, 4); 
console.log(view1.getInt8(0));

view1.setInt8(1, 8); 
console.log(view1.getInt8(1));
```

## 5.Blob

- [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

- [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob) 构造函数返回一个新的 Blob 对象。 blob的内容由参数数组中给出的值的串联组成。

- FileReader

   

  对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

  - `readerAsText()`：读取文本文件（可以使用txt打开的文件），返回文本字符串，默认编码是UTF-8
  - `readAsBinaryString()`：读取任意类型的文件，返回二进制字符串。这个方法不是用来读取文件展示给客户看，而是储存文件。例如：读取文件的内容，获取二进制数据，传递给后台，后台接收了数据之后，再将数据储存
  - `readAsDataURL()`：读取文件获取一段以data开头的字符串，这段字符串的本质就是DataURL，DataURL是一种将文件（这个文件一般是指图像或者能够嵌入到文档的文件格式）嵌入到文档的方案。DataURL是将资源转换为base64编码的字符串形式，并且将这些内容直接储存在url中 >> 优化网站的加载速度和执行效率

```js
let debug = { hello: "world" };
let str = JSON.stringify(debug);
console.log("str", str);
var blob = new Blob([str], { type: "application/json" });
console.log("blob.size", blob.size);

function readBlob(blob, type) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    switch (type) {
      case "ArrayBuffer":
        reader.readAsArrayBuffer(blob);
        break;
      case "DataURL":
        reader.readAsDataURL(blob);
        break;
      case "Text":
        reader.readAsText(blob);
        break;
      case "BinaryString":
        reader.readAsBinaryString(blob);
        break;
      default:
        break;
    }
  });
}
readBlob(blob, "ArrayBuffer").then((buffer) => {
  console.log("buffer", buffer);
});
readBlob(blob, "DataURL").then((base64String) => {
  console.log("base64String", base64String);
});
readBlob(blob, "Text").then((text) => {
  console.log("text", text);
});
readBlob(blob, "BinaryString").then((string) => {
  console.log("BinaryString", string);
});
```

## 6.Object URL

- 可以使用浏览器新的 API URL 对象通过方法生成一个地址来表示 Blob 数据
- [URL.createObjectURL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。

```html
<body>
    <button onclick="download()">下载json</button>
    <script>
     function download () {
        let debug = { hello: "world" };
        let str = JSON.stringify(debug);
        var blob = new Blob([str], { type: 'application/json' });
        let objectURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'hello.json';
        a.rel = 'noopener';
        a.href = objectURL;
        a.dispatchEvent(new MouseEvent('click'));
        URL.revokeObjectURL(objectURL);
     }
    </script>
</body>
```

## 7.合并音频

- [song](http://img.zhufengpeixun.cn/song.zip)

### 7.1 server.js

```js
let express = require('express');
let path = require('path');
let app = express();
app.use(express.static(path.join(__dirname,'public')));
app.listen(8080);
```

### 7.2 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>music</title>
</head>
<body>
<button  onclick="download()">合并下载</button>
<script>
    function getMusic(url){
        return new Promise(function(resolve,reject){
            let xhr = new XMLHttpRequest;
            xhr.open('GET',url,true);
            xhr.responseType = 'arraybuffer';
            xhr.onload= function(){
                resolve(xhr.response);
            }
            xhr.send();
        });
    }
    let player = document.getElementById('player');
    function download(){
        Promise.all([getMusic('/song1.mp3'),getMusic('/song2.mp3')]).then(function(responses){
            let buffer = mergeArrayBuffer(responses);
            var file = new File([buffer], 'all.mp3',{ type: 'audio/mp3' });
            let objectURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.download = '合并.mp3';
            a.rel = 'noopener';
            a.href = objectURL;
            a.dispatchEvent(new MouseEvent('click'));
        }); 
    }
    //arrays成员类型可以是 ArrayBuffer 或 TypeArray
    function mergeArrayBuffer(arrays) {
        let total = 0;
        for (let i = 0; i < arrays.length; i++) {
            arrays[i] = new Uint8Array(arrays[i]) //全部转成Uint8Array
            total += arrays[i].length;
        }
        let result = new Uint8Array(total);
        let offset = 0;
        for(let item of arrays) {
            result.set(item, offset);
            offset += item.length;
        }
        return result.buffer;
    }

</script>
</body>
</html>
```

### 7.3 上传预览

preview.html

```html
<body>
<input type="file" id="upload"/>
<img id="preview" width="200px" height="100px"/>
<script>
   let upload = document.getElementById('upload');
   let preview = document.getElementById('preview');
   upload.addEventListener('change',(event)=>{
       let file = event.target.files[0];
       let fileReader = new FileReader();
       fileReader.onload = function (event) {
         let base64Str = event.target.result;
         preview.src = base64Str;
       };
       fileReader.readAsDataURL(file);
   });
</script>
</body>
```