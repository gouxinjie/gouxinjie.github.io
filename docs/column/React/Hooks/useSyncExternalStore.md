# useSyncExternalStore： 同步外部状态 Hook

[[toc]]

> React 18 带来了很多新的特性，其中 `useSyncExternalStore` 是一个被很多人忽视但非常重要的 Hook。它为 **React 与外部数据源的同步** 提供了官方、稳定且高性能的解决方案。

## 一、为什么需要 useSyncExternalStore？

在 React 中，组件的状态通常由 React 自身管理（如 `useState`、`useReducer`）。但在实际项目中，我们经常需要与 **外部状态源** 同步，比如：

- Redux、Zustand、Recoil 等状态管理库
- 浏览器 `window` 对象（如 `window.innerWidth`）
- WebSocket 或全局数据中心
- 原生事件订阅（如滚动、鼠标事件等）

以前我们可能会这样做 👇

```jsx
// ❌ 旧写法（可能引发问题）
useEffect(() => {
  store.subscribe(() => {
    setState(store.getState());
  });
}, []);
```

这种方式存在两个问题：

1. **Concurrent Mode 不安全**：在并发渲染下可能导致数据不同步。
2. **难以避免闪烁或中断**：React 无法感知外部数据变化的“快照”。

于是，React 官方引入了 `useSyncExternalStore` —— 它让 React 能**可靠地订阅外部数据源**，并确保渲染时数据一致。

## 二、useSyncExternalStore 的语法

```tsx
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);
```

**参数说明：**

| 参数                | 类型                                   | 作用                                             |
| ------------------- | -------------------------------------- | ------------------------------------------------ |
| `subscribe`         | `(listener: () => void) => () => void` | 用于订阅外部 store，当 store 变化时调用 listener |
| `getSnapshot`       | `() => any`                            | 返回当前的外部状态快照                           |
| `getServerSnapshot` | `() => any` _(可选)_                   | 用于 SSR（服务器端渲染）时获取快照               |

**返回值**：

返回当前的 **快照数据（snapshot）**，即当前状态。

## 三、简单示例：订阅全局状态

假设我们有一个全局 store，用最简单的方式实现：

```jsx
// store.js
let state = { count: 0 };
let listeners = new Set();

export const store = {
  getSnapshot: () => state,
  setState: (newState) => {
    state = { ...state, ...newState };
    listeners.forEach((l) => l());
  },
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
```

然后在组件中使用：

```jsx
import React, { useSyncExternalStore } from "react";
import { store } from "./store";

function Counter() {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);

  return (
    <div>
      <h2>Count: {snapshot.count}</h2>
      <button onClick={() => store.setState({ count: snapshot.count + 1 })}>+1</button>
    </div>
  );
}
```

✅ 优点：

- 无需手动 setState
- React 自动在外部数据更新时重新渲染
- 支持并发模式，渲染时数据始终一致

## 四、在 Redux / Zustand 中的应用

许多状态管理库在 React 18 之后都更新为内部使用 `useSyncExternalStore`。

例如，Zustand 源码片段中就有这样的实现：

```js
const useStore = (selector) => {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
};
```

这让状态管理库在 React 18+ 的 **Concurrent Rendering** 模式下更加安全。

## 五、SSR（服务器端渲染）场景

`useSyncExternalStore` 的第三个参数 `getServerSnapshot` 专门用于 SSR 场景（Next.js、Remix 等）。

当在服务器上渲染时，React 会调用 `getServerSnapshot` 获取初始数据，防止**客户端水合（Hydration）不匹配**。

```jsx
const data = useSyncExternalStore(
  subscribe,
  getSnapshot,
  () => initialServerData // SSR 时调用
);
```

## 六、与 useEffect 的区别

| 特性             | useEffect + setState | useSyncExternalStore |
| ---------------- | -------------------- | -------------------- |
| 响应外部状态变化 | ✅ 可以              | ✅ 可以              |
| 并发渲染安全     | ❌ 否                | ✅ 是                |
| 直接读取最新快照 | ❌ 有延迟            | ✅ 实时              |
| SSR 支持         | ❌ 不支持            | ✅ 支持              |

## 七、实战案例：监听浏览器宽度

我们还可以用它订阅 **浏览器窗口宽度**：

```jsx
function subscribe(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth;
}

export default function WindowWidth() {
  const width = useSyncExternalStore(subscribe, getSnapshot);
  return <div>当前窗口宽度：{width}px</div>;
}
```

✅ 优点：

- 自动刷新
- 没有异步延迟
- Concurrent Mode 安全

## 八、最佳实践总结

| 建议                                             | 说明                                 |
| ------------------------------------------------ | ------------------------------------ |
| ✅ 在任何外部数据源中使用 `useSyncExternalStore` | 包括全局状态、事件监听、WebSocket 等 |
| ✅ 保持 `getSnapshot` 纯净                       | 不能有副作用，只返回快照             |
| ❌ 不要在 `subscribe` 里直接修改状态             | 应通过 listener 通知 React           |
| ✅ 对 SSR 提供 `getServerSnapshot`               | 保证首屏一致性                       |
