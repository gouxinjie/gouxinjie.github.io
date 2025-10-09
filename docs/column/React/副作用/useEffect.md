# useEffect：常用副作用 Hook

[[toc]]

## 一，useEffect 描述

> 我们知道，react 的函数组件里面没有生命周期的，也没有 state，没有 state 可以用 `useState` 来替代，那么生命周期呢？

`useEffect` 是 `react v16.8` 新引入的特性。我们可以把 useEffect hook 看作是:
`componentDidMount`、`componentDidUpdate`、`componentWillUnmount` 三个生命周期的组合。
可以让你在函数式组件中执行一些副作用操作；

::: tip 一般副作用操作有

1、发送 ajax 请求  
2、设置订阅 / 启动定时器  
3、手动更改真实 DOM

:::

## 二，它的执行时机

可以看做这三个生命周期函数的组合，也就是在这三个时候会执行

`componentDidMount`（组件已经挂载）<br/> `componentDidUpdate`（组件已经更新）<br/> `componentWillUnmount`（组件即将卸载）<br/>

## 三，useEffect 分情况使用

`useEffect()`有两个参数：
第一个参数是要执行的回调函数，第二个参数是一个依赖项数组数组(根据需求第二个参数可选是否填写)，根据数组里的变量是否变化决定是否执行函数；

先看下面简单的案例 ，下面会分情况讨论：

useEffect.js

```javascript
import React, { useState, useEffect, useRef } from "react";

// 类型约定
interface interList {
  id: number | string; // 类型可能是number也可能是string
  text: string;
  done: boolean;
}
// 渲染数据
const myList: Array<interList> = [
  { id: 0, text: "参观卡夫卡博物馆", done: true },
  { id: 1, text: "看木偶戏", done: true },
  { id: 2, text: "打卡列侬墙", done: true }
];

const UseEffect: React.FC = (props: any) => {
  let [num, setNum] = useState(100);
  let [useInfo, SetUserInfo] = useState(myList);

  // 0，什么都不传 就是监听所有数据的变化
  useEffect(() => {
    console.log("我改变了-all");
  });

  // 1，此处相当于 componentDidUpdate生命周期 组件已经更新完成
  useEffect(() => {
    console.log("我改变了");
  }, [num]); // 只监听num的变化,useInfo的变化不会被监听到

  // 2，此处相当于componentDidMount生命周期 组件已经挂载完成
  useEffect(() => {
    console.log("componentDidMount");
    console.log("可以拿到num的值：", num);
  }, []);

  // 3，此处相当于 componentWillUnmount生命周期 组件即将卸载
  useEffect(() => {
    // 返回一个回调函数
    return () => {
      console.log("组件将要卸载了");
    };
  }, []);

  // 其实传不传空数组或不是空数组，useEffect函数里面的回调都会执行一次，也就是说componentWillUnmount这个生命周期页面进来就会执行
  // useEffect 这个hoosk也是可以写多个的，尽量不同的处理写在不同useEffect里面

  // 点击改变用户信息
  const change = () => {
    // react 建议不要更改原数组 返回一个数组的拷贝
    const newList = [...useInfo, { id: 3, text: "优菈", done: false }];
    SetUserInfo(newList);
  };

  // 点击加一
  const add = () => {
    setNum(++num);
  };

  const lis = useInfo.map((item, index) => {
    return (
      <li key={index}>
        {index}:{item.text}
      </li>
    );
  });

  return (
    <>
      <div>
        <h3>userEffect 副作用hooks函数</h3>
        <br />
        <button onClick={add}>点击加一</button>
        <p>{num}</p>
        <br />
        <button onClick={change}>改变用户信息</button>
        <ul>{lis}</ul>
      </div>
    </>
  );
};
export default UseEffect;
```

效果图： ![在这里插入图片描述](../images/useEffect.png)

上面代码实现的效果很简单，两个按钮分别改变各自数据的状态，状态的改变会触发 `useEffec`t 函数的执行，第二个参数的传参影响着此函数的变化，所以下面进行分情况讨论：

### 3.1 不写第二个参数 说明监测所有 state，其中一个变化就会触发此函数

若不写第二个参数，state 状态的每一次变动都会执行 `useEffect(method)`；监测所有 state，
相当于 `componentDidUpdate`生命周期 - 组件已经更新完成。

```javascript
import { useEffect } from "react";
useEffect(() => {
  console.log("我改变了-all");
});
```

### 3.2 第二个参数如果是`[]`空数组，说明谁也不监测

第二个参数如果是`[]`空数组，说明谁也不监测，此时`useEffect回调函数`的作用就
相当于 `componentDidMount`生命周期 - 组件已经挂载完成；
此时只会在组件挂载完成时执行一次，不会在组件更新时执行。

```javascript
// 2，此处相当于componentDidMount生命周期 组件已经挂载完成
useEffect(() => {
  console.log("componentDidMount");
  console.log("可以拿到num的值：", num);
}, []);
```

### 3.3 第二个参数如果只传需要监测的 state，那只会根据此状态来执行函数

如果第二个参数中的数组只传了 `num` ，说明只有 `num`改变时，才会触发此`useEffect`回调函数。

```javascript
// 1，此处相当于 componentDidUpdate生命周期 组件已经更新完成
useEffect(() => {
  console.log("num改变了");
}, [num]); // 只监听num的变化
```

当然数组里面也可以写多个（`[num,userInfo]`），同时监听多个数据的变化。

### 3.4 useEffect 里面 return 一个回调函数，相当于组件即将卸载的声明周期

这句话什么意思呢？通常，组件是有卸载的生命周期的，使用`useEffect 函数`只需在里面 return 一个回调函数，这个回调函数就  
**相当于**`componentWillUnmount` 声明周期，可以在里面清除创建的订阅或计时器 ID 等资源。

```javascript
// 3，此处相当于 componentWillUnmount生命周期 组件即将卸载
useEffect(() => {
  // 返回一个回调函数
  return () => {
    console.log("组件将要卸载了");
  };
}, []);
```

这里传了空数组说明我不想监听数据的变化，只想在卸载组件的时候执行该逻辑；

### 3.5 注意

其实第二个传不传空数组或不是空数组，useEffect 函数里面的回调都会执行一次，也就是说页面进来就会自动执行`componentWillUnmount`这个生命周期；

`useEffect函数` 这个 hoosk 也是可以写多个的，尽量不同的业务处理写在不同 useEffect 里面；
