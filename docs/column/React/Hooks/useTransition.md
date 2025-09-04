# 深入理解 React 的 useTransition Hook

`useTransition` 是`React 18`引入的一个并发特性`(Concurrent Feature) Hook`，它允许你将某些状态更新标记为"非紧急"，使这些更新不会阻塞用户界面，从而提升用户体验。

```javascript
const [isPending, startTransition] = useTransition();
```

::: tip 为什么需要 useTransition？

在现代 Web 应用中，我们经常遇到以下问题：

1. **大型渲染任务阻塞交互**：复杂组件树渲染导致界面卡顿
2. **快速输入时的性能问题**：如搜索框连续输入时的延迟
3. **不必要的高优先级更新**：某些后台更新不需要立即反映到 UI 上

:::

`useTransition` 通过将更新分类为"紧急"和"非紧急"来解决这些问题。

## 核心概念

### 1. 过渡(Transition)

React 将状态更新分为两种：

- **紧急更新**：如输入、点击等需要立即响应的交互
- **过渡更新**：可以延迟的 UI 更新，如搜索结果的渲染

### 2. isPending 标志

指示是否有过渡更新正在进行

### 3. startTransition 函数

用于将状态更新包装为非紧急更新

## 基本用法

```javascript
import { useState, useTransition } from "react";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value); // 紧急更新：立即显示输入

    startTransition(() => {
      // 非紧急更新：搜索结果可以稍后显示
      setResults(searchLargeList(value));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <div>Loading...</div> : <ResultsList items={results} />}
    </div>
  );
}
```

::: tip 适用场景

1. **搜索/筛选大型列表**：用户输入时保持输入响应，稍后显示结果
2. **标签页切换**：快速切换标签时不等待内容完全加载
3. **数据获取**：后台数据加载不影响主要交互
4. **复杂渲染**：大型组件树的渲染不阻塞简单交互

:::

## 与常规更新的区别

| 特性         | 常规更新(setState) | 过渡更新(startTransition) |
| ------------ | ------------------ | ------------------------- |
| **优先级**   | 高（紧急）         | 低（非紧急）              |
| **用户体验** | 可能阻塞交互       | 保持 UI 响应              |
| **适用场景** | 用户直接交互       | 后台计算/渲染             |
| **React 18** | 同步渲染           | 并发渲染                  |

## 高级用法

### 1. 与 Suspense 结合

```javascript
function App() {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      setResource(fetchNewData());
    });
  }

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {isPending ? "Loading..." : "Load Data"}
      </button>
      <Suspense fallback={<Spinner />}>
        <DataDisplay resource={resource} />
      </Suspense>
    </>
  );
}
```

### 2. 多个过渡协调

```javascript
function ComplexComponent() {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  const [isPending, startTransition] = useTransition();

  function updateAll() {
    startTransition(() => {
      setState1(compute1());
      setState2(compute2());
    });
  }

  // ...
}
```

## 性能优化技巧

1. **合理区分紧急/非紧急更新**：只有真正可以延迟的更新才用 startTransition
2. **避免过度使用**：不必要的过渡会增加复杂性
3. **结合 useDeferredValue**：对只读值使用 useDeferredValue 可能更简单
4. **监控 isPending**：提供加载状态提升用户体验

## 注意事项

1. **不是性能银弹**：不能使慢代码变快，只是优化调度
2. **状态一致性**：过渡内的多个更新会一起处理
3. **不可取消**：一旦开始就会完成
4. **与类组件不兼容**：仅适用于函数组件
5. **SSR 行为**：服务端渲染时不支持过渡

## 实际案例：搜索组件优化

```javascript
function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  // 假设这是一个昂贵的计算
  const filteredResults = filterItems(query, filter);

  function handleQueryChange(e) {
    const value = e.target.value;
    setQuery(value); // 紧急：立即显示输入

    startTransition(() => {
      setFilter(value); // 非紧急：稍后更新筛选结果
    });
  }

  return (
    <div>
      <input value={query} onChange={handleQueryChange} placeholder="Search..." />

      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {filteredResults.map((item) => (
          <ResultItem key={item.id} item={item} />
        ))}
      </div>

      {isPending && <div className="loading-indicator">Updating...</div>}
    </div>
  );
}
```