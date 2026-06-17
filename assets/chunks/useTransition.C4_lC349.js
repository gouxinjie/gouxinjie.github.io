const n=`# React 18 并发特性核心之一：useTransition

[[toc]]

> 在 React 18 之前，所有状态更新都是“同步阻塞”的。一旦触发更新，整个组件都会重新渲染，即使这次更新非常耗时，也无法被中断。
>
> React 18 引入了 **Concurrent Rendering（并发渲染）**，而 \`useTransition\` 正是让我们能够 **“标记低优先级更新”** 的关键 Hook。

## 一、useTransition 是什么？

\`useTransition\` 是 React 18 新增的一个 Hook，用于**区分“紧急更新”和“非紧急更新”**。

简单来说：

> 当你希望某个状态更新“不那么紧急”，不阻塞用户的交互，就可以用 \`useTransition\`。

### 📘 基本语法：

\`\`\`tsx
const [isPending, startTransition] = useTransition();
\`\`\`

| 返回值            | 类型                 | 说明                             |
| ----------------- | -------------------- | -------------------------------- |
| \`isPending\`       | \`boolean\`            | 表示是否有处于“过渡状态”的更新   |
| \`startTransition\` | \`(callback) => void\` | 将一段更新标记为“非紧急”过渡更新 |

## 二、为什么需要 useTransition？

举个常见的例子 👇

\`\`\`jsx
function SearchApp() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setList(filterHeavy(e.target.value)); // 模拟一个耗时操作
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <List data={list} />
    </div>
  );
}
\`\`\`

💥 问题：

- 每次输入文字，\`filterHeavy\` 都会导致渲染卡顿；
- 用户输入体验变得非常糟糕。

## 三、useTransition 的解决方案

我们可以让输入更新立即生效，而让过滤操作延迟执行。

\`\`\`jsx
import React, { useState, useTransition } from "react";

function SearchApp() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // ✅ 紧急更新：立即响应用户输入

    // ⏳ 非紧急更新：标记为过渡
    startTransition(() => {
      setList(filterHeavy(value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>加载中...</span>}
      <List data={list} />
    </div>
  );
}
\`\`\`

✅ 效果：

- 输入框立刻响应，不再卡顿；
- 数据更新被延后，但不会影响交互；
- \`isPending\` 可用于显示“加载中”状态。

## 四、useTransition 的工作原理

可以理解为：

> React 把 \`startTransition\` 里面的更新标记为“低优先级”。

React 内部维护了不同的优先级调度：

- **紧急更新（Urgent）**：输入、点击、动画等需要即时响应的操作；
- **过渡更新（Transition）**：数据请求、筛选、渲染列表等可以稍后执行的操作。

当两种更新同时发生时：

- React 会**优先处理紧急更新**；
- **过渡更新可被打断或延迟**，直到浏览器空闲再渲染；
- 因此，不会阻塞主线程，也不会卡住输入。

🧠 这就是 React 并发模式的核心思想之一：**可中断渲染（Interruptible Rendering）**。

## 五、实际应用场景

### 1️⃣ 搜索过滤（最常见）

用户输入关键字时立即响应输入，列表异步更新。

\`\`\`jsx
startTransition(() => setFilteredList(...));
\`\`\`

### 2️⃣ 复杂路由切换

在路由跳转时，用 \`useTransition\` 让界面更平滑。

\`\`\`jsx
const [isPending, startTransition] = useTransition();

const navigatePage = (path) => {
  startTransition(() => {
    navigate(path);
  });
};
\`\`\`

> ✅ 页面跳转立即响应，但耗时组件渲染在后台完成。

### 3️⃣ 大量渲染的组件

例如虚拟列表、图表、Markdown 渲染器。

\`\`\`jsx
startTransition(() => {
  setRenderData(heavyRenderTransform(data));
});
\`\`\`

## 六、isPending 的妙用

\`isPending\` 是 React 自动提供的一个布尔值，用来表示是否有一个正在进行的 transition。

\`\`\`jsx
{
  isPending && <Spinner />;
}
\`\`\`

它的常见用途：

- 显示加载提示；
- 禁用按钮；
- 延迟动画过渡。

## 七、useTransition vs useDeferredValue

| Hook               | 用途                                 | 区别                 |
| ------------------ | ------------------------------------ | -------------------- |
| \`useTransition\`    | 将一段状态更新标记为过渡（主动触发） | 你手动包裹更新逻辑   |
| \`useDeferredValue\` | 将一个值“延迟”更新（被动延迟）       | React 自动延迟更新值 |

👉 简单理解：

- \`useTransition\` 是 **主动延迟**（你决定何时、哪个更新是过渡）。
- \`useDeferredValue\` 是 **被动延迟**（你传入一个值，让它慢一点更新）。

## 八、最佳实践

| 建议                                            | 说明                       |
| ----------------------------------------------- | -------------------------- |
| ✅ 将耗时更新包在 \`startTransition\` 中          | 防止阻塞交互               |
| ✅ 使用 \`isPending\` 提示用户等待                | 提升体验                   |
| ❌ 不要在紧急事件中延迟关键状态（如输入值本身） | 否则会出现延迟输入         |
| ✅ 可与 Suspense 搭配使用                       | 过渡渲染异步组件时非常丝滑 |

## 九、完整实战：防抖搜索优化

\`\`\`jsx
import React, { useState, useTransition } from "react";

function HeavySearch() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);

    startTransition(() => {
      const filtered = mockList.filter((item) => item.toLowerCase().includes(val.toLowerCase()));
      setList(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleInput} placeholder="搜索..." />
      {isPending && <p>加载中...</p>}
      <ul>
        {list.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </div>
  );
}

const mockList = Array.from({ length: 5000 }, (_, i) => \`Item \${i}\`);
export default HeavySearch;
\`\`\`

🔹 即使渲染 5000 条数据，输入依旧流畅。 🔹 \`useTransition\` 让 React 自动调度更新，不再阻塞主线程。
`;export{n as default};
