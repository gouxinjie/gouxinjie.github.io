# 利用 useEffect 处理竟态操作

---

[[toc]]

## 一、什么是竟态操作

例如有一个实时搜索功能，用户输入查询字符串，后端返回搜索结果。先发起的请求可能比后发起的请求更晚返回，导致显示错误用户的数据。解决这个问题就是一旦新的请求发起那么就中断旧的请求，无论旧的请求是否成功。

**下面是两种方案：**

- `AbortController`方案就是使用构造函数创建一个控制器实例来进行中断。

```js
const controller = new AbortController();
controller.abort();
```

- 利用 `useEffect` 的清理函数不进行请求的中断，直接舍弃过时的数据。

## 二、AbortController 方案（中断请求）

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetchResults(query, { signal: controller.signal })
    .then(setResults)
    .catch((e) => {
      if (e.name !== "AbortError") console.error(e);
    });

  return () => controller.abort();
}, [query]);
```

## 三、闭包方案（推荐-不中断请求）

```tsx
useEffect(() => {
  let ignore = false; // 标志位初始为false

  fetchResults(query).then((json) => {
    if (!ignore) setResults(json); // 只有ignore为false时才更新状态
  });

  return () => {
    ignore = true; // 清理函数中将ignore置为true
  };
}, [query]);
```

**上面代码执行的顺序如下：**

1，组件挂载/query 更新：每次 query 变化时，effect 重新执行。<br/> 2，发起请求前：声明局部变量 ignore = false。<br/> 3，请求完成后：检查 ignore，若为 false 则更新状态。<br/> 4，清理阶段：当 effect 再次执行（即 query 再次变化）或组件卸载时，会执行前一个 effect 的清理函数，将 ignore 设为 true，使之前的请求即使返回也不会更新状态

**也就是说：**<br/> 

✅ 每次输入都会触发独立的 effect 回调<br/> ✅ 每个回调都有自己独立的 ignore 变量（通过闭包隔离）<br/> ✅ 多个请求可能同时存在，但只有最新一个能生效

::: tip 关键特性：

- 闭包监狱：每个 ignore 被锁在自己的 effect 作用域里，互不干扰
- 清理链：新 effect 执行前，React 保证会执行前一个 effect 的清理函数
- 并行但受控：多个请求可能同时进行，但只有最新 effect 的 ignore 是 false

:::


## 四、useEffect 清理函数的执行时机

`useEffect`清理函数会在组件卸载时和依赖项变化时进行执行。

1, **组件卸载时**（`unmount`）

- 当组件从 DOM 中移除时，React 会执行清理函数。
- 例如：页面跳转、组件被条件渲染移除时。

2, **依赖项变化，导致 `useEffect` 重新执行前**

- **在下一次 `useEffect` 执行之前**，React 会先执行上一次的清理函数。
- 例如：`query` 变化时，会先清理旧的 `useEffect`，再运行新的 `useEffect`。
