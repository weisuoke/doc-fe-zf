# 珠峰 Flutter(听课版)

## 1. Dart入门

### 概述

- Dart是谷歌发布的一门开源编程语言
- Dart最初的目标是成为下一代web编程语言,取代javascript，但最终没能成功。
- Dart目前已可用于全平台开发
- Dart是一门面向对象的编程语言

##### 应用场景

- Web开发
- 跨平台移动应用开发(Flutter)
- 脚本或服务端开发

##### 版本

1.x是稳定版
 2.x是新版，2018年发布
 通过Dart 2，我们大大加强和简化了类型系统，清理了语法，并从头开始重建了大量开发人员工具链，使移动和Web开发更加愉快和高效。
 (以后用Dart2来进行开发)

##### 关于Flutter

1. 免费开源
2. 利用保持状态的热重载（Hot Reload）、全新的响应式框架、丰富的控件以及集成的开发工具这些特点进行快速开发。Flutter具有热重载（Hot Reload）功能，我们编写代码时可以实时更新我们的代码而不需要重启我们的应用，大大减少了编译时间，提高了效率。
3. 通过可组合的控件集合、丰富的动画库以及分层可扩展的架构来实现富有感染力的灵活界面设计。
4. 快速的2D渲染引擎：Flutter不依赖于原生平台，它有自己的Skia渲染引擎，通过这个可移植的 GPU 加速的渲染引擎以及高性能本地 ARM 代码运行时，达到跨设备跨平台的高质量用户体验（高帧率60bps）。
5. 效率高跨平台：使用一套代码同时开发Android和iOS。
6. 可扩展性很强：Flutter框架本身提供了丰富的Material Design和Cupertino(iOS-flavor)风格的控件，可自由扩展控件不受手机平台控件的限制。

##### 入门

- 数据类型
- 运算符
- 控制流
- 方法/函数

##### 第一个Dart程序

```dart
// main是固定写法，它是程序入口，运行dart文件默认执行main方法
void main(){
  print("hello dart!");
}
// 也可以用箭头方式简写
void main()=>print("hello dart!");
```

### 数据类型

##### 变量

1. 使用var来声明，有不同类型的值。
    `var a = 10; print(a);`
    注：一个变量不能重复声明

   > var 是泛型，不规定数据类型
   >
   > dynamic 指的是泛型
   >
   > 对数据类型进行自动识别
   >
   > 1. 你使用 var 的时候，如果你只声明不赋值，它所能够识别的数据类型是 dynamic
   > 2. 如果你声明加赋值，那么他会自动对赋值的数据进行数据类型的识别

2. 未初始化时，默认的值为null
    `var a; print(a); // null`

3. final 不能重复赋值
    `final b = 30;`

4. `??` 非空判断

```dart
var n = 5;
n ??= 20;    // 若n为空则赋值
print(n);

var a = "Dart";
var b = "Java";
var c = a??b;  // 前面的值不为空，取前者，前面值为空，取后者。
print(c);	
```

##### 常量

1. const声明常量

   > 声明和赋值同时进行，不能重新赋值，区别：const 定义的值一旦声明就不能修改，const 后面的值不能是运行后的结果
   >
   > flutter 中父子组件传递参数不能用 const 接受，我们用final

2. 使用const声明的必须是编译器的常量。
   注：final 赋值后可以再修改，const不能修改

   > 声明和赋值同时进行，不能重新赋值，区别：final 定义的值声明之后可以再修改，final 后面的值可以是运行后的结果

##### 数据类型

- 数值型 Number
- 字符串 String
- 布尔值 Boolean
- 列表 List
- 键值对 Map
- Runes、Symbols (不常用)

##### 数值

- num 分为整形 int, 浮点型 double, 二者都继承自num
- 运算符: `+ - * / ~/ %`
- 常用属性： isNaN、isEven、isOdd 等
- 常用方法： abs()、round()、floor()  // 绝对值，四舍五入、取整...

```dart
int b = 20;
b = 21.5;    // 不能赋值浮点数，会报错

double c = 10.5;
c = 10;    // 不会报错，但是会转化为浮点型数值 10.0

print(10/4);   // 输出2.5
print(10~/4);  // 多了个取整，输出2
```

##### 字符串

- 使用单引号，双引号创建
- 使用三个引号 或者 三个双引号 创建多行字符串
- 使用r创建原始raw字符串
- 插值表达式 ${ } 添加变量
- 运算符： `+、*、== 、[]`
- 字符串方法: replaceAll

```dart
  String str1 = 'hello1';   // 单引号或双引号
  String str2 = '''hello Dart! 
    This is beautiful world!''';    // 三个单引号 或者 三个双引号
  
  String str3 = "hello \n dart";    // 换行字符
  String str4 = r"hello \n dart";   //前面加个 r， 换行字符原样输出

  // 插值表达式，可以插入变量值
  int a = 1;
  int b = 2;
  print("a + b = ${a + b}");
  print("a$a");

  // 运算符： 字符串拼接、字符串重复、字符串比较、[index]通过索引取单个字符
  String str5 = "This is a language";
  print(str5 + " new");
  print(str5 * 3);
  print('This is a language' == str5);
  print(str5[1]);

  print(str5.replaceAll("s", "S"));
```

##### 布尔值

- bool 的结果是 true/false
- 与或非：&& || ！

##### List (数组)

- 创建List： `List list = [1, 2, 3, "hello", true];`
- 创建不可变的List `List list2 = const[1,2,3];`
- 创建固定类型的List `List list3 = [1, 2, 3]；`
- 构造创建： `List list4 = new List();`

```dart
List list = [1, 2, 3, "hello", true];

List list2 = const[1,2,3];
list2[0] = 5;   // 不能改变

List list3 = <int>[1, 2, 3];
list3[0] = 'a';   // 赋值不能改变类型

List list4 = new List();    // 输出 []
```

> 常用操作:
>
> [], length
>
> add(), insert() // insert 第一项是索引，第二项是 value
>
> remove(), clear()
>
> forEach()  // 遍历数组，参数是一个匿名函数
>
> indexOf(), lastIndexOf()...

##### Map (键值对)

- 创建 Map： `Map language = { "first": "dart", "second": "java" };`
- 创建不可变的 Map： `Map language = const { "first": "dart", "second": "java" };`
- 构造创建： `Map language = new Map();`

> Map 数据类型取值要用[]，不要用

```dart
  var lis = [7,8,9];
  Map map1 = { "first":"Dart", 1:true, true:"2", lis: 10};
  print(map1);

  print(map1["first"]);
  print(map1[1]);
  print(map1[true]);
  print(map1[lis]);
```

> 常用操作
>
> - [], length
> - isEmpty, isNotEmpty
> - keys, values
> - forEach()

```dart
Map map = {"first": "Dart", "second": "Java","third": "Python"};
print(map.keys);    // (first, second, third)
print(map.values); // (Dart, Java, Python)

map.forEach(f);
// main函数外侧定义函数
void f(key, value){
  print("key=$key,value=$value");
}
```

> - remove(key)
> - containsKey(key) // 是否包含属性名
> - containsValue(val) // 是否包含属性值

### 流程控制：选择结构、循环结构

- if判断 / 三元运算符
- for循环
- while, do while
- continue, break
- switch ... case
- break, continue

```dart
  // if 判断
  int score = 70;
  if(score >= 60){
    print("及格");
  }else{
    print("不及格");
  }
  
  // 三目运算符
  var age = 20;
  print(age>18 ? "成年":"未成年");

  // for 循环
  List list = ["a", "b", "c", "d"];
  for(int i=0; i<list.length; i++){
    print(list[i]);
  }

  // whie 和 do while
  int a = 5;
  while(a>0){
    print(a);
    a--;
  }

  int b = 5;
  do{
    print(b);
    b--;
  }while(b>0);

  // switch case
  String color = "blue";
  switch (color) {
    case "red":
      print("color is red");
      break;
    case "blue":
      print("color is blue");
      break;
    case "yellow":
      print("color is yellow");
      break;
    default:
      print("no color");
  }
```

### 函数

##### 方法定义方式以及特性

- 定义要求： 返回值类型 函数名 (){ 函数体...  return返回值 }
- main函数可以传参,类型为List，不过一般不传
- 方法也是对象，并且有具体类型Function
- 定义方式可以简化：**返回值类型、参数类型 都可以忽略，可以使用箭头语法**
- 方法都有返回值，如果没定义，默认返回 null

```dart
void main() {
  print(getPerson("Tom", 3));
  printPerson("Jerry", 3);
}

String getPerson(String name, int age){
  return "name=$name,age=$age";
}

// 返回值类型，参数类型，大括号都可以省略，可以改装成箭头语法
printPerson(name, age)=>print("name=$name,age=$age");
```

##### 参数传递

- 可选命名参数 { param1, param2... }
- 如果有具体参数和可选参数，可选参数声明必须在参数后面
- 参数可设置默认值

```dart
void main(){
  print(getPerson("Jack", age: 18));
  print(getPerson("Jack", sex: "boy"));  // 可选参数传递不按照位置，需要有key值
}

String getPerson (String name, {int age, String sex}){
  return "name=$name,age=$age,sex=$sex";
}
// 为参数设置默认值
String getPerson (String name, {int age=18, String sex="boy"}){
  return "name=$name,age=$age,sex=$sex";
}
```

##### 回调函数

```php
void main(){
  // 将系统函数 print 作为参数传递
  List list = ["a", "b", "c"];
  list.forEach(print);

  // print(strRepeat("dart"));

  List list2 = ["h", "e", "l", "l", "o"];
  print(listTimes(list2, strRepeat));
}

void printHello(){
  print("hello dart!");
}

String strRepeat(str)=> str*3;
String strRepeat2(str)=> str*4;

// 传递回调函数，依然可以为传递的回调函数返回值定义类型
List listTimes(List list, String fn(s)){
  for(var i=0; i<list.length; i++){
    list[i] = fn(list[i]);
  }
  return list;
}
```

##### 自执行函数

```dart
 void main(){
  String name = "Tom";

  int age = ((){
    int a = 1;
    int b = 2;
    return a+b;
  })();

  Function sex = (){
    return "boy";
  };

  print("name=$name,age=$age,sex=${sex()}");
}
```

##### 闭包

```swift
void main(){
  var func = a();
  func();
  func();
  func();
  func();
}

a(){
  int count = 0;
  return (){
    print(count++);
  };
}
```

##### dart中的类

- 文件 Person.dart

```dart
class Person{
  String name = "zf";
  int age = 10;
  Function sum = (a,b){
    return a+b;
  };
}
```

- 文件 test.dart

```dart
import "Person.dart";

void main(){
  var person = new Person();

  print(person.name);
  print(person.age);
  print(person.sum(10,20));
}
```

##### 类的重写