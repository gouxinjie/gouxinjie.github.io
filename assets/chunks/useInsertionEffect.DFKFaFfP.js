const n=`
# useInsertionEffect：样式注入 Hook

[[toc]]

\`useInsertionEffect\` 是 React 18 引入的一个非常特殊且底层的 Hook。

一句话概括它的定位：**它是专门为 CSS-in-JS 库（如 Emotion、Styled-components）作者设计的，普通业务层代码几乎永远不需要用到它。**

它的核心使命是：**在 React 修改 DOM 之前插入 \`<style>\` 样式标签，从而规避重排（Layout Thrashing）与性能损耗。**


## 一、 执行时机：副作用 Hook 的“三连招”

为了理解 \`useInsertionEffect\`，我们需要把它和 \`useLayoutEffect\` 以及 \`useEffect\` 放在同一个渲染生命周期链条中对比：

\`\`\`text
React 触发 Render (计算 Fiber 树)
       │
       ▼
⚡️ 【useInsertionEffect 执行】
   └─▶ (DOM 尚未被修改！专门用于向 <head> 中插入 <style> 规则)
       │
       ▼
React 正式修改真实 DOM (DOM Mutation)
       │
       ▼
⚡️ 【useLayoutEffect 执行】
   └─▶ (DOM 已修改，但屏幕尚未 Paint！常用于读取 DOM 布局信息如 getBoundingClientRect)
       │
       ▼
浏览器进行重排与绘制 (Reflow & Paint) ──▶ 💻 用户看到页面
       │
       ▼
🐢 【useEffect 执行】
   └─▶ (屏幕绘制完成后异步执行，处理常规副作用)

\`\`\`

## 二、 为什么需要它？（CSS-in-JS 的性能痛点）

在 React 18 之前，主流的 CSS-in-JS 库通常在组件渲染时或在 \`useLayoutEffect\` 中动态将生成的 CSS 规则插入到 \`<head>\` 中。

这会导致一个非常严重的性能问题——**布局抖动 / 强制重排（Layout Thrashing）**：

1. **旧做法的困境**：
* 组件挂载，触发 \`useLayoutEffect\`。
* 在 \`useLayoutEffect\` 里，某个逻辑试图读取 DOM 尺寸（例如 \`element.getBoundingClientRect()\`）。
* 紧接着，CSS-in-JS 库在 \`useLayoutEffect\` 里向文档插入了新的 \`<style>\` 标签。
* 插入 \`<style>\` 会**导致浏览器此前计算的所有样式失效（Style Invalidation）**。
* 当下一个组件再次读取 DOM 尺寸时，浏览器被迫**立即重新计算整个页面的布局（Recalculate Style）**，导致严重掉帧。


2. **\`useInsertionEffect\` 的解法**：
* 将所有的 \`<style>\` 标签插入操作**提前到 React 修改真实 DOM 之前**（即 \`useInsertionEffect\` 阶段）。
* 当后续的 \`useLayoutEffect\` 开始读取 DOM 布局信息时，所有的 CSS 规则早已解析完成，浏览器不需要进行重复的样式重新计算！

## 三、 API 语法与使用示例

\`useInsertionEffect\` 的语法与 \`useEffect\` 完全相同：

\`\`\`tsx
useInsertionEffect(() => {
  // 插入 CSS 规则的代码
  return () => {
    // 清理逻辑
  };
}, [deps]);

\`\`\`

### 模拟 CSS-in-JS 库的简易实现：

\`\`\`tsx
import { useInsertionEffect } from 'react';

// 模拟动态生成并插入 CSS 的自定义 Hook
function useCSS(rule: string) {
  useInsertionEffect(() => {
    // 1. 创建 <style> 标签
    const styleTag = document.createElement('style');
    styleTag.innerHTML = rule;

    // 2. 在 DOM 被 React 变更前插入到 <head> 中
    document.head.appendChild(styleTag);

    // 3. 卸载时清理
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [rule]);
}

// 库使用者调用
function Button() {
  const className = "btn-primary";
  useCSS(\`.\${className} { background-color: blue; color: white; }\`);

  return <button className={className}>点击按钮</button>;
}

\`\`\`


## 四、 严格的使用限制（踩坑点）

为了保证渲染架构的稳定性，React 对 \`useInsertionEffect\` 施加了非常严格的限制：

1. **无法获取 \`ref.current\`（DOM 引用）**：
* 在 \`useInsertionEffect\` 执行时，React **还没有修改真实 DOM**。因此你无法在里面访问任何 DOM 节点的尺寸或属性。


2. **不允许发起状态更新（禁止调用 \`setState\`）**：
* 在 \`useInsertionEffect\` 内部调用 \`setState\` 会触发 React 警告，甚至在严格模式下导致未定义行为。


3. **不能访问 \`Context\` 的最新更新**（在某些边缘并发渲染场景下）。


## 五、 三大 Effect Hook 深度汇总对比

| 维度 | \`useInsertionEffect\` | \`useLayoutEffect\` | \`useEffect\` |
| --- | --- | --- | --- |
| **执行时机** | DOM 修改**前**（同步） | DOM 修改**后**、Paint **前**（同步） | Paint **后**（异步） |
| **访问 DOM Ref** | ❌ 绝不可能 | ✅ 可以（测量/修改 DOM） | ✅ 可以 |
| **调用 setState** | ❌ 严格禁止 | ✅ 支持（合并更新，防闪烁） | ✅ 支持 |
| **对 Paint 的影响** | 会阻塞 | 会阻塞 | **不阻塞** |
| **唯一核心用途** | 动态插入 CSS \`<style>\` | 测量 DOM 尺寸、防止 UI 闪烁 | 数据请求、事件订阅、计时器等 |
| **使用者定位** | CSS-in-JS 库开发者 | 业务开发者（少数 DOM 测量场景） | 业务开发者（99% 的场景） |


## 六、 总结

* 如果你正在**开发一个 CSS-in-JS 样式库**：请将样式注入逻辑从 \`useLayoutEffect\` 迁移至 \`useInsertionEffect\`，以获得更好的 React 18 并发渲染性能。
* 如果你正在**编写日常业务组件**：直接忽略 \`useInsertionEffect\`，继续使用 \`useEffect\`（或在需要防闪烁测量时使用 \`useLayoutEffect\`）即可。
`;export{n as default};
