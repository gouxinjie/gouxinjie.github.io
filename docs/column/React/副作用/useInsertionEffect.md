# 深入理解 React 的 useInsertionEffect Hook

## 什么是 useInsertionEffect？

`useInsertionEffect` 是 React 18 引入的一个相对较新的 Hook，主要用于解决 CSS-in-JS 库在服务器端渲染(SSR)时的样式注入问题。它是专门为库作者设计的一个底层 API，普通应用开发者通常不需要直接使用它。

```jsx
useInsertationEffect(() => {
  // 效果代码
});
```

## 为什么需要 useInsertionEffect？

在 CSS-in-JS 解决方案中，一个核心问题是如何高效地将样式注入到 DOM 中，特别是在服务器端渲染场景下：

1. **样式闪烁问题**：在 SSR 中，如果样式注入时机不当，可能导致页面初始渲染时出现无样式内容(FOUC)
2. **性能优化**：需要在浏览器开始绘制前完成样式注入
3. **执行时机**：需要比 `useLayoutEffect` 更早执行的效果

`useInsertionEffect` 就是为解决这些问题而设计的。

## 执行时机比较

理解 React Hooks 的执行时机非常重要：

| Hook                 | 执行时机                                            |
| -------------------- | --------------------------------------------------- |
| `useInsertionEffect` | DOM 变更后，浏览器绘制前，比 `useLayoutEffect` 更早 |
| `useLayoutEffect`    | DOM 变更后，浏览器绘制前                            |
| `useEffect`          | 浏览器绘制后                                        |

## 基本用法

```jsx
import { useInsertionEffect } from "react";

function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.textContent = rule;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  });
}

function MyComponent() {
  useCSS(`
    .my-class {
      color: red;
    }
  `);

  return <div className="my-class">Red Text</div>;
}
```

## 设计目的

React 团队创建 `useInsertionEffect` 主要是为了：

1. **为 CSS-in-JS 库提供标准解决方案**：让 styled-components、Emotion 等库有统一的处理方式
2. **避免 hydration 不匹配**：确保服务器和客户端渲染的样式一致
3. **性能优化**：在正确的时间点注入样式，避免不必要的重绘

## 实际应用场景

虽然大多数应用开发者不需要直接使用这个 Hook，但了解它的使用场景很有帮助：

1. **动态样式注入**：当组件需要动态插入全局样式时
2. **CSS-in-JS 库实现**：如实现自己的 styled 组件系统
3. **关键样式加载**：确保关键 CSS 在渲染前加载

## 注意事项

1. **不适用于大多数应用代码**：除非你在构建样式库，否则可能不需要它
2. **不能访问 refs**：与 `useLayoutEffect` 类似，此时 refs 尚未附加
3. **服务端渲染行为**：在 SSR 期间不会运行
4. **性能影响**：过度使用可能影响性能，因为它会阻塞渲染

## 与 useLayoutEffect 的区别

虽然两者都在浏览器绘制前执行，但关键区别在于：

1. **执行顺序**：`useInsertionEffect` → `useLayoutEffect`
2. **设计目的**：`useInsertionEffect` 专为样式注入优化
3. **使用场景**：`useLayoutEffect` 用于布局计算，`useInsertionEffect` 用于 DOM 插入操作

## 示例：简单的 CSS-in-JS 实现

下面是一个极简的 CSS-in-JS 实现，展示如何使用 `useInsertionEffect`：

```jsx
import { useInsertionEffect, useState } from "react";

function useStyled(css) {
  const [className] = useState(() => `_${Math.random().toString(36).substr(2, 9)}`);

  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.textContent = `.${className} { ${css} }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [className, css]);

  return className;
}

function Button() {
  const buttonClass = useStyled(`
    background: blue;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
  `);

  return <button className={buttonClass}>Styled Button</button>;
}
```

## 总结

`useInsertionEffect` 是 React 为库作者提供的一个专门工具，主要服务于 CSS-in-JS 库的实现需求。它的特点是：

- 执行时机非常早（在 `useLayoutEffect` 之前）
- 专为 DOM 插入操作优化
- 解决了 SSR 中的样式闪烁问题
- 大多数应用开发不需要直接使用
