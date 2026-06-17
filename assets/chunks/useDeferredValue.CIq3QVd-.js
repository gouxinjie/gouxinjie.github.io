const e=`# React 18 并发特性核心之一：useDeferredValue

[[toc]]

> React 18 引入的并发特性让 UI 渲染更丝滑，其中 \`useDeferredValue\` 是一个“**自动延迟某个值更新**”的 Hook，可以让你的组件在处理大量数据或复杂渲染时保持流畅的交互体验。

## 一、为什么需要 useDeferredValue？

在前端开发中，我们经常遇到这样的场景 👇

用户输入一个搜索框，输入的值会触发一个**昂贵的计算或过滤操作**：

\`\`\`jsx
function SearchApp() {
  const [query, setQuery] = useState("");
  const filteredList = heavyFilter(query); // 耗时操作

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <List data={filteredList} />
    </>
  );
}
\`\`\`

💥 问题：

- 每次用户输入都会立即触发计算；
- \`heavyFilter\` 造成卡顿；
- 输入变得不流畅。

## 二、useDeferredValue 是什么？

> \`useDeferredValue\` 会让一个值的更新“**延迟生效**”，从而避免耗时渲染阻塞用户的输入。

简单来说：

> 它是一个“被动的 useTransition”。

### 📘 语法：

\`\`\`tsx
const deferredValue = useDeferredValue(value);
\`\`\`

| 参数    | 类型 | 说明                 |
| ------- | ---- | -------------------- |
| \`value\` | any  | 原始值               |
| 返回值  | any  | React 延迟更新后的值 |

## 三、基础示例：输入防卡顿

\`\`\`jsx
import React, { useState, useDeferredValue } from "react";

function SearchApp() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // 延迟 query 更新

  const list = heavyFilter(deferredQuery);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {query !== deferredQuery && <p>加载中...</p>}
      <List data={list} />
    </div>
  );
}
\`\`\`

✅ 效果：

- 用户输入立即更新 \`query\`；
- \`deferredQuery\` 会稍微延迟；
- \`heavyFilter()\` 在浏览器空闲时执行；
- 输入不卡顿。

## 四、工作原理

\`useDeferredValue\` 的核心思想是：

> React 将传入的值视为“低优先级任务”，当浏览器空闲时再更新该值，从而避免阻塞更重要的渲染。

也就是说：

- 当 \`value\`（例如输入框值）频繁变化时，
- \`deferredValue\` 不会立刻变化，
- React 会等主线程空闲后再更新它。

这样，用户交互始终流畅，而昂贵的更新可以稍后执行。

## 五、useTransition vs useDeferredValue 对比

| 特性     | useTransition                  | useDeferredValue       |
| -------- | ------------------------------ | ---------------------- |
| 调用方式 | 主动包裹更新逻辑               | 被动延迟值             |
| 使用场景 | 控制“某段逻辑”延迟执行         | 控制“某个值”延迟生效   |
| 返回值   | \`[isPending, startTransition]\` | \`deferredValue\`        |
| 更新触发 | 由你决定（主动）               | React 自动调度（被动） |
| 常用场景 | 搜索、分页、导航               | 输入框值、防抖渲染     |

💡 简单理解：

> \`useTransition\` 是“手动延迟更新”， \`useDeferredValue\` 是“自动延迟某个值”。

## 六、实战案例：搜索列表优化

\`\`\`jsx
import React, { useState, useDeferredValue } from "react";

const bigList = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);

function Search() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  const filtered = bigList.filter((item) => item.toLowerCase().includes(deferredText.toLowerCase()));

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入搜索关键字" />
      {text !== deferredText && <p>筛选中...</p>}
      <ul>
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

✅ 优点：

- 输入框响应立刻；
- 数据过滤延后执行；
- UI 丝滑无阻塞。

## 七、性能原理解析（直观理解）

想象两个时间轴：

\`\`\`
用户输入 (高优先级)  ─────────────┐
                                   └──► 马上执行
过滤逻辑 (低优先级)   ──────── 延后执行
\`\`\`

- React 会在浏览器空闲时更新 \`deferredValue\`；
- 这样不会卡住用户的输入；
- 当空闲后才触发耗时渲染。

这正是 **Concurrent Rendering 并发模式** 的核心能力： 👉 “可中断的渲染 + 智能调度优先级”。

## 八、与防抖（debounce）的区别

| 对比项     | useDeferredValue     | debounce          |
| ---------- | -------------------- | ----------------- |
| 原理       | React 内部调度优先级 | 定时器延迟执行    |
| 响应速度   | 更平滑（React 控制） | 固定延迟时间      |
| 渲染一致性 | 由 React 保证        | 手动管理更新      |
| SSR 支持   | ✅                   | ❌                |
| 理想场景   | UI 渲染优化          | API 请求节流/防抖 |

👉 二者不是替代关系，可以**配合使用**：

- 用 \`debounce\` 降低 API 请求频率；
- 用 \`useDeferredValue\` 让 UI 渲染更丝滑。

## 九、最佳实践

| 建议                                            | 说明                      |
| ----------------------------------------------- | ------------------------- |
| ✅ 延迟值的使用要明确                           | 通常用于输入值、过滤条件  |
| ✅ 与 \`Suspense\` / \`useTransition\` 搭配更佳     | 提升 UI 体验              |
| ✅ 用于大列表、图表、复杂 DOM 渲染              | 显著优化性能              |
| ❌ 不要延迟关键交互的值（如输入框本身的 value） | 否则会感觉“输入延迟”      |
| ✅ 可通过比较原始值与延迟值显示“加载中”         | \`value !== deferredValue\` |
`;export{e as default};
