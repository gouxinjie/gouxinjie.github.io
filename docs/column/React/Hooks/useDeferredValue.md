# 深入理解 React 的 useDeferredValue Hook

`useDeferredValue` 是 React 18 引入的并发特性`(Concurrent Feature)`之一，它允许你延迟更新某个非关键值，避免高优先级的更新被阻塞，从而提升用户体验和界面响应速度。

```javascript
const deferredValue = useDeferredValue(value);
```

::: tip 为什么需要 useDeferredValue？

在现代前端应用中，我们经常面临以下性能挑战：

1. **快速用户输入时的卡顿**：如搜索框连续输入时结果列表的渲染延迟
2. **复杂组件渲染阻塞交互**：大型数据可视化或列表渲染影响其他操作
3. **不必要的高优先级更新**：某些 UI 更新不需要立即反映

:::

`useDeferredValue` 通过延迟非关键值的更新来解决这些问题。

## 核心概念

### 1. 延迟值(Deferred Value)

- 接收一个值并返回该值的"延迟版本"
- 当原始值变化时，React 可能会延迟更新返回的延迟值
- 保证最终会与最新值同步

### 2. 优先级调度

- React 会根据用户交互优先级自动调度更新
- 高优先级更新（如输入）会优先处理
- 低优先级更新（如结果渲染）可能被推迟

## 基本用法

```javascript
import { useState, useDeferredValue } from "react";

function SearchResults({ query }) {
  // query是快速变化的prop
  const deferredQuery = useDeferredValue(query);

  // 基于延迟值计算（昂贵操作）
  const results = useMemo(() => {
    return searchData(deferredQuery);
  }, [deferredQuery]);

  return (
    <>
      {results.map((result) => (
        <ResultItem key={result.id} item={result} />
      ))}
    </>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <SearchResults query={query} />
    </div>
  );
}
```

::: tip 适用场景

1. **输入框与结果列表**：保持输入响应，延迟结果渲染
2. **大数据量渲染**：复杂图表或大型列表的延迟更新
3. **依赖外部数据的 UI**：当数据获取速度不一致时
4. **动画与交互**：确保关键动画不被阻塞

:::

## 与常规渲染的区别

| 特性         | 直接使用值  | useDeferredValue |
| ------------ | ----------- | ---------------- |
| **优先级**   | 高（紧急）  | 低（可延迟）     |
| **响应速度** | 可能阻塞 UI | 保持 UI 流畅     |
| **适用场景** | 关键 UI     | 非关键/后台 UI   |
| **渲染行为** | 立即更新    | 可能延迟更新     |

## 高级用法

### 1. 与 Suspense 结合

```javascript
function DataDisplay({ resource }) {
  const deferredResource = useDeferredValue(resource);

  return (
    <Suspense fallback={<Spinner />}>
      <DataContent resource={deferredResource} />
    </Suspense>
  );
}
```

### 2. 控制延迟时间

```javascript
// 可以传递配置对象指定超时时间
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

### 3. 与过渡状态配合

```javascript
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <ResultsList query={deferredQuery} />
    </div>
  );
}
```


## 实际案例：大型列表渲染

```javascript
function ProductList({ searchTerm }) {
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const isStale = deferredSearchTerm !== searchTerm;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
  }, [deferredSearchTerm]);

  return (
    <div>
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        {filteredProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      {isStale && <div>Updating results...</div>}
    </div>
  );
}
```

## 与 useTransition 的关系

`useDeferredValue` 和 `useTransition` 都是 React 并发特性，但有不同的使用场景：

| 特性         | useDeferredValue      | useTransition        |
| ------------ | --------------------- | -------------------- |
| **控制方式** | 被动（基于值变化）    | 主动（包装状态更新） |
| **最佳场景** | 接收 props/context 值 | 发起状态更新         |
| **代码位置** | 在消费值的地方        | 在更新状态的地方     |
| **视觉反馈** | 需要手动比较值        | 提供 isPending 标志  |

通常：

- 当你控制状态更新时，考虑 `useTransition`
- 当你接收一个值（如 props）时，考虑 `useDeferredValue`

## 总结

`useDeferredValue` 是 React 并发渲染模式的重要工具，它通过以下方式优化用户体验：

1. **保持 UI 响应**：优先处理用户关键交互
2. **智能值更新**：自动调度非关键值的更新时机
3. **简化性能优化**：相比手动防抖/节流更集成化
4. **提升感知性能**：即使总时间不变，感觉更流畅
