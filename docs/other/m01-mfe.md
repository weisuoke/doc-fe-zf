# 微前端听课笔记01

## 微前端在网盘的落地

> 微服务是什么？

微前端的核心思想就是拆，拆完了再合并。

## 目录

1. 什么是微前端 
2. 场景分析 
3. 灵感来源
4. 微内核架构 
5. 实现思路

![image-20200627113729916](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-033731.png)

![image-20200627140659034](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-060701.png)



> 应对变化
>
> 高内聚，低耦合

## 什么是微前端

1. 背景：

   前端应用越来越复杂

2. 导致

   - 人力成本压力
   - 维护成本高
   - 迭代成本高
   - 需求变更影响范围大 
   - 持续化投入产出比不足

3. 所以

   面对这种情况『其他人（后端）』是如何处理的？

4. 答案

   重新洗牌（先拆后合）

![image-20200627141159849](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-061201.png)

![image-20200627141226122](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-061228.png)

### 优点

1. 隔离（服务、IDE)

2. 弹性/扩展性((如:扩容）
3. 增强稳定性

4. 降低成本（人力、上线、回归、需求）
5. ...

### 注意事项

1. 测试
2. 部署
3. 服务拆分标准
4. 过于分散/密集

## “微前端” 场景分析

### 名词解释

微前端就是后端微服务思想在前端的映射

### 问题

微前端如何在浏览器中落地？

![image-20200627141648739](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-061650.png)

### 实现

#### iframe

缺点

- 结构元余（嵌套处理）

- 事件通讯繁琐
- 只能处理视图相关服务 
- 操作反馈复杂
- 其他更多的缺点

#### single-spa.js

缺点

- 只有 app 级别的隔离
- 没有统一的服务规范
- 使用了 system.js
- 对业务侵入性太强

#### 其他

目标

- 吸收 single-spa 的优点
- 改正 single-spa 的缺点



## “微前端”的灵感来源

![image-20200627142341251](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-062343.png)

## 『微前端』核心微内核架构

### 微内核架构

- Windows、macos 操作系统架构

### 组成部分 

1. 系统核心
2. 系统服务

3. 插件系统（可执行程序）

### 为什么选择它？

1. 服务间高度解耦 
2. 统一的插件标准 
3. 轻量级的事件机制 
4. 单一容器应用的最佳选择 
5. 对业务更低的侵入性 
6. 渐进式开发



![image-20200627142744083](https://wsk-mweb.oss-cn-hangzhou.aliyuncs.com/2020-06-27-062746.png)

