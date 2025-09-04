# useLayoutEffect

`useLayoutEffect` 是 React 中的一个 `Hook`，用于在浏览器重新绘制屏幕之前触发。与 `useEffect` 类似。

## 用法

```tsx
useLayoutEffect(() => {
  // 副作用代码
  return () => {
    // 清理代码
  };
}, [dependencies]);
```

**参数:** 

1、处理函数,可以返回一个清理函数。组件挂载时执行 setup,依赖项更新时先执行 cleanup 再执行 setup,组件卸载时执行 cleanup。

2、`dependencies(可选)`：setup 中使用到的响应式值列表(props、state 等)。必须以数组形式编写如[dep1, dep2]。不传则每次重渲染都执行 Effect。

**返回值:** `useLayoutEffect` 返回 `undefined`

## 区别(useLayoutEffect/useEffect)

| 区别     | useLayoutEffect                      | useEffect                            |
| :------- | :----------------------------------- | :----------------------------------- |
| 执行时机 | 浏览器完成布局和绘制`之前`执行副作用 | 浏览器完成布局和绘制`之后`执行副作用 |
| 执行方式 | 同步执行                             | 异步执行                             |
| DOM 渲染 | 阻塞 DOM 渲染                        | 不阻塞 DOM 渲染                      |

### 测试 DOM 阻塞

```js
"use client";
import React, { useLayoutEffect, useEffect, useState } from "react";
function App() {
  const [count, setCount] = useState(0);
  // 不阻塞DOM
  useEffect(() => {
    for (let i = 0; i < 50000; i++) {
      setCount((count) => count + 1);
    }
    console.warn("不阻塞DOM更新完成");
  }, []);
  //阻塞DOM
  //   useLayoutEffect(() => {
  //     for (let i = 0; i < 50000; i++) {
  //       //console.log(i);
  //       setCount((count) => count + 1);
  //     }
  //   }, []);
  return (
    <div>
      <h1>useLayoutEffect</h1>
      <h1>useLayoutEffect</h1>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{index}</div>
      ))}
    </div>
  );
}
export default App;
```

**不阻塞过程**<br/> 页面进来，视图立马显示 useLayoutEffect，然后浏览器等待 useEffect 里面计算完成之后，才显示出 1 ，2，3，4...<br/> useEffect 是不阻 DOM 绘制的，也就是说是异步执行的

**阻塞过程**<br/> 会阻塞浏览器绘制，稍等之后，useLayoutEffect 和 1 ，2，3，4 是一起显示出来的

### 应用场景

1、需要同步读取或更改 DOM：例如，你需要读取元素的大小或位置并在渲染前进行调整。<br/> 2、防止闪烁：在某些情况下，异步的 useEffect 可能会导致可见的布局跳动或闪烁。例如，动画的启动或某些可见的快速 DOM 更改。<br/> 3、如果你需要在组件渲染后立即调整滚动条的位置，`useLayoutEffect` 是一个合适的选择。它确保在 DOM 布局完成之前调整滚动条的位置，避免闪烁或布局抖动。

**案例**

可以记录滚动条位置，等用户返回这个页面时，滚动到之前记录的位置。增强用户体验。

```tsx
import React, { useLayoutEffect, useRef } from "react";

function App() {
  useLayoutEffect(() => {
    const list = document.getElementById("list") as HTMLUListElement;
    list.scrollTop = 900;
  }, []);

  return (
    <ul id="list" style={{ height: "500px", overflowY: "scroll" }}>
      {Array.from({ length: 500 }, (_, i) => (
        <li key={i}>Item {i + 1}</li>
      ))}
    </ul>
  );
}

export default App;
```

## react 更新过程

`React` 将更新过程分为两个阶段：

- **渲染阶段（Render Phase）**：计算虚拟 DOM 差异（纯 JS 操作）
- **提交阶段（Commit Phase）**：将变更应用到真实 DOM

`useEffect` 的执行发生在提交阶段**之后**，此时 DOM 已经完成更新。

**下面是更加细致的执行逻辑：**

1. 触发更新（setState 等）
2. 虚拟 DOM 对比（React 算法）
3. 同步更新真实 DOM（浏览器绘制前）
4. 执行 useLayoutEffect（同步）
5. 浏览器绘制屏幕
6. 执行 useEffect（异步）

这里的`异步`指的是执行时机：`useEffect` 回调被调度到事件循环的后续阶段执行，所以能够拿到最新的 dom
