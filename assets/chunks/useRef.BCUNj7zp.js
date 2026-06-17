const n=`# useRef：不仅仅是获取 DOM

[[toc]]

> 大多数人第一次接触 \`useRef\` 时，只知道它“可以操作 DOM”。  
> 但其实，它更像是一个“可以在组件生命周期中保持不变的盒子”。
>
> \`useRef\` = **可变引用** + **不触发重新渲染**。

## 一、什么是 useRef？

### 📘 基本定义：

\`\`\`tsx
const ref = useRef(initialValue);
\`\`\`

\`useRef\` 返回一个 **ref 对象**，它具有唯一的属性：

\`\`\`tsx
ref.current; // 保存的值
\`\`\`

> 与普通变量不同的是：
>
> - \`ref.current\` 在组件的整个生命周期中**保持同一个引用**；
> - 改变它不会触发组件重新渲染；
> - 它可以保存任何数据：DOM 节点、数值、对象、函数……

## 二、最常见用法：获取 DOM 元素

这是 \`useRef\` 最直观的用途。

\`\`\`jsx
import React, { useRef, useEffect } from "react";

function InputFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 挂载后自动聚焦
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="自动聚焦输入框" />;
}

export default InputFocus;
\`\`\`

✅ 执行流程：

1. React 渲染时将 DOM 节点赋值给 \`inputRef.current\`
2. 在 \`useEffect\` 中可以直接访问这个真实 DOM
3. 可用来调用 DOM API（如 \`.focus()\`、\`.scrollIntoView()\`）

## 三、第二个强大用法：保存可变值（不触发渲染）

\`useRef\` 还能存储**在组件更新之间持久存在**的变量。这与普通变量不同，因为普通变量在每次渲染时都会重新创建。

\`\`\`jsx
import React, { useState, useRef } from "react";

function Timer() {
  const [count, setCount] = useState(0);
  const timerRef = useRef(null); // 保存定时器 ID

  const start = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setCount((c) => c + 1), 1000);
    }
  };

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return (
    <div>
      <h2>计数：{count}</h2>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}

export default Timer;
\`\`\`

💡 **为什么不用 useState？**

- \`useState\` 的更新会导致组件重新渲染；
- \`useRef\` 的更新不会触发渲染；
- 因此，\`useRef\` 更适合存储“非 UI 状态”的值。

## 四、第三个用法：跨渲染周期保存前一个值（“前值”技巧）

\`\`\`jsx
import React, { useState, useEffect, useRef } from "react";

function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(count); // 保存上一次的 count 值

  useEffect(() => {
    prevCount.current = count; // 每次更新后同步
  }, [count]);

  return (
    <div>
      <h2>当前：{count}</h2>
      <h3>上一次：{prevCount.current}</h3>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

export default PreviousValue;
\`\`\`

✅ 使用场景：

- 对比前后状态（如动画差值、滚动距离等）
- 实现“上次输入值”“上次点击时间”等逻辑

## 五、useRef 与 useState 的区别

| 特性                 | useState       | useRef                     |
| -------------------- | -------------- | -------------------------- |
| 值变化是否触发重渲染 | ✅ 是          | ❌ 否                      |
| 是否在渲染间保持值   | ✅ 是          | ✅ 是                      |
| 是否可直接绑定到 DOM | ❌ 否          | ✅ 是（\`ref\` 属性）        |
| 使用场景             | 影响 UI 的状态 | 不影响 UI 的数据、DOM 操作 |
| 更新方式             | \`setState\`     | 直接修改 \`ref.current\`     |

👉 总结一句话：

> - **\`useState\`**：管理“显示出来的状态”
> - **\`useRef\`**：管理“幕后状态”

## 六、四个典型的 useRef 实战场景

### 1️⃣ 保存定时器 ID

\`\`\`js
const timerRef = useRef();
\`\`\`

防止重复创建、避免内存泄漏。

### 2️⃣ 保存上一次的 props 或 state

\`\`\`js
const prevProps = useRef(props);
\`\`\`

实现对比变化。

### 3️⃣ 控制动画或视频播放

\`\`\`js
videoRef.current.play();
\`\`\`

直接访问真实 DOM 元素。

### 4️⃣ 避免闭包陷阱（保存最新回调）

\`\`\`jsx
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback; // 保存最新回调
  });

  useEffect(() => {
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
\`\`\`

💡 **为什么要这样写？** 因为 React 的函数组件每次渲染都会创建新的闭包。如果直接使用旧回调，会导致访问到“过期”的变量。

## 七、useRef 的工作原理

React 内部维护了一个对象：

\`\`\`js
{
  current: <initialValue>
}
\`\`\`

这个对象在组件整个生命周期中都不会变。

- 当组件重新渲染时，\`ref.current\` 仍然保持之前的引用；
- 当你修改 \`ref.current\` 时，不会触发新的渲染；
- React 在 \`ref\` 属性绑定的 DOM 元素创建或销毁时自动更新它。

## 八、使用陷阱与注意事项

| ⚠️ 常见误区                          | 原因                                   |
| ------------------------------------ | -------------------------------------- |
| ❌ 修改 \`ref.current\` 后希望触发渲染 | 不会触发 UI 更新                       |
| ❌ 在服务端渲染（SSR）访问 DOM       | \`ref.current\` 为 \`null\`                |
| ❌ 在 render 阶段访问 \`ref.current\`  | 此时还未绑定                           |
| ✅ 正确访问时机                      | 在 \`useEffect\` 或 \`useLayoutEffect\` 中 |

## 九、结合 forwardRef 实现组件透传

\`useRef\` 还能配合 \`forwardRef\`，实现“父组件操作子组件的 DOM”。

\`\`\`jsx
import React, { useRef, forwardRef, useImperativeHandle } from "react";

const ChildInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus()
  }));

  return <input ref={inputRef} placeholder="子组件输入框" />;
});

export default function Parent() {
  const childRef = useRef();

  return (
    <div>
      <ChildInput ref={childRef} />
      <button onClick={() => childRef.current.focus()}>让子组件聚焦</button>
    </div>
  );
}
\`\`\`

✅ 这在封装组件库时非常常见，例如自定义输入框、模态框等。

## 总结

| 用途            | 描述                  |
| --------------- | --------------------- |
| 访问 DOM        | 直接获取真实 DOM 元素 |
| 保存可变数据    | 不触发渲染的持久变量  |
| 保存上一次值    | 实现对比逻辑          |
| 保存回调函数    | 解决闭包陷阱          |
| 结合 forwardRef | 实现组件透传          |
`;export{n as default};
