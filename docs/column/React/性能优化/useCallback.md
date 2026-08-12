

# useCallback 的语法与底层原理

`useCallback` 是 React 中专门用来 **缓存函数引用地址（Memory Reference）** 的性能优化 Hook。

如果在上一步理解了 `useMemo` 与 `React.memo`，那么理解 `useCallback` 会非常轻松——**`useCallback` 本质上就是 `useMemo` 在处理“函数类型”时的专用语法糖**。


## 一、 为什么需要 `useCallback`？（函数的引用难题）

在 JavaScript 中，**函数是第一类对象（First-Class Object）**。

当组件重新渲染（Re-render）时，定义在函数组件内部的所有函数，都会在内存中被 **重新创建一次**，并分配一个新的指针地址：

```js
// 哪怕函数体一模一样，两次渲染生成的函数引用地址也不相等！
(() => {}) === (() => {}) // 结果为 false

```

这种“重新创建”在 99% 的情况下对性能没有任何影响。**真正引发性能问题的，是函数引用变化所带来的连锁反应：**

1. **导致子组件 `React.memo` 优化失效**：将内联函数作为 prop 传给用 `React.memo` 包裹的子组件，子组件会误以为 prop 发生了改变，从而引发无谓的重绘。
2. **导致 `useEffect` 被无故重复触发**：如果一个函数被放入了 `useEffect` 的依赖项数组 `[deps]`，函数引用的变动会导致 Effect 频繁刷新。


## 二、 语法与 `useMemo` 的等价关系

### 1. 基本语法

```tsx
const memoizedCallback = useCallback(() => {
  // 执行具体的业务逻辑
  doSomething(a, b);
}, [a, b]); // 依赖项数组

```

* **返回**：缓存的函数引用。
* **规则**：只有当依赖项 `[a, b]` 发生变化时，`useCallback` 才会更新并返回一个新的函数引用；否则，在多次渲染之间它将 **始终返回上一次缓存的那个同一个函数指针**。

### 2. 与 `useMemo` 的底层关系

`useCallback(fn, deps)` 仅仅是 `useMemo(() => fn, deps)` 的简写形式：

```tsx
// 以下两行代码在 React 底层完全等价：
const handleClick = useCallback(() => console.log('hello'), []);
const handleClick = useMemo(() => () => console.log('hello'), []);

```


## 三、 两大核心使用场景

### 场景 1：配合 `React.memo` 防止子组件无效 Re-render

这是 `useCallback` **最主流、最核心** 的应用场景。

```tsx
import React, { useState, useCallback } from 'react';

// 1. 使用 React.memo 优化的昂贵子组件
const HeavyButton = React.memo(({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  console.log(`子组件 [${children}] 重新渲染了！`);
  return <button onClick={onClick}>{children}</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ 未使用 useCallback：每次 Parent 重新渲染（例如输入文本），
  // handleReset 都会生成新引用，导致 HeavyButton 的 React.memo 完全失效并重绘！
  // const handleReset = () => setCount(0);

  // ✅ 使用 useCallback 包裹：维持 handleReset 函数的内存地址稳定
  const handleReset = useCallback(() => {
    setCount(0);
  }, []); // 依赖项为空，函数指针在全生命周期内不变

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入文本触发 Parent 渲染..." />
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>加 1</button>

      {/* 传给被 React.memo 包裹的子组件 */}
      <HeavyButton onClick={handleReset}>重置计数</HeavyButton>
    </div>
  );
}

```


### 场景 2：避免 `useEffect` / 自定义 Hook 频繁重复执行

当你需要将一个外部函数作为 `useEffect` 或 `useCallback` 的依赖项时，使用 `useCallback` 能够保持依赖的稳定性：

```tsx
function SearchComponent({ fetchParams }: { fetchParams: () => object }) {
  // 保持 fetchData 函数引用的稳定
  const fetchData = useCallback(async () => {
    const params = fetchParams();
    const data = await api.getSearchData(params);
    console.log(data);
  }, [fetchParams]);

  useEffect(() => {
    fetchData(); // 只有当 fetchData 引用变化时才触发
  }, [fetchData]);

  return <div>...</div>;
}

```


## 四、 避坑指南与“闭包陷阱”

### 1. 闭包陷阱（Stale Closures）

使用 `useCallback` 时，如果漏写了依赖项，回调函数内部捕获的就是**旧渲染周期中的变量状态**：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ 错误：漏掉了 count 依赖项！
  // 这个函数内部永恒地捕获了初次渲染时 count = 0 的快照
  const handleLog = useCallback(() => {
    console.log("当前 Count 为：", count);
  }, []); // 依赖项为空

  // 即使 count 变成了 10，调用 handleLog 依然打印 0！
}

```

#### 💡 如何在移除依赖项的同时规避闭包陷阱？—— 使用“函数式更新”

如果 `useCallback` 内部仅仅是需要根据旧状态计算新状态，**优先使用 state 的函数式更新**，这样可以彻底清空依赖项：

```tsx
// ✅ 优雅做法：无需将 count 写入依赖项，函数引用保持绝对稳定
const handleIncrement = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

```


## 五、 常见的反模式：什么时候**不要**用 `useCallback`？

很多初学者容易走进一个误区：“为了性能好，把组件里所有的函数都用 `useCallback` 包包裹起来。”

**这是完全错误的！**

### ❌ 误区：直接给普通原生 DOM 元素绑定的回调加 `useCallback`

```tsx
function BadExample() {
  const [value, setValue] = useState('');

  // ❌ 完全无用的滥用！
  // <input> 是原生 HTML 标签，根本不会参与 React.memo 比较。
  // 加上 useCallback 反而增加了额外的 JS 执行开销和依赖项对比成本！
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return <input value={value} onChange={handleChange} />;
}

```

> **记住一个核心原理**：
> `useCallback` **并不能** 阻止 JS 在渲染时重新定义函数代码（回调函数作为参数依然每次都被解析了），它只是**决定是否丢弃新定义的函数而返回旧的引用**。
> 如果没有 `React.memo` 子组件配合接收这个函数，`useCallback` 就没有任何阻断 Re-render 的效果，纯粹是白白浪费 CPU 算力和内存。


## 六、 总结与决策树

```text
是否需要使用 useCallback？
  │
  ├── 1. 该函数是否作为 prop 传给被 React.memo 包裹的子组件？
  │      └── 是 ──▶ 【使用 useCallback】
  │
  ├── 2. 该函数是否作为 useEffect / useMemo / 其它 useCallback 的依赖项？
  │      └── 是 ──▶ 【使用 useCallback】
  │
  └── 3. 其它场景（例如直接绑定给 <button>、<input> 或传给普通子组件）
         └── 否 ──▶ ❌ 【直接写普通函数，不要用 useCallback】

```
