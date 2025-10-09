# React 自定义 Hook 常用示例封装

[[toc]]

> 自定义 Hook 的核心理念是：**以 `use` 开头，复用状态逻辑**  
> 而不是 UI 组件。

## 1️⃣ `useToggle` —— 布尔状态切换

常用于开关、模态框、菜单折叠等。

```jsx
import { useState, useCallback } from "react";

function useToggle(initialValue = false) {
  const [state, setState] = useState(initialValue);
  const toggle = useCallback(() => setState((prev) => !prev), []);
  return [state, toggle, setState];
}

// 使用示例
function Example() {
  const [open, toggleOpen] = useToggle(false);
  return <button onClick={toggleOpen}>{open ? "关闭" : "打开"}</button>;
}
```

✅ 优点：

- 逻辑简洁、可复用
- 支持初始值和直接设置值

---

## 2️⃣ `useLocalStorage` —— 本地存储状态

将状态与 `localStorage` 同步，刷新页面也能保留。

```jsx
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 使用示例
function ThemeSelector() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>;
}
```

✅ 优点：

- 自动同步本地存储
- 减少重复代码

---

## 3️⃣ `usePrevious` —— 获取上一次状态值

在动画、对比前后状态时非常实用。

```jsx
import { useRef, useEffect } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// 使用示例
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      当前: {count}, 上一次: {prevCount}
    </div>
  );
}
```

✅ 优点：

- 简单、轻量
- 不触发额外渲染

---

## 4️⃣ `useFetch` —— 数据请求封装

封装 fetch 请求逻辑，返回 loading、data、error。

```jsx
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// 使用示例
function App() {
  const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/todos/1");

  if (loading) return <p>加载中...</p>;
  if (error) return <p>请求错误</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

✅ 优点：

- 统一处理请求状态
- 简化组件逻辑

---

## 5️⃣ `useOnClickOutside` —— 点击外部关闭

用于模态框、下拉菜单等场景。

```jsx
import { useEffect } from "react";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

// 使用示例
import { useRef, useState } from "react";

function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setOpen((o) => !o)}>菜单</button>
      {open && (
        <ul>
          <li>选项1</li>
          <li>选项2</li>
        </ul>
      )}
    </div>
  );
}
```

✅ 优点：

- 简化事件监听
- 可复用在任意组件

---

**自定义 Hook 封装原则**

1. **逻辑复用而非 UI 复用**
2. **以 use 开头**
3. **只包含 Hook 调用和内部状态逻辑**
4. **返回必要数据或函数，不依赖组件外部**
