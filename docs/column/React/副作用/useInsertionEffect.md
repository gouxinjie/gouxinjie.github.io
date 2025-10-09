
# useInsertionEffect：样式注入 Hook

[[toc]]
> React 18 除了带来 `useTransition`、`useDeferredValue` 等常用的并发特性外，  
> 还新增了一个专为 **样式注入（Style Insertion）** 设计的 Hook —— `useInsertionEffect`。  
>
> 它的主要作用是：**在 DOM 变更前执行副作用，保证样式优先插入**。


## 一、为什么需要 useInsertionEffect？

在 React 18 之前，CSS-in-JS 库（如 `emotion`、`styled-components`）
通常在 `useLayoutEffect` 或 `useEffect` 中插入样式。

然而，这会出现两个问题：

1. **样式闪烁（FOUC）**：组件渲染了，但样式还没插入。
2. **插入顺序错误**：多个样式更新时，后渲染的组件样式可能覆盖前面的。

React 18 为了解决这个问题，专门引入了 `useInsertionEffect` ——
它的执行时机比 `useLayoutEffect` 还要早！


## 二、useInsertionEffect 是什么？

### 📘 基本语法：

```tsx
useInsertionEffect(setup, dependencies?)
```

| 参数             | 类型          | 说明            |           |
| -------------- | ----------- | ------------- | --------- |
| `setup`        | `() => void | (() => void)` | 用于插入样式的函数 |
| `dependencies` | `any[]`     | 依赖数组，决定何时重新执行 |           |


## 三、执行时机对比图

| Hook                     | 执行时机                  | 用途              |
| ------------------------ | --------------------- | --------------- |
| `useEffect`              | 在浏览器完成绘制后             | 异步副作用，如请求数据     |
| `useLayoutEffect`        | 在 DOM 更新后、绘制前         | 同步 DOM 操作       |
| **`useInsertionEffect`** | **在 React 修改 DOM 之前** | **插入样式、确保样式优先** |

📊 **执行顺序（React 渲染阶段）**：

```
Render Phase
  ↓
useInsertionEffect ✅ (样式注入)
  ↓
DOM mutations (插入真实 DOM)
  ↓
useLayoutEffect
  ↓
Browser Paint (页面绘制)
  ↓
useEffect
```


## 四、实际例子：模拟 CSS-in-JS 注入

来看一个简化的例子：

```jsx
import React, { useInsertionEffect } from "react";

function useStyle(cssText) {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.textContent = cssText;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [cssText]);
}

function Box() {
  useStyle(`
    .box {
      background: #4f46e5;
      color: white;
      padding: 10px;
      border-radius: 8px;
    }
  `);

  return <div className="box">Hello useInsertionEffect</div>;
}

export default Box;
```

✅ 效果：

* 样式会在 DOM 创建之前注入；
* 页面渲染时不会出现闪烁；
* 样式插入顺序完全可控。


## 五、与 useLayoutEffect 的区别

| 特性        | useLayoutEffect | useInsertionEffect |
| --------- | --------------- | ------------------ |
| 执行时机      | DOM 更新后、绘制前     | **DOM 更新前**        |
| 是否可操作 DOM | ✅ 可以            | ❌ 不推荐（DOM 尚未生成）    |
| 用途        | 读取或修改布局         | 插入样式、生成 CSS        |
| 使用场景      | 动画、测量           | CSS-in-JS 样式注入     |

🚫 注意：
`useInsertionEffect` 不能操作 DOM（因为此时 DOM 还没生成），
它**只适合做“样式插入”类副作用**。


## 六、为什么 React 要单独为样式设计一个 Hook？

React 官方在 [RFC 提案](https://github.com/reactjs/rfcs/pull/221) 中解释：

> 为了支持“并发渲染”，必须在渲染阶段确保样式能与组件同步。
> 如果样式插入在 DOM 更新之后（例如在 `useLayoutEffect`），可能导致样式闪烁。

举个例子👇

```jsx
function App() {
  const [dark, setDark] = useState(false);
  return (
    <>
      <button onClick={() => setDark((d) => !d)}>切换主题</button>
      <ThemeBox dark={dark} />
    </>
  );
}

function ThemeBox({ dark }) {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.textContent = `.box { background: ${dark ? "#000" : "#fff"} }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [dark]);

  return <div className="box">Hello</div>;
}
```

当主题切换时，样式会在 DOM 更新前就注入，
**React 能保证新样式与新组件一同呈现，避免了闪烁。**


## 七、在框架中的实际应用

许多 CSS-in-JS 库都在内部使用了它：

| 库                     | 是否使用 useInsertionEffect | 用途                |
| --------------------- | ----------------------- | ----------------- |
| Emotion               | ✅ 是                     | 动态插入 `<style>` 标签 |
| Styled-components v6+ | ✅ 是                     | 确保 SSR 与样式顺序一致    |
| Jotai / Zustand       | ❌ 否                     | 状态管理库，不涉及样式       |
| Tailwind CSS          | ❌ 否                     | 使用编译时静态类名         |

💡 对于我们普通开发者，几乎不需要手动写它，
但理解它能帮你理解 CSS-in-JS 框架如何“无闪烁渲染样式”。
