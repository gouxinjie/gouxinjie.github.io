# useCallback

## 介绍

`useCallback` 用于优化性能，返回一个记忆化的回调函数，可以减少不必要的重新渲染，也就是说它是用于缓存组件内的函数，避免函数的重复创建。

**为什么需要 useCallback** 在 `React` 中，函数组件的重新渲染会导致组件内的函数被重新创建，这可能会导致性能问题。`useCallback`通过缓存函数，可以减少不必要的重新渲染，提高性能。

**用法**

```tsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

## 使用

**场景**：父组件传递一个回调函数给子组件，如果父组件重新渲染，子组件会因为接收到新的回调函数而重新渲染（即使 `props` 没变）。

```tsx
import React, { useEffect, useState, memo } from "react";

interface ChildProps {
  onClick: () => void;
}

const Child = memo(({ onClick }: ChildProps) => {
  console.log("Child 渲染了！"); // 每次父组件渲染，这里都会打印
  useEffect(() => {
    console.log("Child useEffect 运行了！"); // 父组件每次渲染，这里都会打印
  });
  return <button onClick={onClick}>子组件的点击</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("点击了");
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加 Count</button>
      <div></div>
      <Child onClick={handleClick} />
    </div>
  );
}

export default Parent;
```

**在这个案例中:**<br/>

1、count 变化时，Parent 会重新渲染吗？<br/>
✅ 会，因为 count 是 Parent 的状态，状态变化会触发组件重新渲染。<br/>

2、 Child 也会重新渲染吗？<br/>
❌ 默认不会，因为 Child 用 React.memo 包裹了，它会浅比较 props。<br/>
但在这个例子中，Child 仍然会重新渲染，因为 handleClick 每次都是新的函数。<br/>

**解决方案如下：**

使用 useCallback 包裹handleClick函数，`这样子组件就不会每次重新创建了`<br/>
```tsx
 // ✅ 使用 useCallback 缓存函数，依赖数组为空表示不依赖任何变量 
 const handleClick = useCallback(() => {
   console.log("点击了");
 }, []);

```